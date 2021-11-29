import React, { CSSProperties, useMemo } from "react";

interface Props {
  encoded?: string;
  alt: string;
  className?: string;
  fitParent?: boolean;
  onClick?: (ev: React.SyntheticEvent) => void;
}

export const SvgIcon: React.FC<Props> = ({
  encoded,
  alt,
  className,
  fitParent,
  onClick,
}) => {
  const fullStyles: CSSProperties = useMemo(() => {
    return fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : {};
  }, [fitParent]);

  if (!encoded) {
    return null;
  }

  return (
    <img
      src={encoded}
      alt={alt}
      className={className}
      style={fullStyles}
      onClick={onClick}
    />
  );
};
