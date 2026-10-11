# 📦 gankaforhome: Project Structure

📦gankaforhome ┣ 📂backend ┃ ┗ .gitkeep  
┣ 📂cms ┃ ┗ .gitkeep ┣ 📂frontend ┃ ┗ .gitkeep┃ ┗ 📜README.md

<small> **.gitkeep** - _a placeholder file to keep the folder structure intact
in version control. Keeps the folder in version control even if it's
empty_</small>

### General Workflow & Architecture Strategy

To accelerate development and optimize token/resource usage during the MVP
phase, we follow a two-phased backend execution strategy:

- **Phase 1 (Fast MVP & Rapid Content Entry)**:
  - The custom **CMS (Next.js)** directly manages database operations (CRUD for
    products, categories, content) via Next.js Server Actions / API routes and
    ORM.
  - Allows immediate catalog setup and content population without waiting for
    full NestJS service deployment.

- **Phase 2 (Scalable Core Migration)**:
  - Complex business logic, payments, CRM integrations, and heavy order
    processing transition to the dedicated **NestJS Backend**.
  - The Next.js CMS seamlessly switches to consuming the NestJS API endpoints.

---

## 📂 **Frontend**:

- **Customer Experience**: Facing e-commerce web application where users can
  browse products, manage shopping carts, build wishlists, and complete
  checkout.
- **User Account Area**: Personal user cabinet for tracking order history,
  delivery statuses, saved addresses, and profile settings.
- **Product Presentation**: Fully responsive UI displaying product details,
  dynamic galleries, stock availability, pricing, and localized content.
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
  v4, Shadcn, Radix UI, Framer Motion, next-intl, Zod, and React Hook Form,
  Supabase, next-auth.

---

## 📂 **CMS**:

Custom-built CMS (built with Next.js App Router for maximum speed) with
Role-Based Access Control (RBAC) divided into 3 core functional domains:

1. **Content Management Block (`content/`)**:
   - Manages site content, blog posts, banners, marketing sections, and static
     pages (e.g., "About Us"), content editors and forms, content preview and
     publishing.
2. **Catalog & E-commerce Logic Block (`catalog/`)**:
   - Handles product creation/editing, inventory management, collections,
     categories, and attributes, product listing, filtering, and sorting (Direct
     DB access in Phase 1).
3. **Admin Dashboard & Operations Block (`operations/`)**:
   - Site usage analytics, dashboard and metrics order processing, general
     system management, and operation metrics, order management, data tables,
     filters, and reporting.

### 🔐 Access Control & Roles (RBAC):

- **Role-Based Access**: Granular permissions for admins and specialized user
  roles.
- **Admin Role**: Full system access across all blocks and role management
  settings.
- **Specialized Roles**: Restricted access granted only to assigned modules
  (e.g., Content Editor, Catalog Manager, Order Manager).

---

## 📂 **Backend**:

- **Core API & Server Logic**: Central API orchestration layer processing
  requests between Frontend and CMS.
- **E-Commerce Operations**: Business rules for checkout workflows, payment
  processing, CRM sync, and transactional emails.
- **CRM & Payment Integrations**: Integration with external CRM and payment
  gateways (e.g., LiqPay, Monobank, Stripe).
- **Real-Time & Synchronization**: Coordinates order state updates between
  customer apps and administrative workflows.
- **Database Architecture**: Interacts with the primary SQL database (via Prisma
  or Drizzle ORM).
- **Tech Stack**: Node.js, NestJS, TypeScript, SQL/ORM. next-intl, Docker,
  CI/CD, Zod.
