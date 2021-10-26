/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import { RichText } from "@graphcms/rich-text-react-renderer";
import { RichTextContent, NodeRendererType } from "@graphcms/rich-text-types";
import { GenericAsset } from "..";
import { RTFLink } from ".";

export type RTFContent = RichTextContent;
export type RTFReferences = {
  id: string;
  mimeType: string;
};
export type ClassNameOverrides = { [key: string]: string };

export interface RTFProps {
  content?: RTFContent;
  references?: RTFReferences[];
  renderers?: NodeRendererType;
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

export const RTF: React.FC<RTFProps> = ({
  className,
  content,
  references,
  renderers,
  classNameOverrides,
  fixedParagraphClassName: pc,
  fixedHeadingClassName: hc,
}) => {
  const realRenderers = useMemo(() => {
    const gcn = (name: string, defaultValue?: string) =>
      getClassName(classNameOverrides, name, defaultValue || name);
    const defaultRenderers: NodeRendererType = {
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
      p: ({ children }) => <p className={pc || gcn("p", "p3")}>{children}</p>,
      li: ({ children }) => <li className={gcn("li")}>{children}</li>,
      a: (props) => RTFLink({ ...props, className: gcn("a") }),
      Asset: {
        "application/pdf": (args: GenericAsset) => {
          return (
            <a
              className="underline"
              href={args.localFile?.publicURL}
              target="_blank"
              rel="noreferrer"
            >
              {args.alt || "here"}
            </a>
          );
        },
      },
    };
    return { ...defaultRenderers, renderers };
  }, [classNameOverrides, renderers, hc, pc]);
  if (!content) {
    return null;
  }

  return (
    <div className={className}>
      <RichText
        content={content}
        references={references}
        renderers={realRenderers}
      />
    </div>
  );
};
