import React, { createContext, useContext, useState, useEffect } from 'react';
import { CMSData } from '../types';
import { DEFAULT_CMS_DATA } from '../data/defaultCmsData';

interface CmsContextType {
  cmsData: CMSData;
  loading: boolean;
  error: string | null;
  refreshCmsData: () => Promise<void>;
  updateCmsData: (newData: CMSData, adminToken: string) => Promise<{ success: boolean; error?: string }>;
  uploadImageAsset: (base64Data: string, fileName: string, adminToken: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  getCmsText: (fieldKn: string | undefined, fieldEn: string | undefined, lang: string) => string;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(DEFAULT_CMS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCmsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cms');
      if (response.ok) {
        const data = await response.json();
        setCmsData(data);
        updateDocumentSeo(data);
      } else {
        console.warn('Failed to fetch CMS data, falling back to default CMS data.');
      }
    } catch (err: any) {
      console.error('Error loading CMS data:', err);
      setError(err.message || 'Error fetching CMS data');
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentSeo = (data: CMSData) => {
    if (!data.seo) return;
    
    // Page Title
    if (data.seo.title) {
      document.title = data.seo.title;
    }

    // Meta Description
    if (data.seo.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', data.seo.description);
    }

    // Keywords
    if (data.seo.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', data.seo.keywords);
    }

    // Open Graph Image
    if (data.seo.openGraphImage) {
      let metaOgImg = document.querySelector('meta[property="og:image"]');
      if (!metaOgImg) {
        metaOgImg = document.createElement('meta');
        metaOgImg.setAttribute('property', 'og:image');
        document.head.appendChild(metaOgImg);
      }
      metaOgImg.setAttribute('content', data.seo.openGraphImage);
    }

    // Favicon
    if (data.faviconUrl) {
      let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'shortcut icon';
        document.head.appendChild(favicon);
      }
      favicon.href = data.faviconUrl;
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  const refreshCmsData = async () => {
    await fetchCmsData();
  };

  const updateCmsData = async (newData: CMSData, adminToken: string) => {
    try {
      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newData)
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setCmsData(resData.cms);
        updateDocumentSeo(resData.cms);
        return { success: true };
      } else {
        return { success: false, error: resData.error || 'Failed to update CMS data' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating CMS' };
    }
  };

  const uploadImageAsset = async (base64Data: string, fileName: string, adminToken: string) => {
    try {
      const response = await fetch('/api/admin/image-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ base64Data, fileName })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        return { success: true, url: resData.url };
      } else {
        return { success: false, error: resData.error || 'Failed to upload image asset' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error uploading asset' };
    }
  };

  const getCmsText = (fieldKn: string | undefined, fieldEn: string | undefined, lang: string): string => {
    if (lang === 'en') {
      return fieldEn || fieldKn || '';
    }
    return fieldKn || fieldEn || '';
  };

  return (
    <CmsContext.Provider
      value={{
        cmsData,
        loading,
        error,
        refreshCmsData,
        updateCmsData,
        uploadImageAsset,
        getCmsText
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
