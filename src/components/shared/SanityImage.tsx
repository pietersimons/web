import Image, { type ImageProps } from "next/image";
import { urlFor } from "@/sanity/image";

interface SanityImageProps extends Omit<ImageProps, "src"> {
  image: any;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "2/3";
  priority?: boolean;
}

export function SanityImage({
  image,
  alt,
  width = 1200,
  height = 800,
  className,
  priority = false,
  ...props
}: SanityImageProps) {
  if (!image || !image.asset) {
    return null;
  }

  const imageUrl = urlFor(image)
    .width(width)
    .height(height)
    .auto("format")
    .fit("crop")
    .url();

  return (
    <Image
      src={imageUrl}
      alt={alt || image.alt || "Travelwild image"}
      width={width}
      height={height}
      priority={priority}
      className={className}
      {...props}
    />
  );
}
