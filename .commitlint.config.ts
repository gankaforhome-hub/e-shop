import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^[a-z0-9\-]+\/chore|feat|style|refactor|revert|fix|hotfix|perf|test|ci|docs:[a-z0-9\-]+$/
,     headerCorrespondence: ['scope', 'type', 'subject'],
    },
  },
  rules: {
    // Обов'язковий формат: <scope>/<type>/<short-description>
    // 'header-pattern': [
    //   2,
    //   'always',
    //   /^[a-z0-9\-]+\/chore|feat|style|refactor|revert|fix|hotfix|perf|test|ci|docs:[a-z0-9\-]+$/
    // ],
    'type-enum': [2, 'always', ['chore','feat', 'style', 'refactor', 'revert', 'fix', 'hotfix','perf','test','ci','docs']],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],

  }
};


export default Configuration;