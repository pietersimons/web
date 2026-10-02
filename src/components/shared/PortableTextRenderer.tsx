import { PortableText, type PortableTextComponents } from "next-sanity";
import Link from "next/link";
import { SanityImage } from "./SanityImage";

const customComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-8 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-8 mb-3 border-b border-border/40 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground mt-6 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading text-lg font-semibold text-foreground mt-4 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-foreground/90 text-base leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-5 italic my-6 text-foreground/80 bg-muted/30 py-3 rounded-r-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/90">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 mb-4 text-foreground/90">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const isExternal =
        value?.href?.startsWith("http") || value?.href?.startsWith("//");
      const target = value?.blank || isExternal ? "_blank" : undefined;
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;

      return (
        <Link
          href={value?.href || "#"}
          target={target}
          rel={rel}
          className="font-medium text-accent underline decoration-accent/40 hover:decoration-accent transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
          <SanityImage
            image={value}
            alt={value.alt || "Article illustration"}
            width={1000}
            height={600}
            className="w-full h-auto object-cover"
          />
          {value.caption && (
            <figcaption className="p-3 text-center text-xs text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: any;
  className?: string;
}

export function PortableTextRenderer({
  value,
  className,
}: PortableTextRendererProps) {
  if (!value) return null;

  return (
    <div className={className}>
      <PortableText value={value} components={customComponents} />
    </div>
  );
}
