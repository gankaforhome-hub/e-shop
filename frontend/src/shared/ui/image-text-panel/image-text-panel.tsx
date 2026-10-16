import { type ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { type ImagePosition, type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

const textCellVariants = cva('fgap-4/6 flex min-w-0 flex-col justify-center', {
  variants: {
    /**
     * `plain` floats on the page background (default) · `bordered` hairline
     * card · `warm` cream fill for highlighted story blocks.
     */
    surface: {
      plain: 'fpy-2/6',
      bordered: 'border-border-subtle fpx-6/20 fpy-8/24 border',
      warm: 'bg-surface-warm fpx-6/20 fpy-8/24',
    },
  },
  defaultVariants: { surface: 'plain' },
});

const mediaFrameVariants = cva('relative w-full min-w-0 overflow-hidden', {
  variants: {
    /** Square suits plates; portrait / landscape for scenes and interiors. */
    aspect: {
      square: 'min-h-85 aspect-square',
      portrait: 'aspect-4/5',
      landscape: 'aspect-16/10',
    },
    frame: {
      sharp: '',
      rounded: 'rounded-lg',
    },
  },
  defaultVariants: { aspect: 'square', frame: 'sharp' },
});

export type ImageTextPanelContent = {
  image: Media;
  imagePosition: ImagePosition;
  paragraphs?: string;
  children?: ReactNode;
};

export interface ImageTextPanelProps
  extends
    ImageTextPanelContent,
    VariantProps<typeof textCellVariants>,
    VariantProps<typeof mediaFrameVariants> {
  /** Small uppercase tag above the title / text. */
  eyebrow?: string;
  /** Understated index, rendered `01 / 03`. */
  counter?: { current: number; total: number };
  /** Optional block title (one level below the section heading). */
  title?: string;
  titleLevel?: 'h2' | 'h3' | 'h4';
  /** Thin vertical brand-coloured line beside the text. */
  accent?: boolean;
  /** Slow scale-up of the image while the panel is hovered. */
  zoom?: boolean;
  /** Layout only (outer margin). */
  className?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  textClassName?: string;
  /** Set only when the panel image is the above-the-fold LCP candidate. */
  priority?: boolean;
}

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Editorial image + text pair: equal halves from `lg` (40 → 64px gutter,
 * `imagePosition` picks the side), stacked below. Text is always
 * left-aligned at `max-w-copy` with relaxed leading; `paragraphs` split on
 * blank lines, or pass `children` for custom content (e.g. a form).
 */
export function ImageTextPanel({
  image,
  paragraphs = '',
  imagePosition = 'left',
  surface,
  aspect,
  frame,
  eyebrow,
  counter,
  title,
  titleLevel = 'h3',
  accent = false,
  zoom = true,
  children,
  className,
  imageClassName,
  imageContainerClassName,
  textClassName,
  priority = false,
}: ImageTextPanelProps) {
  const hasMeta = Boolean(counter || eyebrow);

  return (
    <div
      className={cn(
        'group/panel mt-4 grid grid-cols-1 gap-4 md:mt-8 lg:mt-10 lg:grid-cols-2 lg:gap-10 xl:mt-16 xl:gap-16',
        className,
      )}
    >
      <div
        className={cn(
          mediaFrameVariants({ aspect, frame }),
          imagePosition === 'right' && 'lg:order-2',
          imageContainerClassName,
        )}
      >
        <AppMedia
          src={image.src || ''}
          alt={image.alt || ''}
          fill
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn(
            'object-cover object-center',
            zoom &&
              'duration-(--dur-slower) ease-subtle transition-transform group-hover/panel:scale-105 motion-reduce:transition-none motion-reduce:group-hover/panel:scale-100',
            imageClassName,
          )}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      <div
        className={cn(
          textCellVariants({ surface }),
          imagePosition === 'right' && 'lg:order-1',
          textClassName,
        )}
      >
        <div
          className={cn(
            'fgap-4/6 flex flex-col',
            accent && 'border-action-primary fpl-5/8 border-l',
          )}
        >
          {hasMeta && (
            <div className="flex items-center gap-3">
              {counter && (
                <Text
                  as="span"
                  size="eyebrow"
                  font="secondary"
                  variant="accent"
                  className="tabular-nums"
                >
                  {pad(counter.current)} / {pad(counter.total)}
                </Text>
              )}
              {eyebrow && (
                <Text as="span" size="eyebrow" font="secondary" variant="muted">
                  {eyebrow}
                </Text>
              )}
            </div>
          )}
          {title && (
            <Heading headingLevel={titleLevel} variant="subsection">
              {title}
            </Heading>
          )}
          {children ??
            paragraphs
              .split('\n\n')
              .map(paragraph => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <Text key={index} size="lead" className="max-w-copy">
                  {paragraph}
                </Text>
              ))}
        </div>
      </div>
    </div>
  );
}
