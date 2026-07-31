import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { cmsData, getCmsText } = useCms();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const cmsFaqs = cmsData.faqs || [];

  const faqs = cmsFaqs.length > 0
    ? cmsFaqs.map((item) => ({
        q: getCmsText(item.qKn, item.qEn, language),
        a: getCmsText(item.aKn, item.aEn, language),
        category: item.category
      }))
    : [
        { q: t('faqQ1'), a: t('faqA1'), category: 'General' },
        { q: t('faqQ2'), a: t('faqA2'), category: 'Eligibility' },
        { q: t('faqQ3'), a: t('faqA3'), category: 'Process' },
        { q: t('faqQ4'), a: t('faqA4'), category: 'Impact' },
        { q: t('faqQ5'), a: t('faqA5'), category: 'Support' },
      ];

  return (
    <section id="faqs" className="py-20 bg-[#f8f6f0] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>Information Center</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-kannada tracking-tight">
            {t('faqTitle')}
          </h2>
          <p className="mt-3 text-slate-600 font-medium">
            {t('faqSubtitle')}
          </p>
          <div className="w-20 h-1.5 bg-emerald-600 rounded-full mx-auto mt-4" />
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-lg text-slate-900 font-kannada flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {faq.q}
                  </span>
                  <div className={`p-2 rounded-lg transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-700 bg-emerald-50' : 'text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100 px-6 py-5 bg-emerald-50/20"
                    >
                      <p className="text-slate-700 leading-relaxed font-kannada text-base">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

