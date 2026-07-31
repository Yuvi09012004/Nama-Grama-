import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Building, Users, Globe, Compass, ArrowRight, Shield, Sparkles } from 'lucide-react';

export const TransformationJourneySection: React.FC = () => {
  const { t } = useLanguage();

  const gpItems = [
    { label: t('gpItem1'), icon: Building, color: 'bg-emerald-100 text-emerald-800' },
    { label: t('gpItem2'), icon: Users, color: 'bg-amber-100 text-amber-800' },
    { label: t('gpItem3'), icon: Globe, color: 'bg-orange-100 text-orange-800' },
    { label: t('gpItem4'), icon: Compass, color: 'bg-purple-100 text-purple-800' },
  ];

  const pillars = [
    { text: t('impactPillar1'), num: '01' },
    { text: t('impactPillar2'), num: '02' },
    { text: t('impactPillar3'), num: '03' },
    { text: t('impactPillar4'), num: '04' },
    { text: t('impactPillar5'), num: '05' },
  ];

  return (
    <section id="journey" className="py-20 bg-[#fdfbf7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            {t('journeyFlowTitle')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-kannada tracking-tight">
            {t('journeyTitle')}
          </h2>
          <div className="w-20 h-1.5 bg-emerald-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Structure & Flow Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* GP Unit Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            <h3 className="text-xl font-bold text-slate-900 font-kannada mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-700" />
              <span>{t('gpStructureTitle')}</span>
            </h3>

            <div className="space-y-4">
              {gpItems.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={`p-3 rounded-xl ${item.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-800 font-kannada text-base">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flow Stepper */}
          <div className="lg:col-span-7 bg-gradient-to-br from-emerald-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-8">
            <h3 className="text-2xl font-bold text-amber-300 font-kannada">
              {t('journeyFlowTitle')}
            </h3>

            <div className="space-y-6">
              <div className="bg-emerald-800/60 border border-emerald-600/50 p-5 rounded-2xl flex items-center justify-between">
                <span className="font-bold text-lg font-kannada">{t('jFlow1')}</span>
                <ArrowRight className="w-6 h-6 text-amber-400" />
              </div>

              <div className="bg-emerald-800/80 border border-emerald-500/60 p-5 rounded-2xl flex items-center justify-between">
                <span className="font-bold text-lg font-kannada">{t('jFlow2')}</span>
                <ArrowRight className="w-6 h-6 text-amber-400" />
              </div>

              <div className="bg-amber-500 text-slate-950 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <span className="font-extrabold text-xl font-kannada">{t('jFlow3')}</span>
                </div>
                <span className="bg-slate-950 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Goal
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 5 Impact Pillars */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <h3 className="text-center text-xl font-bold text-slate-900 font-kannada mb-8">
            {t('impactPillar1')} • {t('impactPillar2')} • {t('impactPillar3')} • {t('impactPillar4')} • {t('impactPillar5')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center hover:bg-emerald-100/80 transition-colors"
              >
                <span className="block text-amber-600 font-mono font-black text-xs mb-1">
                  PILLAR {p.num}
                </span>
                <span className="font-bold text-slate-900 font-kannada text-sm">
                  {p.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
