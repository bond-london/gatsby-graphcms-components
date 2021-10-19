import React from "react";
import { Helmet } from "react-helmet";

interface Props {
  pageUrl: string;
  title: string;
  defaultTitle: string;
}
export const SchemaOrg: React.FC<Props> = ({
  pageUrl,
  title,
  defaultTitle,
}) => {
  const baseSchema = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: pageUrl,
    name: title,
    alternateName: defaultTitle,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(baseSchema)}</script>
    </Helmet>
  );
};
