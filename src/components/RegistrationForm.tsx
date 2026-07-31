import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { KARNATAKA_DISTRICTS as FALLBACK_DISTRICTS, EDUCATION_QUALIFICATIONS as FALLBACK_EDU, OCCUPATIONS as FALLBACK_OCC, RELIGIONS as FALLBACK_REL } from '../data/karnatakaData';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserCheck, Calendar, Phone, Mail, MapPin, Award, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, X, ArrowRight } from 'lucide-react';

interface RegistrationFormProps {
  onSuccessRegistered?: (id: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccessRegistered }) => {
  const { t, language } = useLanguage();

  // Dropdown options state
  const [districtList, setDistrictList] = useState(FALLBACK_DISTRICTS);
  const [educationList, setEducationList] = useState<string[]>(FALLBACK_EDU);
  const [occupationList, setOccupationList] = useState<string[]>(FALLBACK_OCC);
  const [religionList, setReligionList] = useState<string[]>(FALLBACK_REL);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [religion, setReligion] = useState('');
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [gramPanchayat, setGramPanchayat] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [participated, setParticipated] = useState<boolean>(true);
  const [contested, setContested] = useState<boolean>(false);
  const [whyWardMember, setWhyWardMember] = useState('');
  const [contributionPlan, setContributionPlan] = useState('');
  const [declaration, setDeclaration] = useState(false);

  // States
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{ id: string; name: string } | null>(null);

  // Fetch dynamic dropdowns on mount
  useEffect(() => {
    fetch('/api/dropdowns')
      .then(res => res.json())
      .then(data => {
        if (data.districts && Array.isArray(data.districts)) setDistrictList(data.districts);
        if (data.qualifications && Array.isArray(data.qualifications)) setEducationList(data.qualifications);
        if (data.occupations && Array.isArray(data.occupations)) setOccupationList(data.occupations);
        if (data.religions && Array.isArray(data.religions)) setReligionList(data.religions);
      })
      .catch(() => {
        // Silent fallback
      });
  }, []);

  // Dynamic Talukas list
  const selectedDistrictObj = districtList.find(d => d.nameEn === district || d.nameKn === district);
  const talukaOptions = selectedDistrictObj ? selectedDistrictObj.talukas : [];

  // Calculate age automatically when DOB changes
  useEffect(() => {
    if (!dob) {
      setCalculatedAge(null);
      setAgeError(null);
      return;
    }

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      setCalculatedAge(null);
      setAgeError(null);
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setCalculatedAge(age);

    if (age < 18) {
      setAgeError(t('ageUnder18Error'));
    } else {
      setAgeError(null);
    }
  }, [dob, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Form Validations
    if (!firstName.trim() || !lastName.trim()) {
      setGeneralError("First Name and Last Name are required.");
      return;
    }

    if (!gender) {
      setGeneralError("Please select your gender.");
      return;
    }

    if (!dob) {
      setGeneralError("Please enter your Date of Birth.");
      return;
    }

    if (calculatedAge === null || calculatedAge < 18) {
      setGeneralError(t('ageUnder18Error'));
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setGeneralError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setGeneralError("Please enter a valid email address.");
      return;
    }

    if (!education) {
      setGeneralError("Please select your Educational Qualification.");
      return;
    }

    if (!occupation) {
      setGeneralError("Please select your Occupation.");
      return;
    }

    if (!district) {
      setGeneralError("Please select your District.");
      return;
    }

    if (!village.trim()) {
      setGeneralError("Please enter your Village name.");
      return;
    }

    if (!declaration) {
      setGeneralError("You must accept the mandatory declaration before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          middleName: middleName.trim(),
          lastName: lastName.trim(),
          gender,
          dateOfBirth: dob,
          phone: cleanPhone,
          email: email.trim(),
          religion,
          education,
          occupation,
          district,
          taluka: taluka || '',
          gramPanchayat: gramPanchayat || '',
          village: village.trim(),
          pincode: pincode.trim(),
          address: address.trim(),
          participatedInCommunity: participated,
          contestedElectionBefore: contested,
          whyBecomeWardMember: whyWardMember.trim(),
          contributionPlan: contributionPlan.trim(),
          declarationAccepted: true,
          languageSubmitted: language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      // Success! Trigger confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSuccessModalData({
        id: data.registration.id,
        name: `${firstName} ${lastName}`
      });

      if (onSuccessRegistered) {
        onSuccessRegistered(data.registration.id);
      }

    } catch (err: any) {
      setGeneralError(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setGender('');
    setDob('');
    setPhone('');
    setEmail('');
    setReligion('');
    setEducation('');
    setOccupation('');
    setDistrict('');
    setTaluka('');
    setGramPanchayat('');
    setVillage('');
    setPincode('');
    setAddress('');
    setWhyWardMember('');
    setContributionPlan('');
    setDeclaration(false);
    setSuccessModalData(null);
  };

  return (
    <section id="register" className="py-20 bg-[#fdfbf7] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Grassroots Candidate Portal</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-kannada tracking-tight">
            {t('formSectionTitle')}
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed font-kannada">
            {t('formSectionDesc')}
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full mx-auto mt-6" />
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-2xl relative">
          
          <div className="border-b border-slate-100 pb-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-kannada">
                {t('formCardTitle')}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                All fields marked with * are mandatory
              </p>
            </div>
            <div className="hidden sm:block p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* General Error Alert */}
          {generalError && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              <div className="text-sm font-semibold">{generalError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* 1. PERSONAL INFORMATION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-lg font-bold text-emerald-950 font-kannada">
                  {t('personalInfoTitle')}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('middleName')}
                  </label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="e.g. Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('lastName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Gowda"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('gender')}
                  </label>
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white"
                  >
                    <option value="">-- {t('selectGender')} --</option>
                    <option value="Male">{t('genderMale')}</option>
                    <option value="Female">{t('genderFemale')}</option>
                    <option value="Other">{t('genderOther')}</option>
                    <option value="Prefer not to say">{t('genderPreferNot')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('dob')}
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white"
                  />
                </div>

                {/* AUTOMATED AGE DISPLAY & AGE VALIDATION */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('calculatedAge')}
                  </label>
                  <div className="px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-sm font-semibold text-slate-800">
                    <span>
                      {calculatedAge !== null ? `${calculatedAge} ${t('yearsOld')}` : '--'}
                    </span>
                    {calculatedAge !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        calculatedAge >= 18 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {calculatedAge >= 18 ? 'Eligible (≥18)' : 'Under 18'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Under 18 Age Error Message */}
              {ageError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{ageError}</span>
                </div>
              )}
            </div>

            {/* 2. CONTACT INFORMATION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-lg font-bold text-emerald-950 font-kannada">
                  {t('contactInfoTitle')}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10 digit mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('religion')}
                  </label>
                  <select
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white"
                  >
                    <option value="">-- {t('selectReligion')} --</option>
                    {religionList.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('education')}
                  </label>
                  <select
                    required
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white"
                  >
                    <option value="">-- {t('selectEducation')} --</option>
                    {educationList.map(ed => (
                      <option key={ed} value={ed}>{ed}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('occupation')}
                  </label>
                  <select
                    required
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white"
                  >
                    <option value="">-- {t('selectOccupation')} --</option>
                    {occupationList.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. LOCATION DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-lg font-bold text-emerald-950 font-kannada">
                  {t('locationInfoTitle')}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('district')}
                  </label>
                  <select
                    required
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setTaluka('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white font-kannada"
                  >
                    <option value="">-- {t('selectDistrict')} --</option>
                    {districtList.map(d => (
                      <option key={d.nameEn} value={d.nameEn}>
                        {d.nameKn} ({d.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('taluka')}
                  </label>
                  {talukaOptions.length > 0 ? (
                    <select
                      value={taluka}
                      onChange={(e) => setTaluka(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white"
                    >
                      <option value="">-- {t('selectTaluka')} --</option>
                      {talukaOptions.map(tOption => (
                        <option key={tOption} value={tOption}>{tOption}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={taluka}
                      onChange={(e) => setTaluka(e.target.value)}
                      placeholder="Enter Taluka / Block"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('gramPanchayat')}
                  </label>
                  <input
                    type="text"
                    required
                    value={gramPanchayat}
                    onChange={(e) => setGramPanchayat(e.target.value)}
                    placeholder="e.g. Koppa Grama Panchayat"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('village')}
                  </label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Village / Ward name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('pincode')}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6 digit PIN"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House No, Street, Landmark..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 4. LEADERSHIP INTEREST */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h4 className="text-lg font-bold text-emerald-950 font-kannada">
                  {t('leadershipInfoTitle')}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <label className="block text-sm font-bold text-slate-900 font-kannada mb-3">
                    {t('qCommunity')}
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipated(true)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                        participated ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t('yes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setParticipated(false)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                        !participated ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t('no')}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <label className="block text-sm font-bold text-slate-900 font-kannada mb-3">
                    {t('qElection')}
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setContested(true)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                        contested ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t('yes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContested(false)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                        !contested ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t('no')}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                  {t('qWhy')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={whyWardMember}
                  onChange={(e) => setWhyWardMember(e.target.value)}
                  placeholder={t('qWhyPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-kannada">
                  {t('qHow')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={contributionPlan}
                  onChange={(e) => setContributionPlan(e.target.value)}
                  placeholder={t('qHowPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm"
                />
              </div>
            </div>

            {/* 5. DECLARATION & SUBMIT */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950">
                <h5 className="font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2 text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>{t('declarationTitle')}</span>
                </h5>
                <p className="text-sm leading-relaxed font-kannada">
                  "{t('declarationText')}"
                </p>
                <label className="mt-4 flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={declaration}
                    onChange={(e) => setDeclaration(e.target.checked)}
                    className="w-5 h-5 rounded-md text-emerald-700 focus:ring-emerald-600 border-slate-300"
                  />
                  <span className="font-bold text-sm text-slate-900 font-kannada">
                    {t('declarationCheck')}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !!ageError}
                className="w-full py-4 px-8 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-lg shadow-xl hover:shadow-emerald-700/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('submitting')}</span>
                ) : (
                  <>
                    <span>{t('btnSubmit')}</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {successModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-emerald-300 text-center relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 font-kannada mb-2">
                {t('successTitle')}
              </h3>

              <p className="text-slate-600 text-sm font-medium mb-6 font-kannada">
                {t('successMsg')}
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-center">
                <span className="text-xs font-bold uppercase text-amber-800 tracking-wider block mb-1">
                  {t('regIdLabel')}
                </span>
                <span className="text-2xl font-mono font-black text-emerald-950 tracking-wider">
                  {successModalData.id}
                </span>
              </div>

              <button
                onClick={resetForm}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base transition-colors shadow-md"
              >
                {t('btnDone')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
