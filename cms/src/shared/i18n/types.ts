import type en from '@/dictionaries/en.json';

/** Dictionary shape. English is the reference; `uk.json` must match it (messages.ts). */
export type Dictionary = typeof en;

type Sections = Dictionary['sections'];

/** Top-level groups under `sections`: the README blocks plus `system`. */
export type SectionGroupId = keyof Sections & string;

/** `group.section` keys of one group, e.g. `catalog.products`. */
export type SectionKeyOf<Group extends SectionGroupId> =
  `${Group}.${keyof Sections[Group] & string}`;

/** Every CMS section: its title/description live at `sections.<key>`. */
export type SectionKey = {
  [Group in SectionGroupId]: SectionKeyOf<Group>;
}[SectionGroupId];
