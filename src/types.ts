export type Language = 'kn' | 'en' | 'te';

export interface WardMemberRegistration {
  id: string;
  createdAt: string;
  languageSubmitted: Language;
  
  // Personal Info
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  calculatedAge: number;
  
  // Contact Info
  phone: string;
  email: string;
  religion?: string;
  education: string;
  occupation: string;
  
  // Location Details
  district: string;
  taluka: string;
  gramPanchayat: string;
  village: string;
  pincode?: string;
  address?: string;
  
  // Leadership Interest
  participatedInCommunity: boolean;
  contestedElectionBefore: boolean;
  whyBecomeWardMember: string;
  contributionPlan: string;
  
  // Declaration
  declarationAccepted: boolean;
  
  // Meta
  browserInfo?: string;
}

export interface RegistrationStats {
  total: number;
  todayCount: number;
  districtCounts: Record<string, number>;
  genderCounts: Record<string, number>;
  educationCounts: Record<string, number>;
}

export interface AdminFilterState {
  searchQuery: string;
  selectedDistrict: string;
  selectedEducation: string;
  selectedGender: string;
  startDate: string;
  endDate: string;
}

// ==================== DYNAMIC CMS TYPES ====================

export interface CMSNavItem {
  id: string;
  labelKn: string;
  labelEn: string;
  href: string;
  visible: boolean;
  order: number;
}

export interface CMSObjective {
  id: string;
  titleKn: string;
  titleEn: string;
  descKn: string;
  descEn: string;
}

export interface CMSAnnouncement {
  id: string;
  titleKn: string;
  titleEn: string;
  date: string;
  category: string;
  contentKn: string;
  contentEn: string;
  active: boolean;
}

export interface CMSLeadershipMessage {
  id: string;
  nameKn: string;
  nameEn: string;
  roleKn: string;
  roleEn: string;
  messageKn: string;
  messageEn: string;
  photoUrl: string;
}

export interface CMSGalleryItem {
  id: string;
  url: string;
  titleKn: string;
  titleEn: string;
  descKn: string;
  descEn: string;
  category: string;
}

export interface CMSFaqItem {
  id: string;
  qKn: string;
  qEn: string;
  aKn: string;
  aEn: string;
  category: string;
}

export interface CMSDistrict {
  nameEn: string;
  nameKn: string;
  talukas: string[];
}

export interface CMSDropdowns {
  religions: string[];
  educationQualifications: string[];
  occupations: string[];
  karnatakaDistricts: CMSDistrict[];
  gramPanchayats: string[];
}

export type CmsConfig = CMSData;

export interface CMSData {
  logoUrl: string;
  faviconUrl: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    openGraphImage: string;
    canonicalUrl: string;
  };
  hero: {
    taglineKn: string;
    taglineEn: string;
    titleKn: string;
    titleEn: string;
    subtitleKn: string;
    subtitleEn: string;
    heroBgUrl: string;
    ctaRegisterTextKn: string;
    ctaRegisterTextEn: string;
    ctaAboutTextKn: string;
    ctaAboutTextEn: string;
  };
  navigation: CMSNavItem[];
  about: {
    badgeKn: string;
    badgeEn: string;
    titleKn: string;
    titleEn: string;
    descriptionKn: string;
    descriptionEn: string;
    missionTitleKn: string;
    missionTitleEn: string;
    missionTextKn: string;
    missionTextEn: string;
    visionTitleKn: string;
    visionTitleEn: string;
    visionTextKn: string;
    visionTextEn: string;
    objectives: CMSObjective[];
  };
  announcements: CMSAnnouncement[];
  leadershipMessages: CMSLeadershipMessage[];
  stats: {
    villagesCovered: number;
    activeParticipants: number;
    communityEvents: number;
    autoCountRegistrations: boolean;
  };
  gallery: CMSGalleryItem[];
  faqs: CMSFaqItem[];
  dropdowns: CMSDropdowns;
  footer: {
    brandNameKn: string;
    brandNameEn: string;
    taglineKn: string;
    taglineEn: string;
    descKn: string;
    descEn: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    websiteUrl: string;
    quickLinks: Array<{ labelKn: string; labelEn: string; href: string }>;
    copyrightKn: string;
    copyrightEn: string;
  };
}

