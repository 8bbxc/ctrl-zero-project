# Client (React + Vite + Tailwind)

Setup

1. Install dependencies:
   ```bash
   cd client
   npm install
   npm install react-i18next i18next react-fast-marquee react-icons
   ```
2. Start dev server
   ```bash
   npm run dev
   ```

Configuration

- The client expects the API to be reachable at `http://localhost:4000` by default; set `VITE_API_URL` to your API base in production (e.g., `https://<your-render-service>`).
- Put home images in `public/images/home/` and the nav logo in `public/images/navLogo/logo.png`.

Localization

- i18n is setup in `src/i18n.js`. Currently the Navbar, Hero (title + subtitle), and Footer support English and Arabic. Switch language using the flag in the navbar.

Admin Uploader

- The Admin Dashboard includes an **Image Uploader** on the project edit/create form. Upload multiple files and they will be POSTed to `/api/upload` (Cloudinary in production). Uploaded files are returned as `{ url, public_id }` and appended to the project's `gallery` state. On save, the gallery is persisted as an array of image URLs.
