import React, { CSSProperties, useMemo } from "react";
import { InternalVisualComponentProps } from ".";

interface Props extends Partial<InternalVisualComponentProps> {
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
    visualStyle,
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

  const imgStyle: CSSProperties = useMemo(
    () => ({ objectFit, objectPosition, ...visualStyle }),
    [objectFit, objectPosition, visualStyle]
  );

  return (
    <div className={className} style={fullStyles}>
      <img src={encoded} alt={alt} style={imgStyle} />
    </div>
  );
};
