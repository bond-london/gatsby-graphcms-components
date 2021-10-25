import { RTFContent } from "./elements";
import { IGatsbyImageData } from "gatsby-plugin-image";

export interface GenericRichTextNode {
  readonly remoteTypeName: string | undefined;
  readonly raw?: unknown;
  readonly html?: string;
  readonly markdown?: string;
  readonly text?: string;
  readonly json?: RTFContent;
}

interface ImageSharp {
  readonly gatsbyImageData: IGatsbyImageData;
}

export interface SvgInformation {
  readonly content: string;
  readonly encoded: string;
}

export interface LottieInformation {
  readonly animationJson: string;
  readonly encoded: string;
}

interface File {
  readonly childImageSharp?: ImageSharp;
  readonly publicURL?: string;
  readonly svg?: SvgInformation;
  readonly lottie?: LottieInformation;
}

export interface VisualAsset {
  image?: IGatsbyImageData;
  videoUrl?: string;
  alt: string;
  svg?: SvgInformation;
  animation?: LottieInformation;
}

export function isEmptyRTF(node: GenericRichTextNode | undefined): boolean {
  if (!node) {
    return true;
  }

  const content = node.json || (node.raw as RTFContent);
  if (!content) {
    return true;
  }

  if (Array.isArray(content)) {
    return content.length === 0;
  }

  const children = content.children;
  if (children.length === 0) {
    return true;
  }
  if (children.length === 1) {
    const child = children[0];
    if (child.type === "paragraph" && child.children.length === 1) {
      const firstParagraph = child.children[0];
      const text = firstParagraph.text as unknown;
      return !text;
    }
  }

  return false;
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

export interface GenericAsset {
  id: string;
  localFile?: File;
  alternateText?: string;
}

export function getImageFromFile(file?: File): IGatsbyImageData | undefined {
  return file?.childImageSharp?.gatsbyImageData;
}

export function getImage(
  node: GenericAsset | undefined
): IGatsbyImageData | undefined {
  return getImageFromFile(node?.localFile);
}

export function getAlt(
  node: GenericAsset | undefined,
  defaultValue: string
): string {
  return node?.alternateText || defaultValue;
}

export function getVideoFromFile(file?: File): string | undefined {
  return file?.publicURL;
}

export function getVideo(node: GenericAsset | undefined): string | undefined {
  return getVideoFromFile(node?.localFile);
}

export function getLottieFromFile(file?: File): LottieInformation | undefined {
  return file?.lottie;
}

export function getLottie(
  node: GenericAsset | undefined
): LottieInformation | undefined {
  return getLottieFromFile(node?.localFile);
}

export function getSvgFromFile(file?: File): SvgInformation | undefined {
  return file?.svg;
}

export function getExtractedSvg(
  node: GenericAsset | undefined
): SvgInformation | undefined {
  return getSvgFromFile(node?.localFile);
}

export function getSvg(node: GenericAsset | undefined): string | undefined {
  return getExtractedSvg(node)?.encoded;
}
