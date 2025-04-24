# Git: Branch flow documentation

## 🧭 Git Branch Flow — Core Branches Interaction

```text
<name:cms|backend|frontend>/feat* 
  │
  ▼
develop 
  │
  ▼
release/x.x.x 
  │
  ▼
staging 
  │
  ▼
production 
  │
  ├─▶ main (stable history + tags)
  └─▶ stable (LTS, archive)
```

## 🔀 Git Branch Flow — Core Branches

### 👨‍💻 `develop` — Active Development
- The main branch where daily work happens.
- All `feature/*`, `fix/*`, `chore/*`, etc. are merged here.
- Contains the latest (possibly unstable) changes.

---

### 📦 `release/v1.x.x` — Release Preparation
- Temporary branch for stabilizing a release version.
- Created from `develop`.
- Once complete, it's merged into `staging`, `production`, and `main`.

---

### 🧪 `staging` — Integration Testing (Pre-Production)
- Branch for QA/testing before production deployment.
- Used for automated and manual testing.
- Mimics the production environment as closely as possible.

---

### 🚀 `production` — Live Production Code
- What your end users actually see.
- Only fully tested changes from `staging` are merged here.
- Production deployment is triggered from this branch.

---

### 🧷 `main` — Stable, Tagged History
- Stores the linear history of all stable releases.
- All releases are tagged here (`v1.0.0`, `v1.1.0`, etc.).
- Acts as the single source of truth for your codebase.

---

### 🛡️ `stable` — Long-Term Stable Version (LTS / Archive)
- Archive of well-tested, verified production releases.
- May be used as a Long-Term Support (LTS) branch.
- Updated every time `main` receives a new release.


## 🔁 How It Works — Step-by-Step
###  ✅ 1. Development
  - Branches off from develop:
    - feature/frontend/add-carousel
    - fix/backend/parse-error
  - After completion — merge → develop

### 📦 2. Release Preparation
   - When develop is ready for release — create a release branch:

```bash
    git checkout develop
    git checkout -b release/v1.2.0
```
   - Here, you:
    - Perform small fixes
    - Update the version
    - Changelog
    - Freeze feature development

### 🧪 3. Testing in Staging
   - Merge the release branch into staging:
```bash
    git checkout staging
    git merge release/v1.2.0
```
   - In this stage, you perform:
    - QA testing
    - UI validation
    - CI pipeline verification

### 🚀 4. Production Deployment
   - Once staging is verified, it is merged into production:
```bash
    git checkout production
    git merge staging
```
   - This triggers the production deployment.

### 🏷️ 5. Update main + Tag
   - After production release, merge the changes into main:
```bash
git checkout main
git merge production
git tag v1.2.0
```

### 🛡️ 6. Update stable
   - For long-term support (LTS) or archived versions:
```bash
git checkout stable
git merge main
```
### 🔥 Hotfixes (hotfix/*)
   - Hotfixes are made from production:
```bash
git checkout production
git checkout -b hotfix/fix-login-bug
```
   - After fixing:
    - Merge → production
    - Merge → main
    - Merge → develop

### 📌 Important Notes:

* release/* → Temporary branch, deleted after the release.

* main → The point of truth for tags and changelogs.

* stable → Long-term support (LTS), optional but useful.

