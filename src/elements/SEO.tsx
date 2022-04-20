import { getSrc, IGatsbyImageData } from "gatsby-plugin-image";
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";

export interface SiteBuildMetadata {
  readonly buildTime?: unknown;
  readonly buildYear: string;
}

export interface SiteMetadata {
  readonly siteName: string;
  readonly siteUrl: string;
  readonly logo?: string;
  readonly sameAs?: string[];
}

export interface Seo {
  title: string;
  description?: string;
  image?: IGatsbyImageData;
  keywords?: string;
  noIndex?: boolean;
}
interface Props {
  siteBuildMetadata: SiteBuildMetadata;
  siteMetadata: SiteMetadata;
  pageMetadata: Seo;
  pagePath: string;
  pageTitle: string;
  className?: string;
  schemaOrgs?: unknown[];
  additionalSchemas?: unknown[];
}

export function buildOrganizationSchema(
  name: string,
  url: string,
  logo?: string,
  sameAs?: string[]
) {
  return { "@type": "Organization", name, url, logo, sameAs };
}

export function buildWebsiteSchema(name: string, url: string) {
  return { "@type": "WebSite", name, url };
}

export const SEO: React.FC<Props> = ({
  siteBuildMetadata: { buildTime },
  siteMetadata: { siteName, siteUrl, logo, sameAs },
  pageMetadata,
  pagePath,
  pageTitle,
  className,
  schemaOrgs,
  additionalSchemas,
}) => {
  if (!siteName) {
    throw new Error(`The site metadata must have siteName`);
  }
  if (!siteUrl) {
    throw new Error(`The site metadata must have siteUrl`);
  }

  const description = pageMetadata?.description;
  const image = pageMetadata.image;
  const imageSrc = image && getSrc(image);
  const imageUrl = imageSrc && siteUrl + imageSrc;
  const keywords = pageMetadata?.keywords;

  const schemaOrg = useMemo(() => {
    const schemas = schemaOrgs || [
      buildOrganizationSchema(siteName, siteUrl, logo, sameAs),
      buildWebsiteSchema(siteName, siteUrl),
    ];
    if (additionalSchemas) {
      schemas.push(...additionalSchemas);
    }

    return { "@context": "http://schema.org", "@graph": schemas };
  }, [schemaOrgs, siteName, siteUrl, logo, sameAs, additionalSchemas]);

  const pageUrl = siteUrl + pagePath;

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      {pageMetadata.noIndex && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      <title>{pageTitle}</title>
      <noscript>This site runs best with JavaScript enabled</noscript>
      {description && <meta name="description" content={description} />}
      {imageUrl && <meta name="image" content={imageUrl} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="designer" content="Bond London" />
      {buildTime ? (
        <meta name="revised" content={buildTime as string} />
      ) : undefined}

      {/* Open graph tags */}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:type" content="website" />
      {description && <meta property="og:description" content={description} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      {className && <body className={className} />}
    </Helmet>
  );
};
