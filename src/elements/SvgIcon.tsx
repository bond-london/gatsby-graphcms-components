import React, { CSSProperties, useMemo } from "react";
import { VisualComponentProps } from ".";

interface Props extends Partial<VisualComponentProps> {
  encoded: string;
  alt: string;
}

export const SvgIcon: React.FC<Props> = (props) => {
  const {
    encoded,
    alt,
    className,
    objectFit,
    objectPosition,
    fitParent,
    noStyle,
    style,
  } = props;

  const fullStyles: CSSProperties | undefined = useMemo(() => {
    if (noStyle) {
      return undefined;
    }
    const conditional: CSSProperties = fitParent
      ? {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
        }
      : {};
    return { ...conditional, ...style };
  }, [fitParent, noStyle, style]);

  return (
    <div className={className} style={fullStyles}>
      <img
        src={encoded}
        alt={alt}
        style={{
          objectFit,
          objectPosition,
        }}
      />
    </div>
  );
};
