import { getSrc, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import { Helmet } from "react-helmet";

interface SiteBuildMetadata {
  readonly buildTime?: unknown;
}

export interface Seo {
  title: string;
  description?: string;
  image?: IGatsbyImageData;
  keywords?: string;
  noIndex?: boolean;
}
interface Props {
  siteBuildMetadata: SiteBuildMetadata & { buildYear: string };
  siteMetadata: Seo;
  pageMetadata: Seo;
  pageUrl: string;
  pageTitle: string;
  className?: string;
  schemaOrgs?: unknown[];
}

export const SEO: React.FC<Props> = ({
  siteBuildMetadata,
  siteMetadata,
  pageMetadata,
  pageUrl,
  pageTitle,
  className,
  schemaOrgs,
}) => {
  const description =
    pageMetadata?.description || siteMetadata.description || pageTitle;
  const image = pageMetadata.image || siteMetadata.image;
  const imageSrc = image && getSrc(image);
  const imageUrl = imageSrc && pageUrl + imageSrc;
  const keywords = pageMetadata?.keywords || siteMetadata?.keywords;

  const baseSchema = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: pageUrl,
    name: pageTitle,
    alternateName: siteMetadata.title,
  };

  const realSchema: unknown = schemaOrgs
    ? {
        "@context": "http://schema.org",
        "@graph": schemaOrgs,
      }
    : baseSchema;

  return (
    <>
      <Helmet htmlAttributes={{ lang: "en" }}>
        {pageMetadata.noIndex && (
          <meta name="robots" content="noindex, nofollow" />
        )}
        <title>{pageTitle}</title>
        <noscript>This site runs best with JavaScript enabled</noscript>
        <meta name="description" content={description} />
        <meta name="image" content={imageUrl} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="designer" content="Bond London" />
        {siteBuildMetadata.buildTime && (
          <meta
            name="revised"
            content={siteBuildMetadata.buildTime as string}
          />
        )}

        {/* Open graph tags */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />

        {/* Twitter card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />

        <script type="application/ld+json">{JSON.stringify(realSchema)}</script>
        {className && <body className={className} />}
      </Helmet>
    </>
  );
};
