import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

const Configuration: UserConfig = {
    parserPreset: 
      {
    parserOpts: {
      headerPattern: /^[a-z0-9\-]+\/(chore|feat|style|refactor|revert|fix|hotfix|perf|test|ci|docs):[a-z0-9\-]+$/,
      headerCorrespondence: ['scope','type','subject'],
    },
  },
  rules: {
    // Обов'язковий формат: <scope>/<type>/<short-description>
    // 'header-pattern': [
    //   2,
    //   'always',
    //   /^[a-z0-9\-]+\/chore|feat|style|refactor|revert|fix|hotfix|perf|test|ci|docs:[a-z0-9\-]+$/
    // ],
    'type-enum': [RuleConfigSeverity.Error, 'always', ['chore','feat', 'style', 'refactor', 'revert', 'fix', 'hotfix','perf','test','ci','docs']],
    'scope-empty': [RuleConfigSeverity.Error, 'always'],
    'subject-empty': [RuleConfigSeverity.Error, 'always'],
    'type-empty': [RuleConfigSeverity.Error, 'always'],
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100],

  }
}
export default Configuration;
