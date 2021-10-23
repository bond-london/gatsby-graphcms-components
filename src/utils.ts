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

interface ExtractedSvg {
  readonly content: string;
  readonly encoded: string;
}

interface ExtractedLottie {
  readonly animationJson: string;
  readonly encoded: string;
}

interface File {
  readonly childImageSharp?: ImageSharp;
  readonly publicURL?: string;
  readonly svg?: ExtractedSvg;
  readonly lottie?: ExtractedLottie;
}

export interface VisualAsset {
  image?: IGatsbyImageData;
  videoUrl?: string;
  alt: string;
  svg?: ExtractedSvg;
  animation?: ExtractedLottie;
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

export function getLottieFromFile(file?: File): ExtractedLottie | undefined {
  return file?.lottie;
}

export function getLottie(
  node: GenericAsset | undefined
): ExtractedLottie | undefined {
  return getLottieFromFile(node?.localFile);
}

export function getSvgFromFile(file?: File): ExtractedSvg | undefined {
  return file?.svg;
}

export function getExtractedSvg(
  node: GenericAsset | undefined
): ExtractedSvg | undefined {
  return getSvgFromFile(node?.localFile);
}

export function getSvg(node: GenericAsset | undefined): string | undefined {
  return getExtractedSvg(node)?.encoded;
}
