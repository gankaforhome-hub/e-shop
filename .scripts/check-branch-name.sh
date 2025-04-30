#!/bin/sh

# Заборонені гілки
protected_branches="^(main|dev|stable|staging)$"

# Дозволені scope та type
valid_scopes="(cms|backend|frontend|devops)"
valid_types="(feat|fix|hotfix|chore|docs|refactor|test|bugfix|ci|style|revert)"

# Отримуємо поточну гілку
branch_name=$(git symbolic-ref --short HEAD)

# Перевірка на заборонені гілки
if echo "$branch_name" | grep -Eq "$protected_branches"; then
  echo "❌ Гілка '$branch_name' є зарезервованою. Використання заборонене."
  exit 1
fi

# Перевірка формату <scope>/<type>:short-description-kebab-case
if ! echo "$branch_name" | grep -Eq "^$valid_scopes/$valid_types:[a-z0-9]+(-[a-z0-9]+)*$"; then
  echo "❌ Невірний формат гілки: '$branch_name'"
  echo "✅ Очікуваний формат: <scope>/<type>:short-description-kebab-case"
  echo "   - <scope>: cms, backend, frontend, devops"
  echo "   - <type>:  feat, fix, hotfix, chore, docs, refactor, test, bugfix, ci, style, revert"
  echo "   - приклад: frontend/feat:add-login-form"
  exit 1
fi

# Якщо все добре
echo "✅ Назва гілки '$branch_name' коректна."
exit 0