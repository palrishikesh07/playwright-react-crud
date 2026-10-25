# ShopEase — React + Vite + TypeScript practice app

A small frontend application to use as the system under test while learning Playwright with TypeScript.

## Features

- Register and login forms with field validation
- Protected `/products` page and sign out
- Product CRUD: create, list, search, edit and delete
- Product form validation, stock status and inventory summary
- Responsive layout
- Browser `localStorage` persistence
- Accessible labels, dialog semantics, alerts and status messages that are useful for reliable automation

## Important demo limitation

This is a **frontend-only practice app**. Users, passwords, sessions and products are stored in the browser's `localStorage`. Passwords are not hashed, there is no backend, and this must not be used for real accounts or sensitive data. Clearing site data resets the demo. For a real application, use a backend and secure password hashing/session management.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Build check

```bash
npm run build
npm run preview
```

## Suggested manual test flow

1. Visit `/products` while signed out; you should be redirected to `/login`.
2. Try login with invalid credentials and check the error.
3. Register a new account at `/register` using a valid email and a password of at least 8 characters.
4. Confirm the products page opens.
5. Add a product, search for it, edit it, and delete it.
6. Sign out and confirm `/products` redirects to login.
7. Refresh the browser and verify products and the session persist in this browser.

## Stable selectors for Playwright

Prefer accessible role/name locators. These are examples, not a requirement to use only these selectors:

```ts
page.getByRole('heading', { name: 'Create your account' })
page.getByLabel('Full name')
page.getByLabel('Email address')
page.getByLabel('Password')
page.getByRole('button', { name: 'Create account' })

page.getByRole('heading', { name: 'Products', exact: true })
page.getByRole('button', { name: 'Add product' })
page.getByLabel('Product name')
page.getByLabel('Product category')
page.getByRole('button', { name: 'Create product' })
page.getByRole('searchbox') // search input currently has aria-label="Search products"
page.getByRole('button', { name: 'Edit Wireless Headphones' })
page.getByRole('button', { name: 'Delete Wireless Headphones' })
```

Note: the category control's accessible name is `Category`, not `Product category`, so use `page.getByLabel('Category')`. Search can be located with `page.getByRole('textbox', { name: 'Search products' })`.

## Next learning step

Once the app is running, add Playwright with TypeScript and build tests in this order: smoke test, registration, login failures/success, protected routes, product create/read/update/delete, search, validation, dialogs, persistence, fixtures, Page Object Model, API mocking, screenshots/traces, and CI.
# playwright-react-crud
