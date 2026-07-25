import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';

const SHADCN_VERSION = '4.12.0';

const components = process.argv.slice(2);

if (!components.length) {
  console.error('Usage: pnpm shadcn:add <component> [component...]');
  process.exit(1);
}

const rl = createInterface({
  input: stdin,
  output: stdout,
});

const frontendDir = path.resolve('frontend');
const uiDir = path.join(frontendDir, 'src/shared/ui');

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function getUniqueDir(baseDir) {
  let i = 1;
  let candidate = `${baseDir}-${i}`;

  while (await exists(candidate)) {
    i++;
    candidate = `${baseDir}-${i}`;
  }

  return candidate;
}

for (const component of components) {
  console.log(`\n▶ Adding ${component}...`);

  const source = path.join(uiDir, `${component}.tsx`);

  let componentDir = path.join(uiDir, component);

  if (await exists(componentDir)) {
    const answer = (
      await rl.question(
        `Directory "${component}" already exists.\n` +
          `[r] Replace existing\n` +
          `[n] Create new (${component}-1, ${component}-2...)\n` +
          `Choose (r/n): `,
      )
    )
      .trim()
      .toLowerCase();

    if (answer === 'r') {
      await fs.rm(componentDir, { recursive: true, force: true });
    } else {
      componentDir = await getUniqueDir(componentDir);
    }
  }

  execSync(`pnpm dlx shadcn@${SHADCN_VERSION} add ${component}`, {
    stdio: 'inherit',
    cwd: frontendDir,
  });

  const target = path.join(componentDir, `${component}.tsx`);
  const index = path.join(componentDir, 'index.ts');

  await fs.mkdir(componentDir, { recursive: true });

  await fs.rename(source, target);

  await fs.writeFile(index, `export * from "./${component}";\n`);

  console.log(`✔ ${path.basename(componentDir)} organized`);
}

await rl.close();

console.log('\n🎉 All components added');
