import React, { CSSProperties, useMemo } from "react";

interface Props {
  encoded: string;
  alt: string;
  className?: string;
  fitParent?: boolean;
}

export const SvgIcon: React.FC<Props> = ({
  encoded,
  alt,
  className,
  fitParent,
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

  return (
    <img src={encoded} alt={alt} className={className} style={fullStyles} />
  );
};
