import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { Language } from '../types';
import { Menu, X, Shield, Globe, ChevronDown, UserPlus } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const { language, setLanguage, t } = useLanguage();
  const { cmsData, getCmsText } = useCms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const logoUrl = cmsData.logoUrl || "/src/assets/images/official_namma_grama_logo_1785490337996.jpg";

  const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  ];

  const activeLang = languages.find((l) => l.code === language) || languages[0];

  // Dynamic Navigation Links from CMS
  const cmsNav = (cmsData.navigation || [])
    .filter((item) => item.visible !== false)
    .sort((a, b) => a.order - b.order);

  const navLinks = cmsNav.length > 0
    ? cmsNav.map((link) => ({
        href: link.href,
        label: getCmsText(link.labelKn, link.labelEn, language)
      }))
    : [
        { href: '#about', label: t('navAbout') },
        { href: '#why', label: t('navWhy') },
        { href: '#modules', label: t('navModules') },
        { href: '#journey', label: t('navJourney') },
        { href: '#faqs', label: t('navFaq') },
      ];

  const brandTitle = getCmsText(cmsData.footer?.brandNameKn, cmsData.footer?.brandNameEn, language) || t('brandName');
  const tagline = getCmsText(cmsData.hero?.taglineKn, cmsData.hero?.taglineEn, language) || t('tagline');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Generous White Space */}
          <a href="#" className="flex items-center gap-3 group py-2">
            <div className="p-1 rounded-xl bg-white border border-amber-200/80 shadow-xs group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img
                src={logoUrl}
                alt="Namma Grama Nayaka Logo"
                className="h-12 w-auto max-w-[160px] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-emerald-950 font-kannada leading-snug group-hover:text-emerald-700 transition-colors">
                {brandTitle}
              </span>
              <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase font-english">
                {tagline}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Multilingual Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium hover:border-emerald-300 hover:bg-emerald-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{activeLang.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-emerald-50 transition-colors ${
                        language === lang.code ? 'font-bold text-emerald-700 bg-emerald-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-xs text-slate-400 font-mono">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              title={t('adminPanel')}
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* CTA Button */}
            <a
              href="#register"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('navRegister')}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <Globe className="w-5 h-5 text-emerald-700" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-slate-500">Language:</span>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                      language === lang.code
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                <Shield className="w-4 h-4" />
                <span>{t('adminPanel')}</span>
              </button>
              <a
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-800 text-center"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('navRegister')}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

