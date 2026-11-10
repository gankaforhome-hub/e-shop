'use client';

import { useLocale, useTranslations } from 'next-intl';

import { toSeason } from '@/entities/collection';
import {
  CollectionForm,
  type CollectionFormProps,
  type SeasonCreatorProps,
} from '@/features/collection-editor';
import { SeasonDialog } from '@/features/season-editor';
import { MediaField } from '@/features/upload-media';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

/** "Create a season" next to the season select: the new season becomes the chosen one. */
function SeasonCreator({ nextSortOrder, onCreated }: SeasonCreatorProps) {
  const t = useTranslations('collections.form');
  const locale = useLocale();

  return (
    <SeasonDialog
      nextSortOrder={nextSortOrder}
      onSaved={season => onCreated(toSeason(season, locale))}
      trigger={
        <Button variant="link" size="inline" className="w-fit">
          <Icon name="add" />
          {t('createSeason')}
        </Button>
      }
    />
  );
}

/**
 * The collection form with the image upload and season creation plugged in
 * (features don't import each other).
 */
export function CollectionEditor(
  props: Omit<CollectionFormProps, 'ImageField' | 'SeasonCreator'>,
) {
  return (
    <CollectionForm
      {...props}
      ImageField={MediaField}
      SeasonCreator={SeasonCreator}
    />
  );
}
