'use client';

import { useState } from 'react';

import Image, { type ImageProps } from 'next/image';

/**
 * `next/image` that fades in once decoded (`data-reveal` rules in
 * `styles/theme/motion.css`). The reveal is an animation, not a transition,
 * so callers keep their own `opacity`/`transition-*` utilities untouched.
 * Only for lazy images: hiding an LCP image until hydration would delay it.
 */
export function FadeImage({ onLoad, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      data-reveal=""
      data-loaded={isLoaded ? '' : undefined}
      onLoad={event => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
    />
  );
}
