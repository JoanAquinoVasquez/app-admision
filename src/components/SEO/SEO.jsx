import { Helmet } from 'react-helmet-async';
import defaultLogo from '../../assets/Isotipos/COLOR.webp';

/**
 * SEO Component - Handles page metadata for search engines and social sharing
 */
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
  
  // URL base de producción (sin la ruta de la app, ya que Vite la incluye en los assets)
  const productionDomain = 'https://epgunprg.edu.pe';
  
  // Combine title with site name
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  
  /**
   * Lógica para la imagen SEO:
   * 1. Si ogImage existe y es una URL absoluta (http...), se usa tal cual.
   * 2. Si ogImage existe y es relativa (procesada por Vite), se le antepone el dominio.
   * 3. Si no existe ogImage, se intenta usar un banner por defecto.
   */
  let finalOgImage = ogImage;
    if (finalOgImage) {
    if (!finalOgImage.startsWith('http')) {
      // Vite ya incluye la ruta base (/admision-epg/) en los imports de assets
      finalOgImage = `${productionDomain}${finalOgImage}`;
    }
  } else {
    // Imagen por defecto (Isotipo solicitado por el usuario)
    finalOgImage = `${productionDomain}${defaultLogo}`;
  }

  // Final Robots content
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  // Final Canonical URL
  const baseAppPath = '/admision-epg';
  const currentPath = window.location.pathname;
  
  let finalCanonical = canonicalUrl;
  if (finalCanonical) {
      if (!finalCanonical.startsWith('http')) {
          // Si no tiene el baseAppPath, se lo agregamos
          if (!finalCanonical.startsWith(baseAppPath)) {
              finalCanonical = `${baseAppPath}${finalCanonical.startsWith('/') ? '' : '/'}${finalCanonical}`;
          }
          finalCanonical = `${productionDomain}${finalCanonical}`;
      }
  } else {
      finalCanonical = `${productionDomain}${currentPath}`;
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content={robotsContent} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || fullDescription} />
      <meta property="og:url" content={ogUrl || finalCanonical} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || fullDescription} />
      <meta name="twitter:image" content={finalOgImage} />
    </Helmet>
  );
};

export default SEO;