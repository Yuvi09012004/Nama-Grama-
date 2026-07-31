import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Mic, Briefcase, TrendingUp, Users2, Building2, Quote } from 'lucide-react';

export const StrongerPanchayatSection: React.FC = () => {
  const { t } = useLanguage();

  const points = [
    { text: t('strongerPoint1'), icon: Mic, color: 'text-emerald-700 bg-emerald-100' },
    { text: t('strongerPoint2'), icon: Briefcase, color: 'text-amber-700 bg-amber-100' },
    { text: t('strongerPoint3'), icon: TrendingUp, color: 'text-orange-700 bg-orange-100' },
    { text: t('strongerPoint4'), icon: Users2, color: 'text-blue-700 bg-blue-100' },
  ];

  return (
    <section className="py-20 bg-emerald-950 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-700">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>{t('sloganStrongWards')}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-kannada tracking-tight">
            {t('strongerTitle')}
          </h2>
          <p className="mt-4 text-slate-300 text-lg font-medium">
            {t('strongerSubtitle')}
          </p>
        </div>

        {/* Grid of 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {points.map((pt, idx) => {
            const IconComp = pt.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-6 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pt.color} mb-5`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <p className="text-slate-200 font-semibold text-base font-kannada leading-snug">
                  {pt.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* 300-500 Adult Citizens Card & Governance Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 300-500 Adult Citizens Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 rounded-3xl p-8 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-950 text-amber-400 rounded-2xl">
                <Users2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-3xl font-black font-mono">300 – 500</span>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                  {t('stat300500Title')}
                </span>
              </div>
            </div>
            <p className="text-slate-950 font-medium text-sm leading-relaxed">
              {t('stat300500Desc')}
            </p>
          </div>

          {/* Governance Quote Box */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 relative">
            <Quote className="w-12 h-12 text-amber-500/20 absolute top-6 right-6" />
            <p className="text-xl sm:text-2xl font-semibold text-amber-100 font-kannada leading-relaxed relative z-10 italic">
              "{t('governanceQuote')}"
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-0.5 bg-amber-500" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-english">
                Namma Grama Nayaka Movement
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
