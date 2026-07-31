import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Megaphone, Map, Wrench, Coins, Compass, Sparkles, CheckCircle } from 'lucide-react';

export const WhyWardMemberSection: React.FC = () => {
  const { t } = useLanguage();

  const roles = [
    { title: t('wmRole1'), icon: Megaphone, color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
    { title: t('wmRole2'), icon: Map, color: 'border-amber-500 bg-amber-50 text-amber-800' },
    { title: t('wmRole3'), icon: Wrench, color: 'border-orange-500 bg-orange-50 text-orange-800' },
    { title: t('wmRole4'), icon: Coins, color: 'border-blue-500 bg-blue-50 text-blue-800' },
    { title: t('wmRole5'), icon: Compass, color: 'border-purple-500 bg-purple-50 text-purple-800' },
  ];

  return (
    <section id="why" className="py-20 bg-[#f8f6f0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            {t('sloganEmpoweredMembers')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-kannada tracking-tight">
            {t('whyTitle')}
          </h2>
          <p className="mt-4 text-slate-600 text-lg font-medium font-kannada">
            {t('whySubtitle')}
          </p>
          <div className="w-20 h-1.5 bg-emerald-600 rounded-full mx-auto mt-4" />
        </div>

        {/* 5 Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {roles.map((role, idx) => {
            const IconComp = role.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`bg-white rounded-2xl p-6 border-2 ${role.color.split(' ')[0]} shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${role.color} mb-4`}>
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold font-kannada text-slate-900 leading-snug">
                  {role.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* Structured Approach Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Empower Panchayat Approach</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 font-kannada leading-relaxed">
              {t('empowerPanchayatDesc')}
            </p>
          </div>

          <a
            href="#modules"
            className="whitespace-nowrap inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base px-6 py-3.5 rounded-2xl shadow-sm transition-all"
          >
            <span>{t('navModules')}</span>
            <CheckCircle className="w-5 h-5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};
