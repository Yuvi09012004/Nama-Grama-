import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronDown, CheckCircle2, Award, Zap } from 'lucide-react';

export const ModulesSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<number | null>(0);

  const modules = [
    { num: t('mod1Num'), title: t('mod1Title'), desc: t('mod1Desc') },
    { num: t('mod2Num'), title: t('mod2Title'), desc: t('mod2Desc') },
    { num: t('mod3Num'), title: t('mod3Title'), desc: t('mod3Desc') },
    { num: t('mod4Num'), title: t('mod4Title'), desc: t('mod4Desc') },
    { num: t('mod5Num'), title: t('mod5Title'), desc: t('mod5Desc') },
    { num: t('mod6Num'), title: t('mod6Title'), desc: t('mod6Desc') },
    { num: t('mod7Num'), title: t('mod7Title'), desc: t('mod7Desc') },
    { num: t('mod8Num'), title: t('mod8Title'), desc: t('mod8Desc') },
    { num: t('mod9Num'), title: t('mod9Title'), desc: t('mod9Desc') },
    { num: t('mod10Num'), title: t('mod10Title'), desc: t('mod10Desc') },
  ];

  return (
    <section id="modules" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Curriculum</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-kannada tracking-tight">
            {t('modulesTitle')}
          </h2>
          <p className="mt-4 text-slate-600 text-lg font-medium">
            {t('modulesSubtitle')}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, idx) => {
            const isOpen = activeTab === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 2) * 0.1 }}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-1 ring-emerald-500/30'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 font-mono font-black text-lg flex items-center justify-center shadow-xs">
                      {mod.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-kannada leading-snug">
                        {mod.title}
                      </h3>
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-700 bg-emerald-100' : 'text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-8 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-950 text-amber-400 rounded-2xl hidden sm:block">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold font-kannada">
                {t('sloganTriad')}
              </h4>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {t('sloganCallToAction')}
              </p>
            </div>
          </div>

          <a
            href="#register"
            className="whitespace-nowrap bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-md"
          >
            {t('btnRegister')}
          </a>
        </div>

      </div>
    </section>
  );
};
