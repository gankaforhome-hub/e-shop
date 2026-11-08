import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { E_Locale, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { mediaKey } from '../src/modules/media/lib/media.util';
import { processImage } from '../src/modules/media/lib/process-image';
import { createSupabaseMediaStorage } from '../src/modules/media/storage/supabase-media.storage';
import { SEED_COLLECTIONS, SEED_SEASONS } from './seed-data/collections';
import { SEED_USERS } from './seed-data/users';

/**
 * Development data: seasons, collections with their covers, and test accounts.
 * Idempotent: rows are matched by slug / checksum / email, nothing missing from
 * seed-data is deleted. Seasons and collections are reset to the seed values;
 * media keeps its alt and focal point, existing accounts are left as they are.
 */

const FRONTEND_PUBLIC_DIR = join(__dirname, '../../frontend/public');
const WEBP = 'image/webp';
const BCRYPT_ROUNDS = 12;
const LOCALES = Object.values(E_Locale);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set in backend/.env`);
  return value;
}

// Uploads every variant of each cover and returns Media ids by file path
async function seedMedia() {
  const storage = createSupabaseMediaStorage({
    url: requireEnv('SUPABASE_URL'),
    secretKey: requireEnv('SUPABASE_SECRET_KEY'),
    bucket: requireEnv('MEDIA_BUCKET'),
  });
  const files = [
    ...new Set(
      SEED_COLLECTIONS.flatMap(c =>
        c.bannerImage ? [c.coverImage, c.bannerImage] : [c.coverImage],
      ),
    ),
  ];
  const mediaIdByFile = new Map<string, string>();
  let uploadedFiles = 0;

  for (const file of files) {
    const image = await processImage(
      await readFile(join(FRONTEND_PUBLIC_DIR, file)),
    );
    const variants = await Promise.all(
      image.variants.map(async ({ width, height, buffer }) => {
        const key = mediaKey(image.checksum, width);
        await storage.put(key, buffer, WEBP);
        return { width, height, size: buffer.length, key };
      }),
    );
    uploadedFiles += variants.length;

    //COMMENT derived from the file and the processing settings, so refreshed on every run
    const processed = {
      width: image.width,
      height: image.height,
      sizeBytes: variants[variants.length - 1].size,
      variants,
      blurDataUrl: image.blurDataUrl,
    };
    const { id } = await prisma.media.upsert({
      where: { checksum: image.checksum },
      create: {
        checksum: image.checksum,
        originalName: basename(file),
        ...processed,
      },
      update: processed,
    });
    mediaIdByFile.set(file, id);
  }

  return { mediaIdByFile, uploadedFiles };
}

async function seedSeasons() {
  for (const { slug, sortOrder, labels } of SEED_SEASONS) {
    await prisma.season.upsert({
      where: { slug },
      create: { slug, sortOrder },
      update: { sortOrder },
    });
    for (const languageCode of LOCALES) {
      const label = labels[languageCode];
      await prisma.seasonTranslation.upsert({
        where: { seasonSlug_languageCode: { seasonSlug: slug, languageCode } },
        create: { seasonSlug: slug, languageCode, label },
        update: { label },
      });
    }
  }
}

async function seedCollections(mediaIdByFile: Map<string, string>) {
  for (const [index, collection] of SEED_COLLECTIONS.entries()) {
    const data = {
      sortOrder: index + 1,
      isActive: true,
      seasonSlug: collection.seasonSlug,
      coverImageId: mediaIdByFile.get(collection.coverImage),
      bannerImageId: collection.bannerImage
        ? mediaIdByFile.get(collection.bannerImage)
        : null,
      inBanner: collection.inBanner ?? false,
      bannerSortOrder: collection.bannerSortOrder ?? 0,
    };
    const { id: collectionId } = await prisma.collection.upsert({
      where: { slug: collection.slug },
      create: { slug: collection.slug, ...data },
      update: data,
    });
    for (const languageCode of LOCALES) {
      const translation = {
        bannerSubtitle: null,
        ...collection.translations[languageCode],
      };
      await prisma.collectionTranslation.upsert({
        where: { collectionId_languageCode: { collectionId, languageCode } },
        create: { collectionId, languageCode, ...translation },
        update: translation,
      });
    }
  }
}

// Returns the number of accounts processed, or the reason they were skipped
async function seedUsers(): Promise<number | string> {
  if (process.env.NODE_ENV === 'production') {
    return 'skipped: NODE_ENV is production';
  }
  const password = process.env.SEED_USER_PASSWORD;
  if (!password) return 'skipped: set SEED_USER_PASSWORD in backend/.env';
  if (password.length < 8 || Buffer.byteLength(password) > 72) {
    throw new Error('SEED_USER_PASSWORD must be 8 characters to 72 bytes');
  }

  const passwordHash = await hash(password, BCRYPT_ROUNDS);
  const now = new Date();

  for (const { email, name, role } of SEED_USERS) {
    //COMMENT update: {} keeps a changed password, name or role on later runs
    const { id: userId } = await prisma.user.upsert({
      where: { email },
      create: { email, name, password: passwordHash, emailVerifiedAt: now },
      update: {},
    });
    if (role) {
      await prisma.staffAccount.upsert({
        where: { userId },
        create: { userId, role, approvedAt: now },
        update: {},
      });
    }
  }

  return SEED_USERS.length;
}

async function main() {
  const { mediaIdByFile, uploadedFiles } = await seedMedia();
  await seedSeasons();
  await seedCollections(mediaIdByFile);
  const users = await seedUsers();

  const [seasons, collections, translations, media] = await Promise.all([
    prisma.season.count(),
    prisma.collection.count(),
    prisma.collectionTranslation.count(),
    prisma.media.count(),
  ]);
  console.log(`
Seed finished.
  Seasons                  ${seasons}
  Collections              ${collections}
  Collection translations  ${translations}
  Media                    ${media}
  Files uploaded           ${uploadedFiles}
  Dev accounts             ${users}
`);
}

main()
  .catch(e => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
