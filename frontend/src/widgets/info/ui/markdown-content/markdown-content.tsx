import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  type AppRoutes,
  type ExternalHref,
  isInfoSlug,
  routes,
} from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Text, textVariants } from '@/shared/ui/text';

const EXTERNAL_HREF = /^(https?:\/\/|mailto:|tel:)/;

const INFO_HREF = /^\/info\/([\w-]+)$/;

const isExternalHref = (href: string | undefined): href is ExternalHref =>
  href !== undefined && EXTERNAL_HREF.test(href);

/** Typed link target: external URL or a known info page; `undefined` → plain text. */
function resolveHref(
  href: string | undefined,
): AppRoutes | ExternalHref | undefined {
  if (isExternalHref(href)) {
    return href;
  }
  const slug = href?.match(INFO_HREF)?.[1];
  return isInfoSlug(slug) ? routes.info(slug) : undefined;
}

/**
 * Maps Markdown nodes to design-system primitives. `node` is dropped so the
 * mdast object is never spread onto DOM elements. The page owns the only `h1`,
 * so a stray `#` in the body is demoted to `h2`.
 */
const components: Components = {
  h1: ({ node: _node, ...props }) => (
    <Heading headingLevel="h2" variant="subsection" {...props} />
  ),
  h2: ({ node: _node, ...props }) => (
    <Heading headingLevel="h2" variant="subsection" {...props} />
  ),
  h3: ({ node: _node, ...props }) => (
    <Heading headingLevel="h3" variant="minor" {...props} />
  ),
  h4: ({ node: _node, ...props }) => (
    <Heading headingLevel="h4" variant="minor" {...props} />
  ),
  p: ({ node: _node, ...props }) => (
    <Text variant="inherit" size="none" font="secondary" {...props} />
  ),
  strong: ({ node: _node, ...props }) => (
    <strong className="font-semibold" {...props} />
  ),
  ul: ({ node: _node, ...props }) => (
    <ul
      className={cn(
        'flex flex-col gap-2 pl-1 sm:pl-2',
        "[&>li]:relative [&>li]:pl-4 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['–']",
      )}
      {...props}
    />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol
      className="marker:text-muted-foreground flex list-decimal flex-col gap-2 pl-6"
      {...props}
    />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      className="border-border text-muted-foreground border-l-2 pl-4"
      {...props}
    />
  ),
  hr: () => <Separator size="xs" />,
  a: ({ node: _node, href, children }) => {
    const target = resolveHref(href);
    return target ? (
      <AppLink
        href={target}
        className="hover:text-muted-foreground inline underline underline-offset-4"
      >
        {children}
      </AppLink>
    ) : (
      <>{children}</>
    );
  },
  table: ({ node: _node, ...props }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  ),
  th: ({ node: _node, ...props }) => (
    <th className="border-border border-b py-2 pr-4 font-semibold" {...props} />
  ),
  td: ({ node: _node, ...props }) => (
    <td className="border-border border-b py-2 pr-4 align-top" {...props} />
  ),
};

interface MarkdownContentProps {
  children: string;
  className?: string;
}

/**
 * Server-only Markdown renderer (no `'use client'`): parsed on the server and
 * streamed as static HTML, so react-markdown never reaches the client bundle.
 * Raw HTML in the source is not rendered.
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        // Lists/tables inherit the document scale; `p` uses size="none" to inherit it too
        textVariants({ size: 'document', font: 'secondary' }),
        'fgap-3/4 flex flex-col',
        // Extra air above section headings; tighter coupling to the text they introduce
        '[&>h2:not(:first-child)]:mt-5 md:[&>h2:not(:first-child)]:mt-7',
        '[&>h3:not(:first-child)]:mt-2 md:[&>h3:not(:first-child)]:mt-3',
        className,
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  );
}
