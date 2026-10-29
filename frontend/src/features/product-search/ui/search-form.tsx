'use client';

import { type FormEvent, type RefObject, useCallback, useRef } from 'react';

import { useTranslations } from 'next-intl';

import { routes } from '@/shared/config/routes';
import { useRouter } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { getInputClasses } from '@/shared/ui/input';

import { isCollectionsQuery } from '../lib/collections-query';

interface SearchFormProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  /** Total matches of the query (`useProductSearch().resolveTotal`). */
  resolveTotal: () => Promise<number | undefined>;
  /** Called before a navigation (closes the popover or the menu). */
  onNavigate: () => void;
  /** For callers that focus the input themselves (popover open). */
  inputRef?: RefObject<HTMLInputElement | null>;
  /**
   * Focus the input on mount (a dedicated search view) without scrolling:
   * native `autoFocus` scrolls clipped ancestors and breaks a slide-in.
   */
  autoFocus?: boolean;
  className?: string;
}

/**
 * Search box: magnifier (spinner while searching), input, clear button.
 * Enter opens the search results page (`/products?search=`), the whole
 * catalog when nothing matches, or the collections page for "collections".
 */
export function SearchForm({
  query,
  isLoading,
  onQueryChange,
  resolveTotal,
  onNavigate,
  inputRef,
  autoFocus = false,
  className,
}: SearchFormProps) {
  const t = useTranslations('common.search');
  const router = useRouter();
  const ownRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? ownRef;

  const attachInput = useCallback(
    (node: HTMLInputElement | null) => {
      ref.current = node;
      if (node && autoFocus) {
        node.focus({ preventScroll: true });
      }
    },
    [ref, autoFocus],
  );

  const showAllResults = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = query.trim();
    if (!search) {
      return;
    }
    if (isCollectionsQuery(search)) {
      onNavigate();
      router.push(routes.collections);
      return;
    }
    const total = await resolveTotal();
    onNavigate();
    // Nothing found: the whole catalog, unfiltered, instead of an empty page.
    // A failed lookup still tries the results page
    router.push(total === 0 ? routes.products() : routes.products({ search }));
  };

  const clear = () => {
    onQueryChange('');
    ref.current?.focus();
  };

  return (
    <form
      role="search"
      onSubmit={event => void showAllResults(event)}
      className={cn('relative flex items-center', className)}
    >
      <Icon
        name={isLoading ? 'spinner' : 'search'}
        aria-hidden="true"
        className={cn(
          'text-icon pointer-events-none absolute left-3 size-5',
          isLoading && 'animate-spin',
        )}
      />
      <input
        ref={attachInput}
        type="search"
        value={query}
        onChange={event => onQueryChange(event.target.value)}
        aria-label={t('label')}
        placeholder={t('placeholder')}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        data-search-nav
        // 16px text on every viewport: smaller text makes iOS zoom on focus
        className={getInputClasses(
          false,
          'py-2.5 pl-10 pr-11 text-base [&::-webkit-search-cancel-button]:appearance-none',
        )}
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clear}
          aria-label={t('clear')}
          className="text-muted-foreground hover:text-foreground-emphasis absolute right-1.5"
        >
          <Icon name="close" className="size-4" aria-hidden="true" />
        </Button>
      )}
    </form>
  );
}
