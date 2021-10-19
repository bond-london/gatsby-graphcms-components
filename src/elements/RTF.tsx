/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import { RichText } from "@graphcms/rich-text-react-renderer";
import { RichTextContent } from "@graphcms/rich-text-types";
import classNames from "classnames";

export type RTFContent = RichTextContent;
export type ClassNameOverrides = { [key: string]: string };

interface Props {
  content?: RTFContent;
  className?: string;
  classNameOverrides?: ClassNameOverrides;
  fixedParagraphClassName?: string;
  fixedHeadingClassName?: string;
}

function getClassName(
  classNameOverrides: ClassNameOverrides | undefined,
  className: string,
  defaultValue: string
) {
  const value = classNameOverrides && classNameOverrides[className];
  return value || defaultValue;
}

export const RTF: React.FC<Props> = ({
  className,
  content,
  classNameOverrides,
  fixedParagraphClassName: pc,
  fixedHeadingClassName: hc,
}) => {
  const gcn = useMemo(
    () => (name: string, defaultValue?: string) =>
      getClassName(classNameOverrides, name, defaultValue || name),
    [classNameOverrides]
  );
  if (!content) {
    return null;
  }

  return (
    <div className={classNames(className, "rich-text space-y-20px")}>
      <RichText
        content={content}
        renderers={{
          h1: ({ children }) => (
            <h2 className={hc || pc || gcn("h1")}>{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 className={hc || pc || gcn("h2")}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={hc || pc || gcn("h3")}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className={hc || pc || gcn("h4")}>{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className={hc || pc || gcn("h5")}>{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className={hc || pc || gcn("h6")}>{children}</h6>
          ),
          p: ({ children }) => (
            <p className={pc || gcn("p", "p3")}>{children}</p>
          ),
        }}
      />
    </div>
  );
};
