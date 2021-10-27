import React from "react";
import { ImageProps } from "@graphcms/rich-text-types";

export const RTFImage: React.FC<Partial<ImageProps> & { className?: string }> =
  ({ src, width, height, altText, title, className }) => {
    if (!src) {
      return <pre>No src</pre>;
    }
    return (
      <img
        loading="lazy"
        src={encodeURI(src)}
        width={width}
        height={height}
        alt={altText}
        title={title}
        className={className}
      />
    );
  };
