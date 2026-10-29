'use client';

import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import {
  Popover,
  PopoverAnchor,
  PopoverOverlay,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { Text } from '@/shared/ui/text';

import { RecentSearches } from './recent-searches';
import { SearchForm } from './search-form';
import { SearchResults } from './search-results';
import { moveSearchFocus } from '../lib/move-search-focus';
import { useProductSearch } from '../model/use-product-search';

interface SearchPopoverProps {
  /** Classes of the trigger button (e.g. visibility per breakpoint). */
  className?: string;
}

/**
 * Header search (desktop): an icon button opening a panel centred under the
 * whole header, with type-ahead results and, while the field is empty, the
 * recent searches. Closing clears the query and the results.
 */
export function SearchPopover({ className }: SearchPopoverProps) {
  const t = useTranslations('common.search');
  const [open, setOpen] = useState(false);
  const { query, state, changeQuery, reset, saveRecentSearch, resolveTotal } =
    useProductSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) {
      reset();
    }
  };

  const close = () => changeOpen(false);

  const navigate = () => {
    saveRecentSearch();
    close();
  };

  const selectRecent = (value: string) => {
    changeQuery(value);
    inputRef.current?.focus();
  };

  return (
    // Modal: the page behind is dimmed, inert and scroll-locked; a click on
    // the backdrop closes the search
    <Popover open={open} onOpenChange={changeOpen} modal>
      <PopoverOverlay open={open} />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('open')}
          className={cn('group', className)}
        >
          <Icon
            name="search"
            size={24}
            className="group-hover:text-icon-hover duration-(--dur-normal) transition-colors"
          />
        </Button>
      </PopoverTrigger>
      {/* The header's bottom edge, full width (the live header height also
          tracks its collapsed state). Kept after the trigger: Radix anchors
          to the last anchor ref attached */}
      <PopoverAnchor
        aria-hidden="true"
        className="top-(--h-header-desktop-current) pointer-events-none fixed inset-x-0 h-0"
      />

      <PopoverContent
        side="bottom"
        sideOffset={16}
        collisionPadding={16}
        aria-label={t('title')}
        // Focus goes to the input, without scrolling to the panel being placed
        onOpenAutoFocus={event => {
          event.preventDefault();
          inputRef.current?.focus({ preventScroll: true });
        }}
        onKeyDown={moveSearchFocus}
        className={cn(
          'group/search border-border flex flex-col overflow-hidden rounded-none border',
          'shadow-floating w-[min(36rem,calc(100vw-2rem))]',
          'max-h-[min(40rem,var(--radix-popover-content-available-height))]',
        )}
      >
        <div className="border-border flex shrink-0 items-center justify-between border-b py-2 pl-5 pr-3">
          <Text as="span" size="small" className="font-medium">
            {t('title')}
          </Text>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('close')}
            onClick={close}
          >
            <Icon
              name="close"
              className="text-icon size-4"
              aria-hidden="true"
            />
          </Button>
        </div>

        <div className="shrink-0 px-5 pb-1 pt-4">
          <SearchForm
            query={query}
            isLoading={state.status === 'loading'}
            onQueryChange={changeQuery}
            resolveTotal={resolveTotal}
            onNavigate={navigate}
            inputRef={inputRef}
          />
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!query.trim() && (
            <RecentSearches
              variant="list"
              onSelect={selectRecent}
              className="border-border border-b pb-2 pt-3"
            />
          )}
          <SearchResults query={query} state={state} onNavigate={navigate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
