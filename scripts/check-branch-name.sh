#!/bin/sh

protected_branches="^(main|dev|stable|staging)$"

# Allowed scopes and types
valid_scopes="(cms|backend|frontend|devops)"
valid_types="(feat|fix|hotfix|chore|docs|refactor|test|bugfix|ci|style|revert)"

# Get the current branch name
branch_name=$(git symbolic-ref --short HEAD)

# Check for forbidden branches
if echo "$branch_name" | grep -Eq "$protected_branches"; then
  echo "❌ The branch '$branch_name' is reserved. Usage is forbidden."
  echo "✅ Please create a branch following the correct format: <scope>/<type>:short-description-kebab-case"
  exit 1
fi

# Check the branch name format <scope>/<type>:short-description-kebab-case
if ! echo "$branch_name" | grep -Eq "^$valid_scopes/$valid_types:[a-z0-9]+(-[a-z0-9]+)*$"; then
  echo "❌ Invalid branch name: '$branch_name'"
  echo "✅ Expected format: <scope>/<type>:short-description-kebab-case"
  echo "   - <scope>: cms, backend, frontend, devops"
  echo "   - <type>:  feat, fix, hotfix, chore, docs, refactor, test, bugfix, ci, style, revert"
  echo "   - example: frontend/feat:add-login-form"
  exit 1
fi

# If everything is okay
echo "✅ The branch name '$branch_name' is correct."
exit 0
