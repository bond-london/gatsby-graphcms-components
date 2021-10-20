import React from "react";

interface Props {
  encoded?: string;
  alt?: string;
  className?: string;
}

export const SvgIcon: React.FC<Props> = ({ encoded, alt, className }) => {
  if (!encoded) {
    return null;
  }

  return <img src={encoded} alt={alt || "icon"} className={className} />;
};
