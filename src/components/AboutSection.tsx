import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { motion } from 'motion/react';
import { Lightbulb, Target, HeartHandshake, ArrowRight, CheckCircle2, Megaphone, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { cmsData, getCmsText } = useCms();

  const communityImg = cmsData.leadershipMessages?.[0]?.photoUrl || "/src/assets/images/rural_community_lead_1785475211796.jpg";

  const badgeText = getCmsText(cmsData.about?.badgeKn, cmsData.about?.badgeEn, language) || t('aboutSectionTag');
  const titleText = getCmsText(cmsData.about?.titleKn, cmsData.about?.titleEn, language) || t('aboutTitle');
  const descText = getCmsText(cmsData.about?.descriptionKn, cmsData.about?.descriptionEn, language) || t('aboutParagraph');

  const missionTitle = getCmsText(cmsData.about?.missionTitleKn, cmsData.about?.missionTitleEn, language) || "Mission";
  const missionText = getCmsText(cmsData.about?.missionTextKn, cmsData.about?.missionTextEn, language) || t('insight1Desc');

  const visionTitle = getCmsText(cmsData.about?.visionTitleKn, cmsData.about?.visionTitleEn, language) || "Vision";
  const visionText = getCmsText(cmsData.about?.visionTextKn, cmsData.about?.visionTextEn, language) || t('insight2Desc');

  // Dynamic Objectives / Insights
  const cmsObjectives = cmsData.about?.objectives || [];

  const flowSteps = [
    { num: "01", label: t('flow1Label') },
    { num: "02", label: t('flow2Label') },
    { num: "03", label: t('flow3Label') },
    { num: "04", label: t('flow4Label') },
  ];

  const activeAnnouncements = (cmsData.announcements || []).filter(a => a.active);

  return (
    <section id="about" className="py-20 bg-[#fdfbf7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Active Announcements Ticker / Banner if available */}
        {activeAnnouncements.length > 0 && (
          <div className="mb-12 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 text-amber-900 font-bold mb-3">
              <Megaphone className="w-5 h-5 text-amber-600 animate-pulse" />
              <span className="uppercase text-xs tracking-wider">Latest Official Updates & Workshops</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAnnouncements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {ann.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{ann.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm font-kannada">
                      {getCmsText(ann.titleKn, ann.titleEn, language)}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {getCmsText(ann.contentKn, ann.contentEn, language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            {badgeText}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-kannada tracking-tight">
            {titleText}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-xs border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-50 mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-kannada mb-3">
              {missionTitle}
            </h3>
            <p className="text-slate-600 leading-relaxed text-base">
              {missionText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-xs border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-amber-600 bg-amber-50 mb-6">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-kannada mb-3">
              {visionTitle}
            </h3>
            <p className="text-slate-600 leading-relaxed text-base">
              {visionText}
            </p>
          </motion.div>
        </div>

        {/* Dynamic Objectives Grid */}
        {cmsObjectives.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {cmsObjectives.map((obj, idx) => (
              <motion.div
                key={obj.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-emerald-950/5 rounded-2xl p-6 border border-emerald-100 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold mb-4 font-mono">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-bold text-slate-900 font-kannada mb-2">
                  {getCmsText(obj.titleKn, obj.titleEn, language)}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {getCmsText(obj.descKn, obj.descEn, language)}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Question & Answer Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-16"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-amber-400/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                {t('insightQuestionTitle')}
              </div>
              <blockquote className="text-2xl sm:text-3xl font-bold text-amber-200 font-kannada leading-snug">
                "{t('insightQuestion')}"
              </blockquote>
              
              <div className="pt-4 border-t border-emerald-700/50">
                <span className="text-emerald-400 font-bold text-sm uppercase block mb-1">
                  {t('insightAnswerTitle')}
                </span>
                <p className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
                  {t('insightAnswer')}
                </p>
              </div>

              <p className="text-slate-300 leading-relaxed text-sm pt-2">
                {descText}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/30 shadow-lg">
                <img
                  src={communityImg}
                  alt="Rural Community Leaders Meeting"
                  className="w-full h-72 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-xs font-semibold text-amber-300 font-kannada">
                    {t('sloganStrongWards')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4-Step Transformation Flow */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm">
          <h3 className="text-center text-xl font-bold text-slate-800 font-kannada mb-8">
            {t('flow1Label')} → {t('flow4Label')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flowSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-amber-500 font-mono">
                      {step.num}
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-kannada">
                    {step.label}
                  </h4>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-emerald-400">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

