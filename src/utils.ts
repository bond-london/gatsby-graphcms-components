import { IGatsbyImageData } from "gatsby-plugin-image";
import { CSSProperties, useMemo } from "react";
import { InternalVisualComponentProps } from ".";

export interface GenericAsset {
  alt?: string;
  id: string;
  localFile?: File;
  alternateText?: string;
  dontCrop?: boolean;
  verticalCropPosition?: VerticalPosition;
  horizontalCropPosition?: HorizontalPosition;
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
  readonly childImageSharp?: ImageSharp;
  readonly publicURL?: string;
  readonly svg?: SvgInformation;
  readonly lottie?: Omit<LottieInformation, "animationUrl">;
  readonly name: string;
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
    return { image: previewImage, alt, videoUrl, loop };
  }

  return {
    image,
    alt,
    svg,
    animation,
    loop: !!loop,
    dontCrop,
    verticalCropPosition,
    horizontalCropPosition,
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

  const alt = defaultAlt || file.name;
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

export function useStyles(props: Partial<InternalVisualComponentProps>) {
  const { noStyle, objectFit, objectPosition, fitParent, style, visualStyle } =
    props;
  return useMemo(() => {
    if (noStyle) {
      return undefined;
    }
    const shared: CSSProperties = {
      objectFit,
      objectPosition,
      width: "100%",
      height: "100%",
    };

    const conditional: CSSProperties = fitParent
      ? {
          position: "absolute",
          left: "0",
          top: "0",
        }
      : { display: "block", position: "relative" };
    return { ...shared, ...conditional, ...style, ...visualStyle };
  }, [noStyle, objectFit, objectPosition, fitParent, style, visualStyle]);
}
