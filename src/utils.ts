import { IGatsbyImageData } from "gatsby-plugin-image";
import { CSSProperties } from "react";

export interface GenericAsset {
  alt?: string | null;
  id: string;
  localFile?: File | null;
  alternateText?: string | null;
  dontCrop?: boolean | null;
  verticalCropPosition?: VerticalPosition | null;
  horizontalCropPosition?: HorizontalPosition | null;
  handle: string;
}

interface ImageSharp {
  readonly gatsbyImageData: IGatsbyImageData;
}

export interface SvgInformation {
  readonly content: string;
  readonly encoded: string;
}

export interface LottieInformation {
  readonly animationUrl: string;
  readonly encoded: string;
}

interface File {
  readonly childImageSharp?: ImageSharp | null;
  readonly publicURL?: string | null;
  readonly svg?: SvgInformation | null;
  readonly lottie?: Omit<LottieInformation, "animationUrl"> | null;
  readonly name?: string | null;
}

export type VerticalPosition = "Top" | "Middle" | "Bottom";
export type HorizontalPosition = "Left" | "Middle" | "Right";

export interface VisualAsset {
  image?: IGatsbyImageData;
  videoUrl?: string;
  alt: string;
  svg?: SvgInformation;
  animation?: LottieInformation;
  loop?: boolean;
  dontCrop?: boolean;
  verticalCropPosition?: VerticalPosition;
  horizontalCropPosition?: HorizontalPosition;
}

export function validateAssetHasFile(
  asset: GenericAsset | undefined | null
): void {
  if (asset && !asset.localFile) {
    throw new Error(`Asset ${asset.id} has no local file`);
  }
}

export function getImageFromFile(
  file?: File | null
): IGatsbyImageData | undefined {
  return file?.childImageSharp?.gatsbyImageData;
}

export function getImage(
  node: GenericAsset | undefined | null
): IGatsbyImageData | undefined {
  validateAssetHasFile(node);
  return getImageFromFile(node?.localFile);
}

export function getAlt(
  node: GenericAsset | undefined,
  defaultValue: string
): string {
  return node?.alternateText || defaultValue;
}

export function getVideoFromFile(file?: File | null): string | undefined {
  return file?.publicURL || undefined;
}

export function getVideo(node: GenericAsset | undefined): string | undefined {
  validateAssetHasFile(node);
  return getVideoFromFile(node?.localFile);
}

export function getLottieFromFile(
  file?: File | null
): LottieInformation | undefined {
  if (file?.lottie && file?.publicURL) {
    return {
      encoded: file.lottie.encoded,
      animationUrl: file.publicURL,
    };
  }
}

export function getLottie(
  node: GenericAsset | undefined
): LottieInformation | undefined {
  validateAssetHasFile(node);
  return getLottieFromFile(node?.localFile);
}

export function getSvgFromFile(file?: File | null): SvgInformation | undefined {
  return file?.svg || undefined;
}

export function getExtractedSvg(
  node: GenericAsset | undefined
): SvgInformation | undefined {
  validateAssetHasFile(node);
  return getSvgFromFile(node?.localFile);
}

export function getSvg(node: GenericAsset | undefined): string | undefined {
  return getExtractedSvg(node)?.encoded;
}

export function getVisual(
  asset: GenericAsset | undefined | null,
  loop = false,
  preview: GenericAsset | undefined | null = undefined,
  defaultAlt = ""
): VisualAsset | undefined {
  if (!asset) {
    return;
  }

  const { dontCrop, verticalCropPosition, horizontalCropPosition } = asset;
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
    return {
      image: previewImage,
      alt,
      videoUrl,
      loop,
      dontCrop: dontCrop || undefined,
      verticalCropPosition: verticalCropPosition || undefined,
      horizontalCropPosition: horizontalCropPosition || undefined,
    };
  }

  return {
    image,
    alt,
    svg,
    animation,
    loop: !!loop,
    dontCrop: dontCrop || undefined,
    verticalCropPosition: verticalCropPosition || undefined,
    horizontalCropPosition: horizontalCropPosition || undefined,
  };
}

export function getVisualFromFile(
  file: File | undefined,
  loop = false,
  defaultAlt = "",
  dontCrop?: boolean,
  verticalCropPosition?: VerticalPosition,
  horizontalCropPosition?: HorizontalPosition
): VisualAsset | undefined {
  if (!file) {
    return;
  }

  const alt = defaultAlt || "";
  const image = getImageFromFile(file);
  const svg = getSvgFromFile(file);
  const possibleVideoUrl = getVideoFromFile(file);
  const animation = getLottieFromFile(file);
  if (!image && !svg && !possibleVideoUrl && !animation) {
    return;
  }

  const videoUrl = !image && !svg && !animation ? possibleVideoUrl : undefined;
  if (videoUrl) {
    return {
      alt,
      videoUrl,
      loop,
      dontCrop,
      verticalCropPosition,
      horizontalCropPosition,
    };
  }

  return {
    image,
    alt,
    svg,
    videoUrl,
    animation,
    loop: !!loop,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
  };
}

function caclulateVertical(position?: VerticalPosition) {
  switch (position) {
    case "Bottom":
      return "bottom";
    case "Top":
      return "top";
    default:
      return "center";
  }
}

function calculateHorizontal(position?: HorizontalPosition) {
  switch (position) {
    case "Left":
      return "left";
    case "Right":
      return "right";
    default:
      return "center";
  }
}

export function calculateCropDetails(
  visual: VisualAsset,
  dontCrop?: boolean
): Pick<CSSProperties, "objectFit" | "objectPosition"> {
  const { verticalCropPosition, horizontalCropPosition } = visual;

  if (dontCrop || visual.dontCrop) {
    return { objectFit: "contain" };
  }

  return {
    objectFit: "cover",
    objectPosition: `${calculateHorizontal(
      horizontalCropPosition
    )} ${caclulateVertical(verticalCropPosition)}`,
  };
}
