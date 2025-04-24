
// import type { Options } from 'cz-customizable';
// const config: Options =
// const inquirer = require('inquirer');
module.exports = {  
  // prompter: inquirer.prompt,
  // Type commit
  types: [
    { value: 'chore', name: 'chore:    maintenance tasks' },
    { value: 'feat', name: 'feat:    new features' },
    { value: 'style', name: 'style:     code style change' },
    { value: 'refactor', name: 'refactor: code refactoring' },
    { value: 'revert', name: 'revert: revert to previous commit' },
    { value: 'fix', name: 'fix:      bug fix' },
    { value: 'hotfix', name: 'hotfix:  fast fix' },
    { value: 'perf', name: 'perf:     performance improvements' },
    { value: 'test', name: 'test:     testing' },
    { value: 'ci', name: 'ci:     CI configuration change' },
    { value: 'docs', name: 'docs:     documentation updates' },
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
