import { BlockMath, InlineMath } from "react-katex";
import { codeToHtml } from "shiki";
import { Heading } from "./components/markdown/heading";
import { buttonVariants } from "./components/ui/button";
import NavigationLink from "./components/ui/navigation-link";
import { cn } from "./lib/utils";
import type {
  AnchorProps,
  CodeProps,
  EmProps,
  HeadingProps,
  ListItemProps,
  ListProps,
  ParagraphProps,
  PreProps,
  StrongProps,
} from "./types/markdown";

const CONSTANTS = {
  CODE_REGEX: /language-/,
};

const components = {
  h1: (props: HeadingProps) => (
    <Heading Tag="h1" className="text-3xl" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <Heading Tag="h2" className="text-2xl" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <Heading Tag="h3" className="text-xl" {...props} />
  ),
  h4: (props: HeadingProps) => (
    <Heading Tag="h4" className="text-lg" {...props} />
  ),
  h5: (props: HeadingProps) => (
    <Heading Tag="h5" className="text-base" {...props} />
  ),
  h6: (props: HeadingProps) => (
    <Heading Tag="h6" className="text-sm" {...props} />
  ),
  p: (props: ParagraphProps) => (
    <p
      className="my-4 text-base text-foreground/80 leading-relaxed first:mt-0 last:mb-0"
      {...props}
    />
  ),
  ol: (props: ListProps) => (
    <ol className="list-decimal space-y-2 pl-5" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="list-disc space-y-1 pl-5" {...props} />
  ),
  li: (props: ListItemProps) => (
    <li className="pl-1 text-foreground/80 leading-relaxed" {...props} />
  ),
  em: (props: EmProps) => <em className="font-medium" {...props} />,
  strong: (props: StrongProps) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className = cn(buttonVariants({ variant: "link" }), "px-0");
    if (href?.startsWith("/")) {
      return (
        <NavigationLink href={href} className={className} {...props}>
          {children}
        </NavigationLink>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: (props: PreProps) => (
    <pre className="whitespace-pre md:whitespace-pre-wrap" {...props} />
  ),
  code: async (props: CodeProps) => {
    if (typeof props.children === "string") {
      const lang = props.className?.replace(CONSTANTS.CODE_REGEX, "") || "jsx";

      const code = await codeToHtml(props.children, {
        lang,
        theme: "aurora-x",
        transformers: [
          {
            // Since we're using dangerouslySetInnerHTML, the code and pre
            // tags should be removed.
            pre: (hast) => {
              if (hast.children.length !== 1) {
                throw new Error("<pre>: Expected a single <code> child");
              }
              if (hast.children[0].type !== "element") {
                throw new Error("<pre>: Expected a <code> child");
              }
              return hast.children[0];
            },
            postprocess(html) {
              return html.replace(/^<code>|<\/code>$/g, "");
            },
          },
        ],
      });

      return (
        <code
          className="inline text-xs sm:text-sm"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: We're using shiki to render the code
          dangerouslySetInnerHTML={{ __html: code }}
        />
      );
    }

    return <code className="inline" {...props} />;
  },
  InlineMath,
  BlockMath,
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
