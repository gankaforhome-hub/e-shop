import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const SHADCN_VERSION = '4.12.0';

const components = process.argv.slice(2);

if (!components.length) {
  console.error('Usage: pnpm shadcn:add <component> [component...]');
  process.exit(1);
}

const frontendDir = path.resolve('frontend');
const uiDir = path.join(frontendDir, 'src/shared/ui');

for (const component of components) {
  console.log(`\n▶ Adding ${component}...`);

  execSync(`pnpm dlx shadcn@${SHADCN_VERSION} add ${component}`, {
    stdio: 'inherit',
    cwd: frontendDir,
  });

  const source = path.join(uiDir, `${component}.tsx`);
  const componentDir = path.join(uiDir, component);
  const target = path.join(componentDir, `${component}.tsx`);
  const index = path.join(componentDir, 'index.ts');

  await fs.mkdir(componentDir, { recursive: true });

  await fs.rename(source, target);

  await fs.writeFile(index, `export * from "./${component}";\n`);

  console.log(`✔ ${component} organized`);
}

console.log('\n🎉 All components added');
