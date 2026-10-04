import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';


import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b border-gray-100 py-2">
      <span className="font-medium text-gray-700">
        {label}
      </span>

      <span className="text-gray-900 text-right">
        {value || '—'}
      </span>
    </div>
  );
}

const KycDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    Promise.all([
      api.getKyc(id, token),
      api.getProvinces(token),
      api.getDistricts(token),
      api.getMunicipalities(token),
    ])
      .then(
        ([
          kycRecord,
          provinceList,
          districtList,
          municipalityList,
        ]) => {
          setRecord(kycRecord);
          setProvinces(provinceList);
          setDistricts(districtList);
          setMunicipalities(municipalityList);
        }
      )
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Failed to load KYC record'
        );
      });
  }, [id, token]);

  function provinceName(provinceId) {
    return (
      provinces.find(
        (province) => province.id === provinceId
      )?.name ?? ''
    );
  }

  function districtName(districtId) {
    return (
      districts.find(
        (district) => district.id === districtId
      )?.name ?? ''
    );
  }

  function municipalityName(municipalityId) {
    return (
      municipalities.find(
        (municipality) => municipality.id === municipalityId
      )?.name ?? ''
    );
  }

  async function handleDelete() {
    if (!token || !id || !record) return;

    const confirmed = window.confirm(
      `Delete KYC record for "${record.fullName}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await api.deleteKyc(id, token);

      navigate('/kyc-lists', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to delete KYC record'
      );

      setIsDeleting(false);
    }
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center mt-10 gap-4 px-4">
          <p
            className="text-red-600 text-sm"
            role="alert"
          >
            {error}
          </p>

          <Link
            className="text-purple-700 underline"
            to="/kyc-lists"
          >
            Back to KYC records
          </Link>
        </div>
      </Layout>
    );
  }

  if (!record) {
    return (
      <Layout>
        <div className="flex justify-center mt-19">
          Loading…
        </div>
      </Layout>
    );
  }

  const imageUrl = api.getKycImageUrl(record.imageUrl);

  return (
    <Layout>
      <div className="flex flex-col items-center py-10 px-4">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-semibold text-purple-700 mb-6">
          {record.fullName}
        </h1>

        <div className="w-full max-w-2xl space-y-4">

          {/* KYC PHOTO */}
          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-3">
              KYC Photo
            </h2>

            <div className="flex justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${record.fullName} KYC`}
                  className="w-40 h-40 object-cover rounded-md border border-gray-200"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 text-sm">
                  No photo available
                </div>
              )}
            </div>
          </section>

          {/* PERSONAL DETAILS */}
          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-2">
              Personal Details
            </h2>

            <Row
              label="Full Name"
              value={record.fullName}
            />

            <Row
              label="Gender"
              value={record.gender}
            />

            <Row
              label="Date of Birth (BS)"
              value={record.dobBs}
            />

            <Row
              label="Date of Birth (AD)"
              value={record.dobAd}
            />

            <Row
              label="Phone Number"
              value={record.phoneNumber}
            />

            <Row
              label="Email"
              value={record.email}
            />
          </section>

          {/* CITIZENSHIP DETAILS */}
          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-2">
              Citizenship Details
            </h2>

            <Row
              label="Citizenship Number"
              value={record.citizenshipNumber}
            />

            <Row
              label="Issued District"
              value={record.citizenshipIssuedDistrict}
            />

            <Row
              label="Issued Date"
              value={record.citizenshipIssuedDate}
            />
          </section>

          {/* PERMANENT ADDRESS */}
          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-2">
              Permanent Address
            </h2>

            <Row
              label="Province"
              value={provinceName(
                record.permanentProvinceId
              )}
            />

            <Row
              label="District"
              value={districtName(
                record.permanentDistrictId
              )}
            />

            <Row
              label="Municipality"
              value={municipalityName(
                record.permanentMunicipalityId
              )}
            />

            <Row
              label="Ward No"
              value={record.permanentWardNo}
            />
          </section>

          {/* TEMPORARY ADDRESS */}
          {record.temporaryMunicipalityId && (
            <section className="rounded-md border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-purple-700 mb-2">
                Temporary Address
              </h2>

              <Row
                label="Province"
                value={provinceName(
                  record.temporaryProvinceId
                )}
              />

              <Row
                label="District"
                value={districtName(
                  record.temporaryDistrictId
                )}
              />

              <Row
                label="Municipality"
                value={municipalityName(
                  record.temporaryMunicipalityId
                )}
              />

              <Row
                label="Ward No"
                value={record.temporaryWardNo}
              />
            </section>
          )}

          {/* FAMILY & OTHER DETAILS */}
          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-2">
              Family & Other Details
            </h2>

            <Row
              label="Father's Name"
              value={record.fatherName}
            />

            <Row
              label="Mother's Name"
              value={record.motherName}
            />

            <Row
              label="Grandfather's Name"
              value={record.grandfatherName}
            />

            <Row
              label="Grandmother's Name"
              value={record.grandmotherName}
            />

            <Row
              label="Occupation"
              value={record.occupation}
            />

            <Row
              label="PAN Number"
              value={record.panNumber}
            />
          </section>

          {/* RECORD INFORMATION */}
          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-2">
              Record Information
            </h2>

            <Row
              label="Created By"
              value={record.createdBy}
            />

            <Row
              label="Created Date"
              value={
                record.createdDate
                  ? new Date(
                      record.createdDate
                    )
                      .toISOString()
                      .slice(0, 10)
                  : ''
              }
            />

            <Row
              label="Last Updated By"
              value={record.lastUpdatedBy}
            />

            <Row
              label="Last Updated Date"
              value={
                record.lastUpdatedDate
                  ? new Date(
                      record.lastUpdatedDate
                    )
                      .toISOString()
                      .slice(0, 10)
                  : ''
              }
            />
          </section>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-6">

          <button
            className="px-5 py-3 bg-purple-300 rounded-md hover:bg-purple-700 hover:text-white"
            onClick={() =>
              navigate(`/kyc-form/${record.id}/edit`)
            }
          >
            Edit
          </button>

          <button
            className="px-5 py-3 bg-red-700 text-white rounded-md hover:bg-red-500 disabled:opacity-50"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>

          <Link
            className="px-5 py-3 text-center bg-gray-200 rounded-md hover:bg-gray-300"
            to="/kyc-lists"
          >
            Back
          </Link>

        </div>

      </div>
    </Layout>
  );
};

export default KycDetails;