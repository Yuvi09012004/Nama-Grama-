import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CmsProvider, useCms } from './context/CmsContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { StrongerPanchayatSection } from './components/StrongerPanchayatSection';
import { WhyWardMemberSection } from './components/WhyWardMemberSection';
import { ModulesSection } from './components/ModulesSection';
import { TransformationJourneySection } from './components/TransformationJourneySection';
import { GallerySection } from './components/GallerySection';
import { FaqSection } from './components/FaqSection';
import { RegistrationForm } from './components/RegistrationForm';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

function MainApp() {
  const [adminOpen, setAdminOpen] = useState(false);
  const { loading } = useCms();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800">ನಮ್ಮ ಗ್ರಾಮ ನಾಯಕ load ಆಗುತ್ತಿದೆ...</h2>
        <p className="text-sm text-slate-500 mt-1">Fetching dynamic content and candidate configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Sticky Header with Language Switcher & Admin trigger */}
      <Header onOpenAdmin={() => setAdminOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <StrongerPanchayatSection />
        <WhyWardMemberSection />
        <ModulesSection />
        <TransformationJourneySection />
        <GallerySection />
        <FaqSection />
        <RegistrationForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Dashboard / CMS Panel Drawer/Modal */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </CmsProvider>
  );
}

