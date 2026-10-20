'use client';

import { useRef, useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

const RESET_DELAY_MS = 2000;

export interface CopyButtonProps {
  value: string;
  /** Accessible name before copying, e.g. "Copy +38 063…". */
  label: string;
  /** Announced and shown as the accessible name after copying. */
  copiedLabel: string;
  /** Layout only. */
  className?: string;
}

/** Copies `value` to the clipboard; icon swaps to a check for 2s. */
export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), RESET_DELAY_MS);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={cn('size-11 rounded-lg', className)}
    >
      <Icon name={copied ? 'check' : 'copy'} className="size-4" aria-hidden />
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
    </Button>
  );
}
