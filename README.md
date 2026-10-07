# Testimonial & Social Proof Collector

A production-ready SaaS application built with the **MERN Stack** (MongoDB, Express, React, Node.js) for collecting, moderating, analyzing, and embedding customer testimonials and social proof.

---

## 🎨 Coss UI Architecture & Integration

The frontend UI strictly implements the **Coss UI** design system pattern:
- **Headless Accessible Primitives**: Powered by `@base-ui/react` (Base UI headless unstyled components), providing ARIA roles, focus management, keyboard navigation, and structural state.
- **Copy-and-Own Components**: Located in `client/src/components/ui/` (`Button.jsx`, `Input.jsx`, `Switch.jsx`, `Dialog.jsx`, `Tabs.jsx`, `Avatar.jsx`, `ToastContext.jsx`, `Select.jsx`, `Badge.jsx`, `Card.jsx`, `Rating.jsx`, `MasonryGrid.jsx`, `Carousel.jsx`).
- **Tailwind CSS Styling**: Styled with utility classes for consistent design tokens, dark/light theme options, responsive breakpoints, and smooth active/hover states.

---

## 🔒 Security & Authentication Token Architecture

The application enforces a dual `httpOnly` cookie authentication architecture:

- **Access Token**: Short-lived JWT (15-minute lifetime) stored in an `httpOnly` cookie named `accessToken`.
- **Refresh Token**: Long-lived JWT (7-day lifetime) stored in an `httpOnly` cookie named `refreshToken`.
- **Refresh-Token Rotation**: Upon refreshing, the server revokes the previous refresh token in MongoDB, issues a new token pair, and sets both as new `httpOnly` cookies.
- **Zero Frontend Token Exposure**: Neither access nor refresh tokens are returned in JSON response bodies or stored in `localStorage`, `sessionStorage`, or React state.
- **Automatic Browser Delivery**: The React frontend uses Axios configured with `withCredentials: true`. The browser automatically attaches `httpOnly` cookies with requests. If an access token expires (401), an Axios interceptor calls `/api/auth/refresh`, the browser sends `refreshToken` cookie, the backend rotates cookies, and the original request retries seamlessly.

---

## 🌟 Key Features

1. **Branded Collection Spaces**:
   - Create custom Spaces with unique slugs (e.g., `/collect/acme-corp`).
   - Customize collection prompt, require avatar/star rating, and add custom questions.
   - Upload business brand logos handled via Multer backend storage.

2. **Public Unauthenticated Submissions**:
   - Customers can submit reviews without logging in.
   - Includes star rating (1-5), review text, avatar photo upload, and custom question answers.
   - Submissions default to `pending` status for owner moderation.

3. **Owner Moderation Dashboard (`/dashboard/reviews`)**:
   - Real-time status filtering (All, Pending, Approved, Archived).
   - Keyword search across customer name, email, role, and review text.
   - Star rating filtering (5, 4, 3, 2, 1 stars) and pagination.
   - One-click actions: Approve, Reject, Archive, Mark Featured, Mark Liked.

4. **Public Wall of Love (`/wall/:spaceSlug`)**:
   - Public SaaS page rendering **only approved** testimonials.
   - Responsive masonry grid layout (Desktop, Tablet, Mobile).

5. **MongoDB Rating Analytics (`/dashboard/analytics`)**:
   - Dynamically calculated metrics: Average star rating, total reviews, approval rate %, and 5/4/3/2/1 star distribution bars.

6. **Customizable Embed Generator (`/dashboard/embed` & `/embed/:spaceSlug`)**:
   - Live configurator supporting Light/Dark themes and Grid/Carousel/Badge layouts.
   - Generated copy-paste HTML iframe snippet with one-click copy toast notification.

---

## 🛠 Tech Stack & Rationale

- **Frontend**: React.js, React Router v6, Tailwind CSS, Coss UI primitives (`@base-ui/react`), Axios (with automatic 401 token refresh interceptor), Lucide Icons.
- **Backend**: Node.js, Express.js, JWT, Cookie-Parser, Cors, Multer.
- **Database**: MongoDB & Mongoose.

---

## 🔑 Demo Credentials

A seed script (`npm run seed`) is provided to instantly populate MongoDB with a demo owner, space, and diverse testimonials:

- **Owner Email**: `owner@example.com`
- **Owner Password**: `Password123!`
- **Demo Space Slug**: `acme-corp`
- **Public Collection Form**: `http://localhost:5173/collect/acme-corp`
- **Public Wall of Love**: `http://localhost:5173/wall/acme-corp`

---

## 🚀 Environment Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB server running on `127.0.0.1:27017`

### 1. Environment Configuration
Copy `.env.example` to create your local `.env` configuration file:
```bash
cp server/.env.example server/.env
```
Ensure all required environment variables (`PORT`, `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `NODE_ENV`) are set.

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Populates demo data
npm run dev      # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```
