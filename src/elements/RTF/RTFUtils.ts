import {
  ElementNode,
  isElement,
  isText,
  Text,
  RichTextContent,
} from "@graphcms/rich-text-types";
import { GenericAsset } from "../..";

export type RTFContent = RichTextContent;
export type RTFReferences = {
  id: string;
  mimeType: string;
};

export interface GenericRichTextNode {
  readonly raw?: unknown;
  readonly html?: string;
  readonly markdown?: string;
  readonly text?: string;
  readonly json?: RTFContent;
  readonly references?: readonly GenericAsset[];
}

function isEmptyText(text: string) {
  return text.trim().length === 0;
}

export function elementIsEmpty(children: (ElementNode | Text)[]): boolean {
  // Checks if the children array has more than one element.
  // It may have a link inside, that's why we need to check this condition.
  if (children.length > 1) {
    const hasText = children.filter(function f(child): boolean | number {
      if (isText(child)) {
        return !isEmptyText(child.text);
      }

      if (isElement(child)) {
        return (child.children = child.children.filter(f)).length;
      }

      return false;
    });

    return hasText.length > 0 ? false : true;
  } else {
    const text = children[0].text;
    if (isEmptyText(text)) return true;
  }

  return false;
}

export function isEmptyRTFContent(content: RichTextContent): boolean {
  if (Array.isArray(content)) {
    return elementIsEmpty(content);
  }

  return elementIsEmpty(content.children);
}

export function isEmptyRTF(node: GenericRichTextNode | undefined): boolean {
  if (!node) {
    return true;
  }

  const content = node.json || (node.raw as RTFContent);
  if (!content) {
    return true;
  }

  return isEmptyRTFContent(content);

  //   const children = content.children;
  //   if (children.length === 0) {
  //     return true;
  //   }
  //   if (children.length === 1) {
  //     const child = children[0];
  //     if (child.type === "paragraph" && child.children.length === 1) {
  //       const firstParagraph = child.children[0];
  //       const text = firstParagraph.text as unknown;
  //       return !text;
  //     }
  //   }

  //   return false;
}

export function getRTF(
  node: GenericRichTextNode | string | undefined
): RTFContent | undefined {
  if (node) {
    if (typeof node === "string") {
      return [{ type: "paragraph", children: [{ text: node }] }];
    }

    if (node.json) {
      return node.json;
    }
    if (node.raw) {
      return node.raw as RTFContent;
    }

    throw new Error(`No json or raw in: ${JSON.stringify(node)}`);
  }
}

export function getRTFReferences(
  node: GenericRichTextNode | undefined
): RTFReferences[] | undefined {
  if (node?.references) {
    return node.references as unknown as RTFReferences[];
  }
}
