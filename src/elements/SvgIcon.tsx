import React from "react";
import { VisualComponentProps } from ".";
import { useStyles } from "..";

interface Props extends Partial<VisualComponentProps> {
  encoded: string;
  alt: string;
}

export const SvgIcon: React.FC<Props> = (props) => {
  const { encoded, alt, className } = props;
  const fullStyles = useStyles(props);

  return (
    <img src={encoded} alt={alt} className={className} style={fullStyles} />
  );
};
