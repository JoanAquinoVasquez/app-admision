import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing page metadata
 * Improves search engine optimization and social sharing
 */
export const SEO = ({
    title = 'Admisión - EPG',
    description = 'Sistema de Admisión de la Escuela de Posgrado Universidad Nacional Pedro Ruiz Gallo',
    keywords = 'admisión, posgrado, UNPRG, maestría, doctorado',
    author = 'Universidad Nacional Pedro Ruiz Gallo',
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    canonical,
}) => {
    const siteUrl = window.location.origin;
    const currentUrl = window.location.href;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />

            {/* Canonical URL */}
            <link rel="canonical" href={canonical || currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={ogUrl || currentUrl} />
            <meta property="og:title" content={ogTitle || title} />
            <meta property="og:description" content={ogDescription || description} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={ogUrl || currentUrl} />
            <meta property="twitter:title" content={ogTitle || title} />
            <meta property="twitter:description" content={ogDescription || description} />
            {ogImage && <meta property="twitter:image" content={ogImage} />}

            {/* Additional SEO Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Spanish" />
            <meta name="revisit-after" content="7 days" />

            {/* Structured Data for Organization */}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'EducationalOrganization',
                    name: 'Universidad Nacional Pedro Ruiz Gallo - Escuela de Posgrado',
                    description: description,
                    url: siteUrl,
                })}
            </script>
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    author: PropTypes.string,
    ogTitle: PropTypes.string,
    ogDescription: PropTypes.string,
    ogImage: PropTypes.string,
    ogUrl: PropTypes.string,
    canonical: PropTypes.string,
};

export default SEO;
