import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { motion } from 'motion/react';
import { ArrowRight, Users, MapPin, Sparkles, Building, Calendar } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const { cmsData, getCmsText } = useCms();

  const heroBgUrl = cmsData.hero?.heroBgUrl || "/src/assets/images/karnataka_village_hero_1785475191493.jpg";
  const logoUrl = cmsData.logoUrl || "/src/assets/images/official_namma_grama_logo_1785490337996.jpg";

  const tagline = getCmsText(cmsData.hero?.taglineKn, cmsData.hero?.taglineEn, language) || t('heroTagline');
  const heroTitle = getCmsText(cmsData.hero?.titleKn, cmsData.hero?.titleEn, language) || t('heroTitle');
  const heroSubtitle = getCmsText(cmsData.hero?.subtitleKn, cmsData.hero?.subtitleEn, language) || t('heroDescription');
  const btnRegisterText = getCmsText(cmsData.hero?.ctaRegisterTextKn, cmsData.hero?.ctaRegisterTextEn, language) || t('btnRegister');
  const btnAboutText = getCmsText(cmsData.hero?.ctaAboutTextKn, cmsData.hero?.ctaAboutTextEn, language) || t('btnLearnMore');

  // Dynamic Animated Counters
  const computedStats = (cmsData as any).computedStats || cmsData.stats || {};
  const regCount = (cmsData as any).totalRegistrationsCount || 0;

  const totalRegisteredDisplay = regCount > 0 ? regCount : 90000;
  const villagesDisplay = computedStats.villagesCovered || 1250;
  const eventsDisplay = computedStats.communityEvents || 180;

  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = totalRegisteredDisplay;
    const duration = 1500;
    const stepTime = Math.max(10, Math.floor(duration / (end || 100)));

    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalRegisteredDisplay]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* Dynamic Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgUrl}
          alt="Karnataka Village Grama Panchayat"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Soft Gradient Overlay for Optimal Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/50" />
        <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        
        {/* Dynamic Logo Badge Container */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl border border-amber-300/40 mb-8"
        >
          <img
            src={logoUrl}
            alt="Namma Grama Nayaka Emblem"
            className="h-10 w-auto max-w-[120px] object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
          <span className="text-sm font-bold text-emerald-900 font-kannada">
            {tagline}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-kannada text-white mb-4 leading-tight drop-shadow-md"
        >
          {heroTitle}
        </motion.h1>

        {/* Subheading Badge: Youth Must Lead */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="inline-block"
        >
          <span className="text-xl sm:text-3xl font-bold text-amber-400 uppercase tracking-wide font-kannada bg-amber-950/60 backdrop-blur-xs px-6 py-1.5 rounded-2xl border border-amber-500/30 shadow-inner">
            {t('heroSubTitle')}
          </span>
        </motion.div>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-xs"
        >
          {heroSubtitle}
        </motion.p>

        {/* Dynamic Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{btnRegisterText}</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <a
            href="#about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-7 py-4 rounded-2xl backdrop-blur-md border border-white/20 transition-all"
          >
            <span>{btnAboutText}</span>
          </a>
        </motion.div>

        {/* Dynamic Animated Impact Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 text-left shadow-lg">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {regCount > 0 ? count : '90,000+'}
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {regCount > 0 ? 'Live Ward Applicants' : t('badge1Lakh')}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 text-left shadow-lg">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300 font-mono">31 Districts</div>
              <div className="text-xs text-slate-300 font-medium">{t('badgeKarnataka')}</div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 text-left shadow-lg">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300 font-mono">{villagesDisplay.toLocaleString()}+</div>
              <div className="text-xs text-slate-300 font-medium">Villages Reached</div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 text-left shadow-lg">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300 font-mono">{eventsDisplay}+</div>
              <div className="text-xs text-slate-300 font-medium">Community Workshops</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

