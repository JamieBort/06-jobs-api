## CtD Group Mentor Session Notes for Lesson 10 / Jobs API Part 2.

Wednesday, 04 February 2026

### Table of contents

1. [Info about the new files](#info-about-the-new-files)

2. [Mapping frontend modules to backend routes](#mapping-frontend-modules-to-backend-routes)

### Info about the new files

- `app.use(express.static("public"));` (in `./app.js`) tells Express to serve files from the `public/` directly to the browser.

- The files in the `public/` directory are static frontend assets
  (HTML, JavaScript, CSS if present) that are **served directly to the browser** by Express.
  They run entirely in the client (browser), not on the Node.js server

- `./public/index.html` is a typical HTML file that displays the frontend.
  It defines the structure (divs, forms, buttons) that the user interacts with.

- `./public/index.js` acts as a central coordination module.

  It is the application’s frontend “controller” or shared state module
  - It:
    - Tracks shared state (activeDiv, inputEnabled, token, message)
    - Exposes setter/helper functions (setDiv, enableInput, setToken)
    - Initializes all the feature modules on DOMContentLoaded
    - Owns global UI state (active div, auth token, input lock, message display)
    - Exposes functions so other modules can _request_ state changes
    - Bootstraps the entire frontend by initializing each feature module

  - The shared variables in index.js influence which divs are shown or hidden.
  - In particular, setDiv() controls visibility, and other modules call it to switch UI panels.

- All other JS files in `public/` are feature-specific UI controllers
  Each one:
  - Owns exactly one UI “panel” (login, register, jobs, add/edit)
  - Registers event listeners for that panel
  - Calls backend APIs via `fetch`
  - Uses shared helpers from `index.js` to switch views and manage state

- `./public/loginRegister.js` contains logic for the initial authentication choice UI.

  It displays the logon/register panel and routes the user to either the login or registration flow based on button selection.

- `./public/login.js` contains login logic for the end user.

  On successful login, it stores the token and transitions to the jobs view.

- `./public/addEdit.js` contains logic for adding, editing, and deleting jobs.

  It communicates with /api/v1/jobs using POST, PATCH, and DELETE.

- `./public/jobs.js` contains logic for fetching and displaying jobs.

  It builds table rows dynamically and handles edit/delete/logoff actions.

### Mapping frontend modules to backend routes

(Back to the [Table of contents](#table-of-contents))

#### Authentication

| Frontend file      | Backend route                | Purpose                 |
| ------------------ | ---------------------------- | ----------------------- |
| `login.js`         | `POST /api/v1/auth/login`    | Log in existing user    |
| `register.js`      | `POST /api/v1/auth/register` | Create user + get token |
| `loginRegister.js` | _(none)_                     | Navigation only         |

Auth frontend modules **only care about tokens**, not user data persistence.

---

#### Jobs

| Frontend file | Backend route      | HTTP   | Purpose        |
| ------------- | ------------------ | ------ | -------------- |
| `jobs.js`     | `/api/v1/jobs`     | GET    | Fetch all jobs |
| `addEdit.js`  | `/api/v1/jobs`     | POST   | Create job     |
| `addEdit.js`  | `/api/v1/jobs/:id` | PATCH  | Update job     |
| `addEdit.js`  | `/api/v1/jobs/:id` | DELETE | Delete job     |
| `addEdit.js`  | `/api/v1/jobs/:id` | GET    | Fetch one job  |

This is almost a **1:1 mirror** of REST operations → UI actions.

Each button click corresponds directly to:

> _“Call this route with this verb, then update the UI.”_

---

#### The glue layer

| Frontend file | Backend  |
| ------------- | -------- |
| `index.js`    | _(none)_ |

`index.js` does **zero fetching**.
It manages:

- UI state
- auth state
- lifecycle bootstrapping

That separation is very intentional.
