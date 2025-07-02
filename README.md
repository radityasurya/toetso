# toet Monorepo

This is a monorepo for the toet application, containing:
- `frontend/` — Vite + React client app
- `backend/`  — NestJS REST API with JWT authentication and Swagger docs

Both projects are managed using [pnpm workspaces](https://pnpm.io/workspaces).

---

## Getting Started

1. **Install dependencies for ALL packages:**
    ```sh
    pnpm install
    ```

2. **Run both frontend and backend (dev mode):**
    ```sh
    pnpm dev
    ```
    This will concurrently run the backend (NestJS, port 3000) and frontend (Vite, port 5173 by default).

---

## Managing Packages

- **Add a package to the frontend:**
    ```sh
    pnpm --filter frontend add <package-name>
    ```

- **Add a package to the backend:**
    ```sh
    pnpm --filter backend add <package-name>
    ```

- **Add a package to both (shared, e.g. a utility):**
    ```sh
    pnpm add -w <package-name>
    ```

- **Install all (after clone or when modifying pnpm-workspace.yaml):**
    ```sh
    pnpm install
    ```

---

## Scripts

From the root:

- `pnpm dev` — start frontend and backend simultaneously (dev mode)
- `pnpm dev:frontend` — run only frontend (live-reload mode)
- `pnpm dev:backend` — run only backend API (watch mode)
- `pnpm build:frontend` — build frontend
- `pnpm build:backend` — build backend

---

## Accessing your apps

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend (API):** [http://localhost:3000](http://localhost:3000)
- **Backend Swagger docs:** [http://localhost:3000/api](http://localhost:3000/api)

---

## How it works

- **Each sub-project has its own package.json** for dependencies and scripts.
- **All dependencies are installed and linked from the root** via pnpm workspace features.
- **Lockfiles and workspace config remain in the root** for consistency and reproducible installs.

---

## Tips & Best Practices

- Only keep node_modules and lockfiles at the root (ignore them in `frontend/`/`backend/`—see `.gitignore`).
- Use separate package.json files in each app for clean dependency management.
- Always use pnpm commands from the root unless you need to run a script from a sub-package specifically.
- See each app’s own README for API or UI details.

---

For more, see the [pnpm workspaces documentation](https://pnpm.io/workspaces)!
