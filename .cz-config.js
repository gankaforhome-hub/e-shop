
// import type { Options } from 'cz-customizable';
// const config: Options =
// const inquirer = require('inquirer');
module.exports = {  
  // prompter: inquirer.prompt,
  // Type commit
  types: [
    { value: "chore",    name: "🔨 chore:    Miscellaneous chores", emoji: "🔨" },
    { value: 'feat', name: '✨feat:    new features', emoji: "✨" },
    { value: "style",    name: "🎨 style:    Code style changes (formatting, etc)", emoji: "🎨" },
    { value: "refactor", name: "♻️ refactor: Code refactoring", emoji: "♻️" },
    { value: "revert",   name: "⏪ revert:   Revert to a commit", emoji: "⏪" },
    { value: "fix",      name: "🐛 fix:      A bug fix", emoji: "🐛" },
    { value: 'hotfix', name: '🩹 hotfix:  fast fix',emoji: "🩹" },
    { value: "perf",     name: "⚡ perf:     Performance improvements", emoji: "⚡" },
    { value: "test",     name: "✅ test:     Adding or fixing tests", emoji: "✅" },
    { value: "ci",       name: "🔧 ci:       CI configuration", emoji: "🔧" },
    { value: "docs",     name: "📝 docs:     Documentation only changes", emoji: "📝" },


  ],
    // Select scope changes (scope)
  scopes: [
    { name: 'gankaforhome' },
    { name: 'cms' },
    { name: 'backend' },
    { name: 'frontend' },
    { name: 'devops' }
  ],
  // Text for prompts
  messages: {
    type: "Select type commit:",
    scope: "Select scope (part of project):",
    subject: "Enter short description (In English):",
    body: "Enter change description (not necessary):",
    breaking: "Have you breaking changes?",
    footer: "Tie з issue (not necessary):",
    confirmCommit: 'Are you sure you want to proceed with the commit above?'

  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix','hotfix','perf'],
  appendBranchNameToCommitMessage: true,
  pageSize: 15 ,
  defaultScope: 'frontend',
  defaultType: 'feat',
  format: ({ scope, type, subject }) => {
    const finalType = type || 'feat';
    const finalScope = scope || 'frontend';
    return `${finalScope}/${finalType}:${subject}`;
  },
};

// export default config;
