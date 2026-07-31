import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { motion } from 'motion/react';
import { Image } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { language, t } = useLanguage();
  const { cmsData, getCmsText } = useCms();

  const cmsGallery = cmsData.gallery || [];

  const photos = cmsGallery.length > 0
    ? cmsGallery.map((g) => ({
        url: g.url,
        title: getCmsText(g.titleKn, g.titleEn, language),
        desc: getCmsText(g.descKn, g.descEn, language),
        category: g.category
      }))
    : [
        {
          url: "/src/assets/images/karnataka_village_hero_1785475191493.jpg",
          title: "Grama Panchayat Ward Sabha",
          desc: "Community gathering under banyan tree discussing local water & sanitation priorities.",
          category: "Ward Sabha"
        },
        {
          url: "/src/assets/images/rural_community_lead_1785475211796.jpg",
          title: "Youth Leadership Movement",
          desc: "Aspiring Ward Members collaborating with village elders for inclusive planning.",
          category: "Youth Empowerment"
        },
        {
          url: cmsData.logoUrl || "/src/assets/images/official_namma_grama_logo_1785490337996.jpg",
          title: "Namma Grama Nayaka Emblem",
          desc: "Symbol of Karnataka's Ward-led Grama Swaraj movement.",
          category: "Leadership Emblem"
        }
      ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Image className="w-4 h-4 text-amber-700" />
            <span>Karnataka Rural Vision & Media Gallery</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-kannada tracking-tight">
            {t('galleryTitle')}
          </h2>
          <p className="mt-3 text-slate-600 font-medium">
            {t('gallerySub')}
          </p>
          <div className="w-20 h-1.5 bg-emerald-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photos.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute top-3 left-3">
                  {item.category && (
                    <span className="bg-emerald-700/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg font-kannada drop-shadow-xs">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

