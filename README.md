# StitchX Global Technology - Frontend Application

Modern, high-performance enterprise web application and management console built with React 19, Vite, and Tailwind CSS.

## 🚀 Technology Stack
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + `@tailwindcss/typography`
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Architecture:** Responsive mobile-first layout with off-canvas navigation and dark mode palette

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone <your-frontend-repo-url>
cd frontend

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration for local development:
```env
# Leave VITE_API_URL empty when developing locally with Vite's built-in proxy
VITE_API_URL=
VITE_BACKEND_URL=http://localhost:5000
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. All API requests made to `/api/*` and `/uploads/*` are automatically proxied to the StitchX Backend API on port `5000`.

---

## 📦 Building for Production

```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 🚢 Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Framework Preset to **Vite**.
4. Configure Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://api.stitchxglobal.in`)
5. Click **Deploy**. (A `vercel.json` rewrite file is already included).

### Deploying to Netlify
1. Import repository into [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The included `public/_redirects` file automatically handles Single Page Application (SPA) routing.

---

## 📄 License
Private & Confidential — StitchX Global Technology. All Rights Reserved.
