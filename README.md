# Kalashree Music Classes — Public Website

Student-facing website for Kalashree Music Classes. Students can view batch information and syllabus, log in to their dashboard, check payment status, and pay monthly fees via UPI.

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Framework | React 18 + Vite 5             |
| Routing   | React Router DOM 6            |
| HTTP      | Axios                         |
| Styling   | Vanilla CSS (custom design system) |
| Fonts     | Google Fonts (Poppins + Playfair Display) |
| Hosting   | Vercel                        |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and set your backend API URL
cp .env.example .env

# 3. Start the dev server (http://localhost:5173)
npm run dev

# 4. Build for production
npm run build
```

---

## Environment Variables

| Variable       | Description                    | Example                         |
| -------------- | ------------------------------ | ------------------------------- |
| `VITE_API_URL` | Backend API base URL           | `http://localhost:5000/api`     |

For production, set this to your deployed backend URL (e.g., `https://kalashree-api.onrender.com/api`).

---

## Project Structure

```
frontend-public/
├── index.html                 # Entry HTML with favicon + Google Fonts
├── vite.config.js             # Vite config (port 5173)
├── vercel.json                # SPA rewrite rules for Vercel
├── public/
│   ├── logo.jpg               # Kalashree logo (favicon + navbar)
│   ├── instruments-bg.png     # Fixed background watermark image
│   └── syllabus/              # PDF syllabi for each batch level
│       ├── syllabus_prarambhik.pdf
│       ├── syllabus_praveshika.pdf
│       ├── syllabus_madhyama.pdf
│       └── syllabus_visharad.pdf
├── src/
│   ├── main.jsx               # React entry point (BrowserRouter + AuthProvider)
│   ├── App.jsx                # Route definitions + app shell layout
│   ├── api/
│   │   └── axios.js           # Axios instance with base URL + auth interceptor
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state management (JWT token + user data)
│   ├── components/
│   │   ├── Navbar.jsx         # Top navigation bar with mobile hamburger menu
│   │   ├── Footer.jsx         # Site footer
│   │   └── ProtectedRoute.jsx # Auth guard for private routes
│   ├── pages/
│   │   ├── Home.jsx           # Landing page (hero, batches, class info)
│   │   ├── Login.jsx          # Student login (phone + password)
│   │   ├── ForgotPassword.jsx # 3-step password reset flow (OTP via email)
│   │   ├── UserDashboard.jsx  # Student dashboard (payment status, history)
│   │   └── Payment.jsx        # Fee payment page (month selection, UPI QR, txn ID)
│   └── styles/
│       └── global.css         # Complete design system + all component styles
└── package.json
```

---

## Pages

| Route              | Page             | Auth     | Description                                        |
| ------------------ | ---------------- | -------- | -------------------------------------------------- |
| `/`                | Home             | Public   | Landing page with hero, 7 batch cards with syllabus links, class info |
| `/login`           | Login            | Public   | Student login via phone number + password          |
| `/forgot-password` | Forgot Password  | Public   | 3-step flow: enter email → verify OTP → set new password |
| `/dashboard`       | Dashboard        | Student  | Payment status, paid-till date, due info, recent payment history |
| `/pay`             | Payment          | Student  | Select months → generate UPI QR → enter transaction ID → confirm |

---

## Design System

The app uses a warm, earthy color palette inspired by Indian classical music:

| Token          | Color     | Usage                    |
| -------------- | --------- | ------------------------ |
| `--wood-dark`  | `#4a2e1e` | Headings, accents        |
| `--brown`      | `#6f4e37` | Primary buttons, links   |
| `--tan`        | `#c9a37e` | Highlights, gradients    |
| `--cream`      | `#fbf8f5` | Page background          |
| `--cream-2`    | `#f5ede3` | Card backgrounds, hover  |

### Background Watermark

A fixed-position instruments illustration (`instruments-bg.png`) is rendered behind all content at low opacity (12%), creating a subtle cultural watermark that stays in place while content scrolls over it.

---

## Key Features

- **Responsive Design** — Mobile-first with hamburger navigation
- **UPI Payment Flow** — QR code generated dynamically with amount embedded
- **Contiguous Month Validation** — Students must pay from their due month forward (no skipping)
- **Password Reset** — Email-based OTP verification (3-step stepper UI)
- **Syllabus Downloads** — PDF links for each of the 7 curriculum levels

---

## Deployment (Vercel)

1. Connect the `frontend-public` folder as a Vercel project
2. Set the **Framework Preset** to `Vite`
3. Add environment variable: `VITE_API_URL` = your deployed backend API URL
4. The `vercel.json` handles SPA routing (all paths → `index.html`)
