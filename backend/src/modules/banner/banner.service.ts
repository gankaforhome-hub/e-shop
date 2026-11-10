import { MediaService } from '@modules/media/media.service';
import { Injectable } from '@nestjs/common';
import { E_BannerLinkType, E_Locale } from '@prisma/client';
import { BannerRepository, PublicBanner } from './repository/banner.repository';
import { BannerResponse } from './responses/banner.response';

const FALLBACK_LOCALE = E_Locale.uk;

@Injectable()
export class BannerService {
  constructor(
    private readonly repository: BannerRepository,
    private readonly mediaService: MediaService,
  ) {}

  /** The home hero now: switched on, inside its dates, in hero order. */
  async findLive(lang: E_Locale): Promise<BannerResponse[]> {
    const banners = await this.repository.findLive(
      [...new Set([lang, FALLBACK_LOCALE])],
      new Date(),
    );
    return banners
      .map(banner => this.toResponse(banner, lang))
      .filter(banner => banner !== null);
  }

  /**
   * Texts: the slide's own in `lang`, then its own uk. A slide with no title of its own
   * shows its collection's title (in `lang`, then uk). No title at all: not shown.
   */
  private toResponse(
    banner: PublicBanner,
    lang: E_Locale,
  ): BannerResponse | null {
    const own = (field: 'title' | 'subtitle' | 'ctaLabel') =>
      banner.translations.find(t => t.languageCode === lang)?.[field] ||
      banner.translations.find(t => t.languageCode === FALLBACK_LOCALE)?.[
        field
      ] ||
      null;
    const collectionTitle = (code: E_Locale) =>
      banner.collection?.translations.find(t => t.languageCode === code)?.title;

    const title =
      own('title') ??
      collectionTitle(lang) ??
      collectionTitle(FALLBACK_LOCALE) ??
      null;
    if (!title) return null;

    const isCollection = banner.linkType === E_BannerLinkType.COLLECTION;
    return {
      id: banner.id,
      title,
      subtitle: own('subtitle'),
      ctaLabel: own('ctaLabel'),
      link: {
        type: isCollection ? 'collection' : 'url',
        collectionSlug: isCollection ? (banner.collection?.slug ?? null) : null,
        url: isCollection ? null : banner.url,
      },
      image: this.mediaService.toPublicResponse(banner.image, title),
    };
  }
}
