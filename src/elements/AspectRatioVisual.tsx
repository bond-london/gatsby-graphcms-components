import React, { CSSProperties, PropsWithChildren } from "react";
import { VisualAsset } from "../utils";
import { AutoVisual } from "./AutoVisual";

export const AspectRatioVisual: React.FC<
  PropsWithChildren<{
    visual?: VisualAsset;
    className?: string;
    aspectRatioClassName: string;
    visualClassName?: string;
    visualStyle?: CSSProperties;
  }>
> = ({
  visual,
  className,
  aspectRatioClassName,
  visualClassName,
  children,
  visualStyle,
}) => {
  if (!visual) {
    return null;
  }

  return (
    <div style={{ position: "relative" }} className={className}>
      <div className={aspectRatioClassName}>
        {children}
        <AutoVisual
          visual={visual}
          fitParent={true}
          className={visualClassName}
          visualStyle={{ ...visualStyle, width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};
