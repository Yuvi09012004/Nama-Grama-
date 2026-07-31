import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { WardMemberRegistration, RegistrationStats, CmsConfig } from '../types';
import { KARNATAKA_DISTRICTS, EDUCATION_QUALIFICATIONS } from '../data/karnatakaData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Lock, Search, Filter, Download, Trash2, Eye, X, LogOut, CheckCircle, 
  RefreshCw, FileText, User, Calendar, MapPin, Phone, Mail, LayoutDashboard, 
  Globe, Edit3, Plus, Upload, Image, MessageSquare, Save, Bell, Sparkles 
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { cmsData, updateCmsData, uploadImageAsset, refreshCmsData } = useCms();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'regs' | 'cms'>('regs');

  // Auth state
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('ngn_admin_token'));
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Data state
  const [registrations, setRegistrations] = useState<WardMemberRegistration[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loadingRegs, setLoadingRegs] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedEducation, setSelectedEducation] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');

  // Detail Modal view
  const [detailItem, setDetailItem] = useState<WardMemberRegistration | null>(null);

  // Local CMS Form State for editing
  const [cmsForm, setCmsForm] = useState<CmsConfig>(cmsData);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSaveMsg, setCmsSaveMsg] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Keep cmsForm synced with context when cmsData loads
  useEffect(() => {
    if (cmsData) {
      setCmsForm(cmsData);
    }
  }, [cmsData]);

  // Fetch Registrations
  const fetchRegData = async () => {
    if (!authToken) return;
    setLoadingRegs(true);

    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (selectedDistrict !== 'All') queryParams.append('district', selectedDistrict);
      if (selectedEducation !== 'All') queryParams.append('education', selectedEducation);
      if (selectedGender !== 'All') queryParams.append('gender', selectedGender);

      const [resRegs, resStats] = await Promise.all([
        fetch(`/api/admin/registrations?${queryParams.toString()}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      ]);

      if (resRegs.status === 401 || resStats.status === 401) {
        setAuthToken(null);
        localStorage.removeItem('ngn_admin_token');
        return;
      }

      const dataRegs = await resRegs.json();
      const dataStats = await resStats.json();

      setRegistrations(dataRegs.registrations || []);
      setStats(dataStats);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoadingRegs(false);
    }
  };

  useEffect(() => {
    if (isOpen && authToken && activeTab === 'regs') {
      fetchRegData();
    }
  }, [isOpen, authToken, activeTab, searchQuery, selectedDistrict, selectedEducation, selectedGender]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAuthToken(data.token);
        localStorage.setItem('ngn_admin_token', data.token);
        setPassword('');
      } else {
        setLoginError(data.error || "Incorrect password");
      }
    } catch (err) {
      setLoginError("Login server error");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('ngn_admin_token');
  };

  const handleDeleteReg = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;

    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        fetchRegData();
        if (detailItem?.id === id) setDetailItem(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/admin/export/csv?auth=${authToken}`, '_blank');
  };

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload custom logo image or hero banner
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    setImageUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await uploadImageAsset(base64, file.name, authToken);
      if (res.success && res.url) {
        setCmsForm(prev => ({ ...prev, logoUrl: res.url! }));
        setCmsSaveMsg("Logo uploaded! Click 'Save All CMS Changes' to update website.");
      } else {
        alert(res.error || "Failed to upload image.");
      }
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleHeroBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    setImageUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await uploadImageAsset(base64, file.name, authToken);
      if (res.success && res.url) {
        setCmsForm(prev => ({
          ...prev,
          hero: { ...prev.hero, heroBgUrl: res.url! }
        }));
        setCmsSaveMsg("Banner uploaded! Click 'Save All CMS Changes' to update website.");
      } else {
        alert(res.error || "Failed to upload image.");
      }
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  // Save full CMS config to server
  const handleSaveCms = async () => {
    if (!authToken) return;
    setCmsSaving(true);
    setCmsSaveMsg(null);

    const res = await updateCmsData(cmsForm, authToken);
    setCmsSaving(false);

    if (res.success) {
      setCmsSaveMsg("Website content updated successfully! Live changes applied instantly.");
      setTimeout(() => setCmsSaveMsg(null), 5000);
    } else {
      setCmsSaveMsg(res.error || "Error saving CMS data to server.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-emerald-950 text-white p-6 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-xl text-amber-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-kannada">
                {t('adminDashboardTitle')}
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Grassroots Leadership & Content Management System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          {authToken && (
            <div className="flex bg-emerald-900/80 p-1.5 rounded-2xl border border-emerald-800">
              <button
                onClick={() => setActiveTab('regs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'regs'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Registrations ({stats?.total || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('cms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'cms'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>CMS Content Editor</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {authToken && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold flex items-center gap-1.5 border border-rose-700/50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('btnLogout')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {!authToken ? (
          /* LOGIN FORM */
          <div className="p-10 max-w-md mx-auto my-12 w-full text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 font-kannada mb-2">
              {t('adminModalTitle')}
            </h4>
            <p className="text-slate-500 text-sm mb-6 font-mono">
              Default password: admin123
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('adminPassLabel')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 text-sm"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md"
              >
                {t('btnAdminLogin')}
              </button>
            </form>
          </div>
        ) : activeTab === 'regs' ? (
          /* REGISTRATION MANAGEMENT TAB */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">{t('totalRegs')}</div>
                  <div className="text-2xl font-black font-mono text-emerald-950">{stats?.total || 0}</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">{t('todayRegs')}</div>
                  <div className="text-2xl font-black font-mono text-amber-700">{stats?.todayCount || 0}</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-800 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">{t('districtsCovered')}</div>
                  <div className="text-2xl font-black font-mono text-orange-800">
                    {stats ? Object.keys(stats.districtCounts).length : 0} / 31
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar: Search, Filters, Export */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="All">{t('filterDistrict')}</option>
                    {KARNATAKA_DISTRICTS.map(d => (
                      <option key={d.nameEn} value={d.nameEn}>{d.nameEn}</option>
                    ))}
                  </select>

                  <select
                    value={selectedEducation}
                    onChange={(e) => setSelectedEducation(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="All">{t('filterEducation')}</option>
                    {EDUCATION_QUALIFICATIONS.map(ed => (
                      <option key={ed} value={ed}>{ed}</option>
                    ))}
                  </select>

                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('exportCsv')}</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200 font-bold">
                    <th className="p-4">Reg ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Age / Gender</th>
                    <th className="p-4">Phone / Email</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Qualification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loadingRegs ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Loading registrations...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        {t('noRegsFound')}
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-emerald-800">
                          {reg.id}
                        </td>
                        <td className="p-4 font-bold text-slate-900 font-kannada">
                          {reg.firstName} {reg.middleName || ''} {reg.lastName}
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {reg.calculatedAge} yrs ({reg.gender})
                        </td>
                        <td className="p-4 text-xs font-mono">
                          <div>{reg.phone}</div>
                          <div className="text-slate-400">{reg.email}</div>
                        </td>
                        <td className="p-4 text-xs font-medium font-kannada text-slate-700">
                          <span className="font-bold text-emerald-950">{reg.district}</span>, {reg.village}
                        </td>
                        <td className="p-4 text-xs text-slate-600">
                          {reg.education}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetailItem(reg)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title={t('actionView')}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReg(reg.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title={t('actionDelete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* CMS CONTENT EDITOR TAB */
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
            
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-kannada">
                  Live Dynamic Content Management System
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Update any text, logo, background banners, announcements, gallery images, or metadata. Changes apply immediately to the website!
                </p>
              </div>

              <button
                onClick={handleSaveCms}
                disabled={cmsSaving}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{cmsSaving ? "Saving..." : "Save All CMS Changes"}</span>
              </button>
            </div>

            {cmsSaveMsg && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
                cmsSaveMsg.includes("Error") ? "bg-rose-50 text-rose-800 border border-rose-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span>{cmsSaveMsg}</span>
              </div>
            )}

            {/* SECTION 1: LOGO & SITE IDENTITY */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h5 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Image className="w-5 h-5 text-emerald-700" />
                <span>1. Official Logo & Site Metadata</span>
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Official Logo Image
                  </label>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={cmsForm.logoUrl}
                      alt="Logo Preview"
                      className="h-14 w-auto object-contain rounded-lg border bg-white p-1"
                    />
                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer hover:bg-emerald-800">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-500">
                        {imageUploading ? "Uploading..." : "Supports PNG, JPG, WebP"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Website Meta Title
                    </label>
                    <input
                      type="text"
                      value={cmsForm.seo?.title || ''}
                      onChange={(e) => setCmsForm({
                        ...cmsForm,
                        seo: { ...cmsForm.seo, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Meta Description
                    </label>
                    <input
                      type="text"
                      value={cmsForm.seo?.description || ''}
                      onChange={(e) => setCmsForm({
                        ...cmsForm,
                        seo: { ...cmsForm.seo, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: HERO SECTION CONTENT */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h5 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Edit3 className="w-5 h-5 text-emerald-700" />
                <span>2. Hero Banner & Key Headlines</span>
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Main Title (Kannada)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero?.titleKn || ''}
                    onChange={(e) => setCmsForm({
                      ...cmsForm,
                      hero: { ...cmsForm.hero, titleKn: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-kannada"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Main Title (English)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero?.titleEn || ''}
                    onChange={(e) => setCmsForm({
                      ...cmsForm,
                      hero: { ...cmsForm.hero, titleEn: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tagline (Kannada)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero?.taglineKn || ''}
                    onChange={(e) => setCmsForm({
                      ...cmsForm,
                      hero: { ...cmsForm.hero, taglineKn: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-kannada"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero?.taglineEn || ''}
                    onChange={(e) => setCmsForm({
                      ...cmsForm,
                      hero: { ...cmsForm.hero, taglineEn: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Subtitle Description (Kannada)
                  </label>
                  <textarea
                    rows={2}
                    value={cmsForm.hero?.subtitleKn || ''}
                    onChange={(e) => setCmsForm({
                      ...cmsForm,
                      hero: { ...cmsForm.hero, subtitleKn: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-kannada"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Subtitle Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={cmsForm.hero?.subtitleEn || ''}
                    onChange={(e) => setCmsForm({
                      ...cmsForm,
                      hero: { ...cmsForm.hero, subtitleEn: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Hero Background Banner Image
                  </label>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={cmsForm.hero?.heroBgUrl}
                      alt="Banner Preview"
                      className="h-16 w-32 object-cover rounded-lg border bg-slate-200"
                    />
                    <div>
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer hover:bg-emerald-800">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroBannerUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: ANNOUNCEMENTS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h5 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <span>3. Announcements & Ticker Alerts</span>
                </h5>
                <button
                  type="button"
                  onClick={() => setCmsForm(prev => ({
                    ...prev,
                    announcements: [
                      ...(prev.announcements || []),
                      { id: `anc-${Date.now()}`, titleKn: 'ಹೊಸ ಲೈವ್ ಪ್ರಕಟಣೆ', titleEn: 'New Live Announcement', date: new Date().toISOString().split('T')[0], category: 'General', contentKn: 'ವಿವರಣೆ', contentEn: 'Description', active: true }
                    ]
                  }))}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Announcement</span>
                </button>
              </div>

              <div className="space-y-3">
                {cmsForm.announcements?.map((anc, idx) => (
                  <div key={anc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 uppercase">Alert #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setCmsForm(prev => ({
                          ...prev,
                          announcements: prev.announcements?.filter(a => a.id !== anc.id)
                        }))}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500">Kannada Title</label>
                        <input
                          type="text"
                          value={anc.titleKn}
                          onChange={(e) => {
                            const updated = [...(cmsForm.announcements || [])];
                            updated[idx].titleKn = e.target.value;
                            setCmsForm({ ...cmsForm, announcements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs font-kannada bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500">English Title</label>
                        <input
                          type="text"
                          value={anc.titleEn}
                          onChange={(e) => {
                            const updated = [...(cmsForm.announcements || [])];
                            updated[idx].titleEn = e.target.value;
                            setCmsForm({ ...cmsForm, announcements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: FAQS MANAGEMENT */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h5 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-700" />
                  <span>4. FAQ Questions & Answers</span>
                </h5>
                <button
                  type="button"
                  onClick={() => setCmsForm(prev => ({
                    ...prev,
                    faqs: [
                      ...(prev.faqs || []),
                      { id: `faq-${Date.now()}`, qKn: 'ಹೊಸ ಪ್ರಶ್ನೆ', qEn: 'New Question', aKn: 'ಉತ್ತರ', aEn: 'Answer', category: 'General' }
                    ]
                  }))}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {cmsForm.faqs?.map((faq, idx) => (
                  <div key={faq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setCmsForm(prev => ({
                          ...prev,
                          faqs: prev.faqs?.filter(f => f.id !== faq.id)
                        }))}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500">Question (Kannada)</label>
                        <input
                          type="text"
                          value={faq.qKn}
                          onChange={(e) => {
                            const updated = [...(cmsForm.faqs || [])];
                            updated[idx].qKn = e.target.value;
                            setCmsForm({ ...cmsForm, faqs: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs font-kannada bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500">Question (English)</label>
                        <input
                          type="text"
                          value={faq.qEn}
                          onChange={(e) => {
                            const updated = [...(cmsForm.faqs || [])];
                            updated[idx].qEn = e.target.value;
                            setCmsForm({ ...cmsForm, faqs: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500">Answer (Kannada)</label>
                        <textarea
                          rows={2}
                          value={faq.aKn}
                          onChange={(e) => {
                            const updated = [...(cmsForm.faqs || [])];
                            updated[idx].aKn = e.target.value;
                            setCmsForm({ ...cmsForm, faqs: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs font-kannada bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500">Answer (English)</label>
                        <textarea
                          rows={2}
                          value={faq.aEn}
                          onChange={(e) => {
                            const updated = [...(cmsForm.faqs || [])];
                            updated[idx].aEn = e.target.value;
                            setCmsForm({ ...cmsForm, faqs: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveCms}
                disabled={cmsSaving}
                className="px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-base shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>{cmsSaving ? "Saving All Changes..." : "Publish & Update Live Website"}</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {detailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setDetailItem(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
                  {detailItem.id}
                </span>
                <span className="text-xs text-slate-400">
                  Submitted: {new Date(detailItem.createdAt).toLocaleString()}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-kannada mb-4">
                {detailItem.firstName} {detailItem.middleName || ''} {detailItem.lastName}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-2xl mb-6">
                <div><strong className="text-slate-500">Gender:</strong> {detailItem.gender}</div>
                <div><strong className="text-slate-500">Age / DOB:</strong> {detailItem.calculatedAge} yrs ({detailItem.dateOfBirth})</div>
                <div><strong className="text-slate-500">Phone:</strong> {detailItem.phone}</div>
                <div><strong className="text-slate-500">Email:</strong> {detailItem.email}</div>
                <div><strong className="text-slate-500">Education:</strong> {detailItem.education}</div>
                <div><strong className="text-slate-500">Occupation:</strong> {detailItem.occupation}</div>
                <div><strong className="text-slate-500">District:</strong> {detailItem.district}</div>
                <div><strong className="text-slate-500">Taluka / GP:</strong> {detailItem.taluka} / {detailItem.gramPanchayat}</div>
                <div><strong className="text-slate-500">Village:</strong> {detailItem.village}</div>
                <div><strong className="text-slate-500">Pincode:</strong> {detailItem.pincode || 'N/A'}</div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <strong className="block text-slate-700 mb-1">Why Ward Member:</strong>
                  <p className="p-3 rounded-xl bg-emerald-50 text-slate-800 font-kannada">
                    {detailItem.whyBecomeWardMember || 'N/A'}
                  </p>
                </div>

                <div>
                  <strong className="block text-slate-700 mb-1">Village Contribution Plan:</strong>
                  <p className="p-3 rounded-xl bg-amber-50 text-slate-800 font-kannada">
                    {detailItem.contributionPlan || 'N/A'}
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
