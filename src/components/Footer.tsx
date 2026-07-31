import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { ShieldCheck, MapPin, Mail, Globe, Phone, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { cmsData, getCmsText } = useCms();

  const logoUrl = cmsData.logoUrl || "/src/assets/images/official_namma_grama_logo_1785490337996.jpg";
  const brandTitle = getCmsText(cmsData.footer?.brandNameKn, cmsData.footer?.brandNameEn, language) || t('brandName');
  const tagline = getCmsText(cmsData.hero?.taglineKn, cmsData.hero?.taglineEn, language) || t('tagline');
  const footerDesc = getCmsText(cmsData.footer?.descKn, cmsData.footer?.descEn, language) || t('footerDesc');
  const copyrightText = getCmsText(cmsData.footer?.copyrightKn, cmsData.footer?.copyrightEn, language) || t('copyright');

  const contactEmail = cmsData.footer?.contactEmail || "yuvraj@empowerpanchayat.org";
  const contactPhone = cmsData.footer?.contactPhone || "+91 98765 43210";
  const contactAddress = cmsData.footer?.contactAddress || "Bengaluru, Karnataka, India";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-emerald-950 text-white pt-16 pb-12 border-t border-emerald-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-white shadow-xs overflow-hidden">
                <img
                  src={logoUrl}
                  alt="Namma Grama Nayaka Emblem"
                  className="h-12 w-auto max-w-[160px] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xl font-bold font-kannada text-white block">
                  {brandTitle}
                </span>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider font-english">
                  {tagline}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed font-kannada max-w-md pt-2">
              {footerDesc}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Grassroots Governance Initiative • Empower Panchayat</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-english">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-kannada">
              <li><a href="#about" className="hover:text-amber-300 transition-colors">{t('navAbout')}</a></li>
              <li><a href="#why" className="hover:text-amber-300 transition-colors">{t('navWhy')}</a></li>
              <li><a href="#modules" className="hover:text-amber-300 transition-colors">{t('navModules')}</a></li>
              <li><a href="#journey" className="hover:text-amber-300 transition-colors">{t('navJourney')}</a></li>
              <li><a href="#faqs" className="hover:text-amber-300 transition-colors">{t('navFaq')}</a></li>
              <li><a href="#register" className="hover:text-amber-300 font-bold text-amber-400 transition-colors">{t('btnRegister')}</a></li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-english">
              {t('contactUs')}
            </h4>
            <div className="space-y-2.5 text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{contactAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{contactEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{contactPhone}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-kannada">
            {copyrightText}
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white transition-colors"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};

