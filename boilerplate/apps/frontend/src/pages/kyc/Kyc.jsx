import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';

// react-datepicker works with Date objects; the form stores plain yyyy-MM-dd strings.
function parseDateInputValue(value) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function formatDateInputValue(date) {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const datePickerInputClassName =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none';

// Calendar popup + day cells are themed entirely with Tailwind via react-datepicker's class props.
const datePickerCalendarClassName =
  '!rounded-lg !border-gray-200 !font-sans !shadow-lg';

function datePickerDayClassName() {
  return (
    '!rounded-md hover:!bg-purple-100 ' +
    '[&.react-datepicker__day--selected]:!bg-purple-700 [&.react-datepicker__day--selected]:!text-white ' +
    '[&.react-datepicker__day--keyboard-selected]:!bg-purple-700 [&.react-datepicker__day--keyboard-selected]:!text-white ' +
    '[&.react-datepicker__day--today]:!font-semibold'
  );
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DATE_PICKER_YEAR_RANGE = Array.from(
  { length: 100 },
  (_, index) => new Date().getFullYear() - index
);

// Fully Tailwind-styled header so the month/year switcher matches the app theme.
function renderDatePickerHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-2 pb-2">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="rounded-md px-2 py-1 text-purple-700 hover:bg-purple-100 disabled:opacity-30"
      >
        ‹
      </button>

      <div className="flex gap-1">
        <select
          value={MONTH_NAMES[date.getMonth()]}
          onChange={({ target: { value } }) =>
            changeMonth(MONTH_NAMES.indexOf(value))
          }
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
        >
          {MONTH_NAMES.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(Number(value))}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
        >
          {DATE_PICKER_YEAR_RANGE.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="rounded-md px-2 py-1 text-purple-700 hover:bg-purple-100 disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
}

const emptyForm = {
  fullName: '',
  gender: 'Male',

  dobBs: '',
  dobAd: '',

  citizenshipNumber: '',
  citizenshipIssuedDistrict: '',
  citizenshipIssuedDate: '',

  phoneNumber: '',
  email: '',

  permanentMunicipalityId: '',
  permanentWardNo: '',

  temporaryMunicipalityId: '',
  temporaryWardNo: '',

  fatherName: '',
  motherName: '',
  grandfatherName: '',
  grandmotherName: '',

  occupation: '',
  panNumber: '',
};

function AddressBlock({
  title,
  municipalities,
  districts,
  provinces,
  municipalityId,
  wardNo,
  onMunicipalityChange,
  onWardChange,
  disabled = false,
}) {
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');

  // Keep province/district selects in sync when a municipality is preloaded (e.g. edit mode)
  useEffect(() => {
    if (!municipalityId) {
      return;
    }

    const municipality = municipalities.find(
      (item) => String(item.id) === String(municipalityId)
    );

    if (!municipality) return;

    const district = districts.find(
      (item) => String(item.id) === String(municipality.districtId)
    );

    if (!district) return;

    setDistrictId(String(district.id));
    setProvinceId(String(district.provinceId));
  }, [municipalityId, municipalities, districts]);

  const filteredDistricts = useMemo(() => {
    if (!provinceId) return [];

    return districts.filter(
      (district) => String(district.provinceId) === String(provinceId)
    );
  }, [districts, provinceId]);

  const filteredMunicipalities = useMemo(() => {
    if (!districtId) return [];

    return municipalities.filter(
      (municipality) => String(municipality.districtId) === String(districtId)
    );
  }, [municipalities, districtId]);

  function handleProvinceChange(value) {
    setProvinceId(value);
    setDistrictId('');
    onMunicipalityChange('');
  }

  function handleDistrictChange(value) {
    setDistrictId(value);
    onMunicipalityChange('');
  }

  return (
    <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
      <legend className="px-2 text-sm font-semibold text-purple-700">
        {title}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Province
          </label>

          <select
            value={provinceId}
            onChange={(e) => handleProvinceChange(e.target.value)}
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-50"
          >
            <option value="">
              Select Province
            </option>

            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            District
          </label>

          <select
            value={districtId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={disabled || !provinceId}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-50"
          >
            <option value="">
              Select District
            </option>

            {filteredDistricts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Municipality
          </label>

          <select
            value={municipalityId}
            onChange={(e) =>
              onMunicipalityChange(e.target.value)
            }
            disabled={disabled || !districtId}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-50"
          >
            <option value="">
              Select Municipality
            </option>

            {filteredMunicipalities.map((municipality) => (
              <option
                key={municipality.id}
                value={municipality.id}
              >
                {municipality.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ward */}
      <div className="max-w-xs">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Ward No.
        </label>

        <input
          type="number"
          min="1"
          value={wardNo}
          onChange={(e) =>
            onWardChange(e.target.value)
          }
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
          placeholder="Enter ward number"
        />
      </div>
    </fieldset>
  );
}

export default function Kyc() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState(emptyForm);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [existingImageUrl, setExistingImageUrl] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [sameAsPermanent, setSameAsPermanent] =
    useState(false);

  /*
   * Reset form when creating a new KYC
   */
  useEffect(() => {
    if (!isEditMode) {
      setForm({
        ...emptyForm,
      });

      setSelectedImage(null);
      setImagePreview(null);
      setExistingImageUrl(null);
      setError(null);
      setSameAsPermanent(false);
    }
  }, [isEditMode]);

  /*
   * Load reference data
   */
  useEffect(() => {
    if (!token) return;

    async function loadReferenceData() {
      try {
        const [
          provinceData,
          districtData,
          municipalityData,
        ] = await Promise.all([
          api.getProvinces(token),
          api.getDistricts(token),
          api.getMunicipalities(token),
        ]);

        setProvinces(
          Array.isArray(provinceData)
            ? provinceData
            : provinceData?.data || []
        );

        setDistricts(
          Array.isArray(districtData)
            ? districtData
            : districtData?.data || []
        );

        setMunicipalities(
          Array.isArray(municipalityData)
            ? municipalityData
            : municipalityData?.data || []
        );
      } catch (err) {
        console.error(
          'REFERENCE DATA ERROR:',
          err
        );

        setError(
          err instanceof ApiError
            ? err.message
            : 'Failed to load address data'
        );
      }
    }

    loadReferenceData();
  }, [token]);

  /*
   * Load existing KYC for edit
   */
  useEffect(() => {
    if (!isEditMode || !id || !token) {
      setLoading(false);
      return;
    }

    async function loadKyc() {
      try {
        setLoading(true);

        const record = await api.getKyc(
          id,
          token
        );

        setForm({
          fullName: record.fullName ?? '',
          gender: record.gender ?? 'Male',

          dobBs: record.dobBs ?? '',
          dobAd: record.dobAd ?? '',

          citizenshipNumber:
            record.citizenshipNumber ?? '',

          citizenshipIssuedDistrict:
            record.citizenshipIssuedDistrict ?? '',

          citizenshipIssuedDate:
            record.citizenshipIssuedDate
              ? String(
                  record.citizenshipIssuedDate
                ).slice(0, 10)
              : '',

          phoneNumber:
            record.phoneNumber ?? '',

          email: record.email ?? '',

          permanentMunicipalityId:
            record.permanentMunicipalityId ?? '',

          permanentWardNo:
            record.permanentWardNo ?? '',

          temporaryMunicipalityId:
            record.temporaryMunicipalityId ?? '',

          temporaryWardNo:
            record.temporaryWardNo ?? '',

          fatherName:
            record.fatherName ?? '',

          motherName:
            record.motherName ?? '',

          grandfatherName:
            record.grandfatherName ?? '',

          grandmotherName:
            record.grandmotherName ?? '',

          occupation:
            record.occupation ?? '',

          panNumber:
            record.panNumber ?? '',
        });

        setSameAsPermanent(
          Boolean(record.temporaryMunicipalityId) &&
            String(record.temporaryMunicipalityId) ===
              String(record.permanentMunicipalityId) &&
            String(record.temporaryWardNo ?? '') ===
              String(record.permanentWardNo ?? '')
        );

        if (record.imageUrl) {
          setExistingImageUrl(
            api.getKycImageUrl(
              record.imageUrl
            )
          );
        } else {
          setExistingImageUrl(null);
        }
      } catch (err) {
        console.error(
          'LOAD KYC ERROR:',
          err
        );

        setError(
          err instanceof ApiError
            ? err.message
            : 'Failed to load KYC record'
        );
      } finally {
        setLoading(false);
      }
    }

    loadKyc();
  }, [id, isEditMode, token]);

  /*
   * Find location from municipality
   */
  const permanentLocation = useMemo(() => {
    const municipality =
      municipalities.find(
        (item) =>
          String(item.id) ===
          String(
            form.permanentMunicipalityId
          )
      );

    const district =
      districts.find(
        (item) => String(item.id) === String(municipality?.districtId)
      );

    const province =
      provinces.find(
        (item) => String(item.id) === String(district?.provinceId)
      );

    return {
      municipality,
      districtId: district?.id || null,
      provinceId: province?.id || null,
    };
  }, [
    municipalities,
    districts,
    provinces,
    form.permanentMunicipalityId,
  ]);

  const temporaryLocation = useMemo(() => {
    const municipality =
      municipalities.find(
        (item) =>
          String(item.id) ===
          String(
            form.temporaryMunicipalityId
          )
      );

    const district =
      districts.find(
        (item) => String(item.id) === String(municipality?.districtId)
      );

    const province =
      provinces.find(
        (item) => String(item.id) === String(district?.provinceId)
      );

    return {
      municipality,
      districtId: district?.id || null,
      provinceId: province?.id || null,
    };
  }, [
    municipalities,
    districts,
    provinces,
    form.temporaryMunicipalityId,
  ]);

  /*
   * Keep temporary address in sync with permanent
   * address whenever "same as permanent" is checked
   */
  useEffect(() => {
    if (!sameAsPermanent) return;

    setForm((previous) => ({
      ...previous,
      temporaryMunicipalityId: previous.permanentMunicipalityId,
      temporaryWardNo: previous.permanentWardNo,
    }));
  }, [
    sameAsPermanent,
    form.permanentMunicipalityId,
    form.permanentWardNo,
  ]);

  /*
   * Generic form update
   */
  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /*
   * Toggle "same as permanent" for temporary address
   */
  function handleSameAsPermanentChange(checked) {
    setSameAsPermanent(checked);

    if (checked) {
      setForm((previous) => ({
        ...previous,
        temporaryMunicipalityId: previous.permanentMunicipalityId,
        temporaryWardNo: previous.permanentWardNo,
      }));
    } else {
      setForm((previous) => ({
        ...previous,
        temporaryMunicipalityId: '',
        temporaryWardNo: '',
      }));
    }
  }

  /*
   * BS date change
   */
  function handleBsChange(value) {
    updateField('dobBs', value);

    if (!value) {
      updateField('dobAd', '');
      return;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return;
    }

    try {
      const adDate = bsToAd(value);

      updateField('dobAd', adDate);
      setError(null);
    } catch {
      setError(
        'Invalid BS date. Please use YYYY-MM-DD.'
      );
    }
  }

  /*
   * AD date change
   */
  function handleAdChange(value) {
    updateField('dobAd', value);

    if (!value) {
      updateField('dobBs', '');
      return;
    }

    try {
      const bsDate = adToBs(value);

      updateField('dobBs', bsDate);
      setError(null);
    } catch {
      setError('Invalid AD date.');
    }
  }

  /*
   * Image selection
   */
  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log(
      'IMAGE SELECTED:',
      file
    );

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        'Only JPG, PNG and WEBP images are allowed.'
      );
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        'Image size must be less than 5 MB.'
      );
      return;
    }

    setError(null);

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  /*
   * Submit KYC
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      setError(
        'You are not authenticated.'
      );
      return;
    }

    /*
     * Validate permanent address
     */
    if (
      !form.permanentMunicipalityId ||
      !permanentLocation.districtId ||
      !permanentLocation.provinceId
    ) {
      setError(
        'Please select a valid permanent municipality.'
      );
      return;
    }

    /*
     * Validate temporary address
     */
    if (
      form.temporaryMunicipalityId
    ) {
      if (
        !temporaryLocation.districtId ||
        !temporaryLocation.provinceId
      ) {
        setError(
          'Please select a valid temporary municipality.'
        );
        return;
      }
    }

    /*
     * Prepare payload
     */
    const payload = {
      fullName:
        form.fullName.trim(),

      gender: form.gender,

      dobBs:
        form.dobBs.trim() ||
        undefined,

      dobAd: form.dobAd,

      phoneNumber:
        form.phoneNumber.trim(),

      email:
        form.email.trim() ||
        undefined,

      citizenshipIssuedDistrict:
        form.citizenshipIssuedDistrict.trim() ||
        undefined,

      citizenshipIssuedDate:
        form.citizenshipIssuedDate ||
        undefined,

      permanentProvinceId:
        permanentLocation.provinceId,

      permanentDistrictId:
        permanentLocation.districtId,

      permanentMunicipalityId:
        Number(
          form.permanentMunicipalityId
        ),

      permanentWardNo:
        Number(
          form.permanentWardNo
        ),

      fatherName:
        form.fatherName.trim() ||
        undefined,

      motherName:
        form.motherName.trim() ||
        undefined,

      grandfatherName:
        form.grandfatherName.trim() ||
        undefined,

      grandmotherName:
        form.grandmotherName.trim() ||
        undefined,

      occupation:
        form.occupation.trim() ||
        undefined,

      panNumber:
        form.panNumber.trim() ||
        undefined,
    };

    /*
     * Temporary address
     */
    if (
      form.temporaryMunicipalityId
    ) {
      payload.temporaryProvinceId =
        temporaryLocation.provinceId;

      payload.temporaryDistrictId =
        temporaryLocation.districtId;

      payload.temporaryMunicipalityId =
        Number(
          form.temporaryMunicipalityId
        );

      payload.temporaryWardNo =
        form.temporaryWardNo
          ? Number(
              form.temporaryWardNo
            )
          : undefined;
    }

    /*
     * Citizenship number is only
     * submitted when creating.
     */
    if (!isEditMode) {
      payload.citizenshipNumber =
        form.citizenshipNumber.trim();
    }

    console.log(
      'KYC PAYLOAD:',
      payload
    );

    console.log(
      'SELECTED IMAGE:',
      selectedImage
    );

    setError(null);
    setSubmitting(true);

    try {
      let savedRecord;

      if (isEditMode && id) {
        savedRecord =
          await api.updateKyc(
            id,
            payload,
            token
          );
      } else {
        savedRecord =
          await api.createKyc(
            payload,
            token
          );
      }

      console.log(
        'KYC SAVED:',
        savedRecord
      );

      /*
       * Get KYC ID
       */
      const kycId = isEditMode
        ? id
        : savedRecord?.id;

      console.log(
        'KYC ID:',
        kycId
      );

      /*
       * STEP 2:
       * Upload image
       */
      if (
        selectedImage &&
        kycId
      ) {
        console.log(
          'UPLOADING IMAGE...'
        );

        try {
          const imageResult =
            await api.uploadKycImage(
              kycId,
              selectedImage,
              token
            );

          console.log(
            'IMAGE UPLOAD SUCCESS:',
            imageResult
          );
        } catch (imageError) {
          /*
           * KYC has already been saved.
           * Image failure should not prevent
           * redirecting to KYC list.
           */
          console.error(
            'IMAGE UPLOAD ERROR:',
            imageError
          );
        }
      } else {
        console.log(
          'NO IMAGE TO UPLOAD'
        );
      }

      /*
       * STEP 3:
       * Redirect to KYC list
       */
      console.log(
        'REDIRECTING TO KYC LIST...'
      );

      navigate(
        '/kyc-lists',
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        'KYC SAVE ERROR:',
        err
      );

      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to save KYC record'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-center">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              {isEditMode
                ? 'Edit KYC'
                : 'Add KYC'}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {/* {isEditMode
                ? 'Update KYC information'
                : 'Enter KYC information'} */}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/kyc-lists')
            }
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ================================================= */}
          {/* PERSONAL INFORMATION */}
          {/* ================================================= */}

          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            <legend className="px-2 text-sm font-semibold text-purple-700">
              Personal Information
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    updateField(
                      'fullName',
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Gender *
                </label>

                <select
                  value={form.gender}
                  onChange={(e) =>
                    updateField(
                      'gender',
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* BS DOB */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date of Birth (BS)
                </label>

                <input
                  type="text"
                  value={form.dobBs}
                  onChange={(e) =>
                    handleBsChange(
                      e.target.value
                    )
                  }
                  placeholder="YYYY-MM-DD"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* AD DOB */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date of Birth (AD) *
                </label>

                <DatePicker
                  selected={parseDateInputValue(form.dobAd)}
                  onChange={(date) =>
                    handleAdChange(formatDateInputValue(date))
                  }
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date of birth"
                  renderCustomHeader={renderDatePickerHeader}
                  calendarClassName={datePickerCalendarClassName}
                  dayClassName={datePickerDayClassName}
                  maxDate={new Date()}
                  className={datePickerInputClassName}
                  wrapperClassName="w-full"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>

                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    updateField(
                      'phoneNumber',
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      'email',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </fieldset>

          {/* ================================================= */}
          {/* CITIZENSHIP */}
          {/* ================================================= */}

          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            <legend className="px-2 text-sm font-semibold text-purple-700">
              Citizenship Information
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Citizenship Number */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Citizenship Number *
                </label>

                <input
                  type="text"
                  value={
                    form.citizenshipNumber
                  }
                  onChange={(e) =>
                    updateField(
                      'citizenshipNumber',
                      e.target.value
                    )
                  }
                  disabled={isEditMode}
                  required={!isEditMode}
                  className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${
                    isEditMode
                      ? 'bg-gray-100'
                      : ''
                  }`}
                />

                {isEditMode && (
                  <p className="mt-1 text-xs text-gray-500">
                    Citizenship number cannot be changed.
                  </p>
                )}
              </div>

              {/* Issued District */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Issued District
                </label>

                <select
                  value={
                    form.citizenshipIssuedDistrict
                  }
                  onChange={(e) =>
                    updateField(
                      'citizenshipIssuedDistrict',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">
                    Select District
                  </option>

                  {districts.map((district) => (
                    <option
                      key={district.id}
                      value={district.name}
                    >
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Issued Date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Issued Date
                </label>

                <DatePicker
                  selected={parseDateInputValue(form.citizenshipIssuedDate)}
                  onChange={(date) =>
                    updateField(
                      'citizenshipIssuedDate',
                      formatDateInputValue(date)
                    )
                  }
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select issued date"
                  renderCustomHeader={renderDatePickerHeader}
                  calendarClassName={datePickerCalendarClassName}
                  dayClassName={datePickerDayClassName}
                  maxDate={new Date()}
                  className={datePickerInputClassName}
                  wrapperClassName="w-full"
                  isClearable
                />
              </div>
            </div>
          </fieldset>

          {/* ================================================= */}
          {/* PHOTO */}
          {/* ================================================= */}

          <fieldset className="border border-gray-200 rounded-md p-4 space-y-3">
            <legend className="px-2 text-sm font-semibold text-purple-700">
              KYC Photo
            </legend>

            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected KYC"
                  className="h-40 w-40 rounded-md border border-gray-300 object-cover"
                />
              ) : existingImageUrl ? (
                <img
                  src={existingImageUrl}
                  alt="Current KYC"
                  className="h-40 w-40 rounded-md border border-gray-300 object-cover"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-sm text-gray-500">
                  No photo
                </div>
              )}

              <div className="w-full">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {isEditMode
                    ? 'Change Photo'
                    : 'Upload Photo'}
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageChange
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />

                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG or WEBP. Maximum size:
                  5 MB.
                </p>
              </div>
            </div>
          </fieldset>

          {/* ================================================= */}
          {/* PERMANENT ADDRESS */}
          {/* ================================================= */}

          <AddressBlock
            title="Permanent Address"
            municipalities={
              municipalities
            }
            districts={districts}
            provinces={provinces}
            municipalityId={
              form.permanentMunicipalityId
            }
            wardNo={
              form.permanentWardNo
            }
            onMunicipalityChange={(value) =>
              updateField(
                'permanentMunicipalityId',
                value
              )
            }
            onWardChange={(value) =>
              updateField(
                'permanentWardNo',
                value
              )
            }
          />

          {/* ================================================= */}
          {/* TEMPORARY ADDRESS */}
          {/* ================================================= */}

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={sameAsPermanent}
              onChange={(e) =>
                handleSameAsPermanentChange(
                  e.target.checked
                )
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            Same as Permanent Address
          </label>

          <AddressBlock
            title="Temporary Address"
            municipalities={
              municipalities
            }
            districts={districts}
            provinces={provinces}
            municipalityId={
              form.temporaryMunicipalityId
            }
            wardNo={
              form.temporaryWardNo
            }
            onMunicipalityChange={(value) =>
              updateField(
                'temporaryMunicipalityId',
                value
              )
            }
            onWardChange={(value) =>
              updateField(
                'temporaryWardNo',
                value
              )
            }
            disabled={sameAsPermanent}
          />

          {/* ================================================= */}
          {/* FAMILY INFORMATION */}
          {/* ================================================= */}

          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            <legend className="px-2 text-sm font-semibold text-purple-700">
              Family Information
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Father */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Father Name
                </label>

                <input
                  type="text"
                  value={
                    form.fatherName
                  }
                  onChange={(e) =>
                    updateField(
                      'fatherName',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Mother */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mother Name
                </label>

                <input
                  type="text"
                  value={
                    form.motherName
                  }
                  onChange={(e) =>
                    updateField(
                      'motherName',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Grandfather */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Grandfather Name
                </label>

                <input
                  type="text"
                  value={
                    form.grandfatherName
                  }
                  onChange={(e) =>
                    updateField(
                      'grandfatherName',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Grandmother */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Grandmother Name
                </label>

                <input
                  type="text"
                  value={
                    form.grandmotherName
                  }
                  onChange={(e) =>
                    updateField(
                      'grandmotherName',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Occupation */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Occupation
                </label>

                <input
                  type="text"
                  value={
                    form.occupation
                  }
                  onChange={(e) =>
                    updateField(
                      'occupation',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* PAN */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  PAN Number
                </label>

                <input
                  type="text"
                  value={
                    form.panNumber
                  }
                  onChange={(e) =>
                    updateField(
                      'panNumber',
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </fieldset>

          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigate('/kyc-lists')
              }
              disabled={submitting}
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-purple-700 px-5 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? 'Saving...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Save KYC'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
  
}