import React, { CSSProperties, useMemo } from "react";

interface Props {
  encoded: string;
  alt: string;
  className?: string;
  fitParent?: boolean;
  noStyle?: boolean;
}

export const SvgIcon: React.FC<Props> = ({
  encoded,
  alt,
  className,
  fitParent,
  noStyle,
}) => {
  const fullStyles: CSSProperties | undefined = useMemo(() => {
    return !noStyle && fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : undefined;
  }, [fitParent, noStyle]);

  return (
    <img src={encoded} alt={alt} className={className} style={fullStyles} />
  );
};
