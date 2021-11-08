import {
  ElementNode,
  isElement,
  isText,
  Text,
  RichTextContent,
  Node,
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

function cleanupTextString(text: string) {
  return text.replace(/\s+/g, " ");
}

function isEmptyText(text: string) {
  return text.trim().length === 0;
}

function cleanupElement(element: ElementNode): ElementNode | undefined {
  const { children, ...rest } = element;
  if (elementIsEmpty(children)) {
    return;
  }
  const newChildren = cleanupElements(children);
  return { ...rest, children: newChildren };
}

function cleanupText(text: Text): Text {
  return { ...text, text: cleanupTextString(text.text) };
}

function cleanupNode(node: Node): Node | undefined {
  if (isText(node)) {
    return cleanupText(node);
  }
  if (isElement(node)) {
    return cleanupElement(node);
  }

  return node;
}

function cleanupElements(elements: Node[]): Node[] {
  return elements.map(cleanupNode).filter((n) => n) as Node[];
}

export function cleanupRTF(content: RTFContent): RTFContent {
  const elements = Array.isArray(content) ? content : content.children;
  const newElements = cleanupElements(elements);
  return newElements as ElementNode[];
}

function isNotEmpty(child: ElementNode | Text): boolean {
  if (isText(child)) {
    return !isEmptyText(child.text);
  }

  if (isElement(child)) {
    const nonEmptyChildren = child.children.filter(isNotEmpty);
    return nonEmptyChildren.length > 0;
  }

  return false;
}

export function elementIsEmpty(children: (ElementNode | Text)[]): boolean {
  // Checks if the children array has more than one element.
  // It may have a link inside, that's why we need to check this condition.
  if (children.length > 1) {
    const nonEmptyChildren = children.filter(isNotEmpty);
    return nonEmptyChildren.length === 0;
  }

  const child = children[0];
  if (isText(child)) {
    const text = child.text;
    if (isEmptyText(text)) return true;
  }

  return false;
}

export function isEmptyRTFContent(content: RichTextContent): boolean {
  const realContent = Array.isArray(content) ? content : content.children;
  return elementIsEmpty(realContent);
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
