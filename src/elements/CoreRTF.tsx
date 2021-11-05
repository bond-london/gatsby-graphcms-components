/* eslint-disable react/display-name */
import React, { Fragment, useMemo } from "react";
import { RichText } from "@graphcms/rich-text-react-renderer";
import { NodeRendererType } from "@graphcms/rich-text-types";
import { RTFLink } from "./RTF/RTFLink";
import { RTFImage } from "./RTF/RTFImage";
import { RTFContent, RTFReferences } from ".";

export type ClassNameOverrides = { [key: string]: string };
export interface DisabledElements {
  ul?: boolean;
  ol?: boolean;
  table?: boolean;
  a?: boolean;
  blockquote?: boolean;
  code?: boolean;
  img?: boolean;
}

export interface RTFProps {
  content?: RTFContent;
  references?: RTFReferences[];
  renderers?: NodeRendererType;
  disabledElements?: DisabledElements;
  className?: string;
  classNameOverrides?: ClassNameOverrides;
  fixedParagraphClassName?: string;
  fixedHeadingClassName?: string;
}

function getClassName(
  classNameOverrides: ClassNameOverrides | undefined,
  className: string,
  defaultValue?: string
) {
  const value = classNameOverrides && classNameOverrides[className];
  return value || defaultValue;
}

const CheckEnabled: React.FC<{ disabled?: boolean; name?: string }> = ({
  disabled,
  children,
  name,
}) => {
  if (disabled) {
    if (name) {
      return <pre>{name} is not enabled</pre>;
    }
    return <Fragment />;
  }
  return <>{children}</>;
};

export const CoreRTF: React.FC<RTFProps> = ({
  className,
  content,
  references,
  renderers,
  classNameOverrides,
  fixedParagraphClassName: pc,
  fixedHeadingClassName: hc,
  disabledElements,
}) => {
  const realRenderers = useMemo(() => {
    const gcn = (name: string, defaultValue?: string) =>
      getClassName(classNameOverrides, name, defaultValue || name);
    const gcnd = (name: string, defaultValue?: string) =>
      getClassName(classNameOverrides, name, defaultValue);
    const defaultRenderers: Required<NodeRendererType> = {
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
      p: ({ children }) => <p className={pc || gcnd("p")}>{children}</p>,
      a: (props) => (
        <CheckEnabled disabled={disabledElements?.a} name="Links">
          <RTFLink {...props} className={gcnd("a")} />
        </CheckEnabled>
      ),
      class: () => <pre>Class not supported</pre>,
      video: () => <pre>Video not supported</pre>,
      img: (props) => (
        <CheckEnabled disabled={disabledElements?.img} name="Image">
          <RTFImage {...props} className={gcnd("img")} />
        </CheckEnabled>
      ),
      iframe: () => <pre>Iframe not supported</pre>,
      blockquote: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.blockquote} name="Blockquote">
          <blockquote className={gcnd("blockquote")}>{children}</blockquote>
        </CheckEnabled>
      ),
      li: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.ul || disabledElements?.ol}>
          <li className={gcnd("li")}>{children}</li>
        </CheckEnabled>
      ),
      ul: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.ul} name="Unordered list">
          <ul className={gcnd("ul")}>{children}</ul>
        </CheckEnabled>
      ),
      ol: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.ol} name="Ordered lists">
          <ol className={gcnd("ol")}>{children}</ol>
        </CheckEnabled>
      ),
      table: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.table} name="Table">
          <table className={gcnd("table")}>{children}</table>
        </CheckEnabled>
      ),
      table_head: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.table}>
          <thead className={gcnd("thead")}>{children}</thead>
        </CheckEnabled>
      ),
      table_body: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.table}>
          <tbody className={gcnd("tbody")}>{children}</tbody>
        </CheckEnabled>
      ),
      table_row: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.table}>
          <tr className={gcnd("tr")}>{children}</tr>
        </CheckEnabled>
      ),
      table_cell: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.table}>
          <td className={gcnd("td")}>{children}</td>
        </CheckEnabled>
      ),
      bold: ({ children }) => <b className={gcn("b")}>{children}</b>,
      italic: ({ children }) => <i className={gcn("i")}>{children}</i>,
      underline: ({ children }) => (
        <u className={gcnd("underline")}>{children}</u>
      ),
      code: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.code} name="Code">
          <code className={gcnd("code")}>{children}</code>
        </CheckEnabled>
      ),
      code_block: ({ children }) => (
        <CheckEnabled disabled={disabledElements?.code} name="Code">
          <pre className={gcnd("pre")}>{children}</pre>
        </CheckEnabled>
      ),
      list_item_child: ({ children }) => <>{children}</>,
      Asset: {
        audio: () => <pre>Audio not supported</pre>,
        image: () => <pre>Image not supported</pre>,
        video: () => <pre>Video not supported</pre>,
        font: () => <pre>Font not supported</pre>,
        application: () => <pre>Application not supported</pre>,
        model: () => <pre>Model not supported</pre>,
        text: () => <pre>Text not supported</pre>,
      },
      embed: {},
    };
    return { ...defaultRenderers, ...renderers };
  }, [classNameOverrides, renderers, hc, pc, disabledElements]);
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
