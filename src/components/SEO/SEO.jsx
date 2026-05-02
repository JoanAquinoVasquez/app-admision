import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false,
  noFollow = false
}) => {
  const defaultTitle = 'Admisión EPG - Universidad Nacional Pedro Ruiz Gallo';
  const defaultDescription = 'Sistema de Admisión de la Escuela de Posgrado UNPRG. Programas de Maestría, Doctorado y Segundas Especialidades.';
  const baseUrl = 'https://epgunprg.edu.pe/admision-epg';

  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  useEffect(() => {
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;

    const updateMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    const updateOgMeta = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.property = property;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    updateMeta('description', description || defaultDescription);
    updateMeta('robots', robotsContent);
    if (keywords) updateMeta('keywords', keywords);

    updateOgMeta('og:title', ogTitle || title || defaultTitle);
    updateOgMeta('og:description', ogDescription || description || defaultDescription);
    updateOgMeta('og:url', ogUrl || canonicalUrl || window.location.href);
    if (ogImage) updateOgMeta('og:image', ogImage);

    updateMeta('twitter:card', twitterCard);
    updateMeta('twitter:title', ogTitle || title || defaultTitle);
    updateMeta('twitter:description', ogDescription || description || defaultDescription);
    if (ogImage) updateMeta('twitter:image', ogImage);

    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`;
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, twitterCard, canonicalUrl, robotsContent]);

  return null;
};

export default SEO;