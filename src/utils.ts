import { IGatsbyImageData } from "gatsby-plugin-image";

export interface GenericAsset {
  alt?: string;
  id: string;
  localFile?: File;
  alternateText?: string;
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
  loop?: boolean;
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

export function getVisual(
  asset: GenericAsset | undefined,
  loop = false,
  preview: GenericAsset | undefined = undefined,
  defaultAlt = ""
): VisualAsset | undefined {
  if (!asset) {
    return;
  }

  const image = getImage(asset);
  const alt = getAlt(asset, defaultAlt);
  const svg = getExtractedSvg(asset);
  const possibleVideoUrl = getVideo(asset);
  const animation = getLottie(asset);
  if (!image && !svg && !possibleVideoUrl && !animation) {
    return;
  }

  const videoUrl = !image && !svg && !animation ? possibleVideoUrl : undefined;
  if (videoUrl) {
    const previewImage = videoUrl ? getImage(preview) : undefined;
    return { image: previewImage, alt, videoUrl, loop };
  }

  return { image, alt, svg, videoUrl, animation, loop: !!loop };
}
