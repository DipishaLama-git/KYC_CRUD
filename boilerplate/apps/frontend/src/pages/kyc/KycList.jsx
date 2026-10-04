import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';

const KycList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  function loadRecords() {
    if (!token) return;

    Promise.all([
      api.getKycs(token),
      api.getMunicipalities(token),
      api.getDistricts(token),
      api.getProvinces(token),
    ])
      .then(([kycRecords, municipalityList, districtList, provinceList]) => {
        setRecords(kycRecords);
        setMunicipalities(municipalityList);
        setDistricts(districtList);
        setProvinces(provinceList);
      })
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : 'Failed to load KYC records'
        )
      );
  }

  useEffect(() => {
    loadRecords();
  }, [token]);

  function municipalityName(municipalityId) {
    return (
      municipalities.find(
        (municipality) => municipality.id === municipalityId
      )?.name ?? '—'
    );
  }

  function districtName(districtId) {
    return (
      districts.find(
        (district) => district.id === districtId
      )?.name ?? ''
    );
  }

  function provinceName(provinceId) {
    return (
      provinces.find(
        (province) => province.id === provinceId
      )?.name ?? ''
    );
  }

  /*
   * Build a per-record set of searchable field values so a single
   * query can match across name, id, district and other attributes,
   * similar to an Elasticsearch multi_match query.
   */
  const searchIndex = useMemo(() => {
    return records.map((record) => ({
      record,
      fields: [
        record.id,
        record.fullName,
        record.gender,
        record.citizenshipNumber,
        record.phoneNumber,
        record.email,
        record.panNumber,
        record.citizenshipIssuedDistrict,
        districtName(record.permanentDistrictId),
        districtName(record.temporaryDistrictId),
        municipalityName(record.permanentMunicipalityId),
        municipalityName(record.temporaryMunicipalityId),
        provinceName(record.permanentProvinceId),
        provinceName(record.temporaryProvinceId),
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase()),
    }));
  }, [records, districts, municipalities, provinces]);

  const filteredRecords = useMemo(() => {
    const terms = searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (terms.length === 0) {
      return records;
    }

    const scored = [];

    for (const { record, fields } of searchIndex) {
      let score = 0;
      let matchesAllTerms = true;

      for (const term of terms) {
        let termScore = 0;

        for (const field of fields) {
          if (field === term) {
            termScore = Math.max(termScore, 3);
          } else if (field.startsWith(term)) {
            termScore = Math.max(termScore, 2);
          } else if (field.includes(term)) {
            termScore = Math.max(termScore, 1);
          }
        }

        if (termScore === 0) {
          matchesAllTerms = false;
          break;
        }

        score += termScore;
      }

      if (matchesAllTerms) {
        scored.push({ record, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    return scored.map((item) => item.record);
  }, [records, searchIndex, searchQuery]);

  // Reset to the first page whenever the result set changes underneath the user
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, records]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / pageSize)
  );

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  /*
   * Windowed page numbers with ellipses, e.g. 1 … 4 5 [6] 7 8 … 20
   */
  const pageNumbers = useMemo(() => {
    const delta = 1;
    const pages = [];

    for (let page = 1; page <= totalPages; page += 1) {
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - delta && page <= currentPage + delta)
      ) {
        pages.push(page);
      } else if (pages[pages.length - 1] !== '…') {
        pages.push('…');
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  async function handleDelete(record) {
    if (!token) return;

    if (
      !confirm(
        `Delete KYC record for "${record.fullName}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(record.id);
    setError(null);

    try {
      await api.deleteKyc(record.id, token);

      setRecords((current) =>
        current.filter((r) => r.id !== record.id)
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to delete KYC record'
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleImportCsv(event) {
    const file = event.target.files?.[0];

    if (!file || !token) return;

    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const result = await api.importKycCsv(file, token);

      setImportResult(result);
      loadRecords();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to import CSV file'
      );
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center px-4">

        <div className="w-full max-w-7xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-7 mb-6">

            <h1 className="text-3xl font-medium text-purple-700">
              KYC Records
            </h1>

            <div className="flex gap-2">

              <input
                type="file"
                accept=".csv,text/csv"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImportCsv}
              />

              <button
                className="border border-purple-700 text-purple-700 rounded-md px-4 py-2 hover:bg-purple-50 disabled:opacity-50"
                disabled={importing}
                onClick={() => fileInputRef.current?.click()}
              >
                {importing ? 'Importing…' : 'Import CSV'}
              </button>

              <button
                className="bg-purple-700 text-white rounded-md px-4 py-2 hover:bg-purple-800"
                onClick={() => navigate('/kyc-form')}
              >
                + Add KYC
              </button>

            </div>

          </div>

          {/* Search */}
          <div className="mb-4 relative max-w-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, citizenship no., phone, district, municipality…"
              className="w-full rounded-md border border-gray-300 pl-9 pr-9 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Import summary */}
          {importResult && (
            <div className="mb-4 rounded-md border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-800">
              <p>
                Imported {importResult.successCount} of {importResult.totalRows} row(s).
                {importResult.failedCount > 0 && ` ${importResult.failedCount} row(s) failed.`}
              </p>

              {importResult.errors?.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-red-700">
                  {importResult.errors.map((item) => (
                    <li key={item.row}>
                      Row {item.row}: {item.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p
              className="text-red-600 text-sm mb-4"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Empty State */}
          {filteredRecords.length === 0 && !error && (
            <div className="border border-gray-200 rounded-md p-8 text-center text-gray-500">
              {records.length === 0
                ? 'No KYC records found.'
                : 'No records match your search.'}
            </div>
          )}

          {/* Table */}
          {filteredRecords.length > 0 && (
            <div className="overflow-x-auto border border-gray-200 rounded-md">

              <table className="w-full text-left">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Photo
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Full Name
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Gender
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Citizenship No.
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Phone
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Municipality
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {paginatedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >

                      {/* Photo */}
                      <td className="px-5 py-3">

                        {record.imageUrl ? (
                          <img
                            src={api.getKycImageUrl(record.imageUrl)}
                            alt={record.fullName}
                            className="w-12 h-12 object-cover rounded-full border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs">
                            No Photo
                          </div>
                        )}

                      </td>

                      {/* Full Name */}
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {record.fullName}
                      </td>

                      {/* Gender */}
                      <td className="px-5 py-3 text-gray-700">
                        {record.gender}
                      </td>

                      {/* Citizenship Number */}
                      <td className="px-5 py-3 text-gray-700">
                        {record.citizenshipNumber}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3 text-gray-700">
                        {record.phoneNumber}
                      </td>

                      {/* Municipality */}
                      <td className="px-5 py-3 text-gray-700">
                        {municipalityName(
                          record.permanentMunicipalityId
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">

                        <div className="flex gap-2">

                          <button
                            className="px-3 py-2 bg-purple-300 rounded-md hover:bg-purple-700 hover:text-white"
                            onClick={() =>
                              navigate(
                                `/kyc-details/${record.id}`
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="px-3 py-2 bg-purple-300 rounded-md hover:bg-purple-700 hover:text-white"
                            onClick={() =>
                              navigate(
                                `/kyc-form/${record.id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="px-3 py-2 bg-red-700 text-white rounded-md hover:bg-red-500 disabled:opacity-50"
                            disabled={
                              deletingId === record.id
                            }
                            onClick={() =>
                              handleDelete(record)
                            }
                          >
                            {deletingId === record.id
                              ? 'Deleting…'
                              : 'Delete'}
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          {/* Pagination */}
          {filteredRecords.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>
                  Showing{' '}
                  <span className="font-medium text-gray-900">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium text-gray-900">
                    {Math.min(currentPage * pageSize, filteredRecords.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-gray-900">
                    {filteredRecords.length}
                  </span>{' '}
                  records
                </span>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((page, index) =>
                  page === '…' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                      className={`rounded-md px-3 py-1.5 ${
                        page === currentPage
                          ? 'bg-purple-700 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
};

export default KycList;