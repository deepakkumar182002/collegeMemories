# 🎓 AlumniScraps / College Memories Platform

> **A Nostalgic Digital Time-Capsule & College Scrapbook Platform**
> Crafted with tactile paper aesthetics, Polaroid photography, washi tape, handwritten captions, WebGL paper turbulence shaders, and a continuous timeline storytelling experience.

---

## 🌟 Visual Identity & Design System

The platform preserves and elevates the nostalgic collegiate scrapbook experience:
- **Surface & Paper Metaphor**: Warm cream/off-white background (`#fbf9f5`) with WebGL paper grain turbulence shader.
- **Collegiate Colorway**: Deep Maroon (`#570000` / `#800000`) and Navy tones (`#565e77` / `#131b30`) with Warm Mustard (`#ffdf96`).
- **Typography Pairing**: **Montserrat** (Headings), **Inter** (Body text), and **Caveat** (Handwritten notes & captions).
- **Tactile Components**:
  - 📷 **Polaroid Frames** with organic tilts, drop shadows, and zoom-straighten hover effects.
  - 🩹 **Washi Tape Strips** with subtle translucent blurring.
  - 📌 **Sticky Notes** with curled corner shadows and custom colors.
  - 🪪 **College ID Cards** with lanyard clips, student barcodes, and funny superlative titles.
  - 🎬 **Film Strip Reels** with perforation sprockets for live video memories.
  - 🧵 **Stitched Vertical Timeline** connecting 13 storytelling chapters.

---

## 🏗️ Architecture & Monorepo Structure

```
stitch_the_memory_box/
├── client/                     # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── api/                # Axios client & typed API methods
│   │   ├── components/
│   │   │   ├── common/         # WebGLShader, Navbar, Footer, Tape, StickyNote, Lightbox, VideoModal
│   │   │   ├── layout/         # PublicLayout & modern AdminLayout
│   │   │   └── memories/       # Reusable MemoryCard component (6 visual styles)
│   │   ├── context/            # AuthContext (JWT) & LightboxContext
│   │   ├── hooks/              # useLenis, useChapters, useMemories, useFriends, etc.
│   │   ├── lib/                # GSAP registration, TanStack queryClient, utils
│   │   ├── pages/
│   │   │   ├── public/         # HomePage, JourneyPage, GalleryPage, VideosPage, FriendsPage, Detail
│   │   │   └── admin/          # Dashboard, Memories, Chapters, Friends, Messages, Settings
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # React Router v7 & Lazy routes
│   │   └── main.tsx
│   └── package.json
│
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── config/                 # MongoDB connection & Cloudinary setup
│   ├── controllers/            # Auth, Chapters, Memories, Friends, Messages, Settings
│   ├── middleware/             # JWT Protect, Multer MemoryStorage, ErrorHandler, RateLimit
│   ├── models/                 # Admin, Chapter, Memory, Friend, Message, Settings
│   ├── routes/                 # Express API route definitions
│   ├── scripts/                # seed.js (Auto-seeds admin & 13 chapters on fresh start)
│   ├── services/               # Cloudinary & local storage media service
│   ├── validations/            # Zod request validation schemas
│   ├── app.js                  # Express application configuration
│   ├── server.js               # Server entrypoint
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Development

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=super_secret_college_memories_jwt_key_2026_scrapbook
JWT_EXPIRES_IN=7d

# Optional Cloudinary credentials (local storage used automatically if left empty)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

> **Zero-Friction Local Run**: If `MONGODB_URI` is left blank, the server automatically starts an in-memory MongoDB instance with pre-seeded rich college data!

Run the backend:
```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend dev server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Admin Credentials (Seeded)

- **Login URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@alumniscraps.com`
- **Password**: `Admin@12345`

---

## 🚀 Key Features

### 📖 Public Digital Time Machine
1. **Cinematic Hero**: 3D open scrapbook center spread, floating polaroids, and animated emojis.
2. **13 Progressive Chapters**:
   - Chapter 01: Where It All Began
   - Chapter 02: Strangers to Inseparables
   - Chapter 03: Classroom Chaos & Backbenches
   - Chapter 04: Canteen Stories & Infinite Chai
   - Chapter 05: Funny Moments & Bloopers
   - Chapter 06: Trips & Road Adventures
   - Chapter 07: Festivals, Stage Lights & Chaos
   - Chapter 08: Random Polaroids of Everyday Joy
   - Chapter 09: The Motion Picture Vault (Videos)
   - Chapter 10: The Crew Who Made It Home (Friends)
   - Chapter 11: Final Year & Major Projects
   - Chapter 12: Farewell & The Last Bell
   - Chapter 13: The Memory Box Stays Open Forever
3. **Smooth Scroll Experience**: Lenis kinetic smooth scrolling paired with GSAP ScrollTrigger timeline filling.
4. **Interactive Memory Wall**: Public guestbook with customizable colorful sticky notes.
5. **Fullscreen Lightbox**: Keyboard navigation (← / → / Esc), captions, and EXIF/metadata styling.

### 🛡️ Modern Protected Admin Dashboard
- **Memories Manager**: Drag-and-drop file upload for Images, Videos, and GIFs with card visual style selector (Polaroid, Sticky note, Film frame, Notebook, Ticket, Postcard) and rotation slider.
- **Chapter Manager**: Add, edit, reorder, and publish story chapters with cover image uploads.
- **Batchmate ID Manager**: Create college student ID cards with nicknames, superlatives, and social links.
- **Memory Wall Moderation**: Publish, hide, edit, or delete visitor sticky notes.
- **Site Settings**: Customize hero copy, upload hero spread artwork, adjust theme colors, and SEO metadata.

---

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Admin authentication |
| `GET` | `/api/auth/me` | Private | Verify admin session |
| `POST` | `/api/auth/logout` | Private | Clear authentication cookie |
| `GET` | `/api/chapters` | Public | List published chapters |
| `POST` | `/api/chapters` | Private | Create new story chapter |
| `PUT` | `/api/chapters/:id` | Private | Update chapter details & cover image |
| `DELETE` | `/api/chapters/:id` | Private | Delete chapter and associated memories |
| `GET` | `/api/memories` | Public | Query memories with filters |
| `POST` | `/api/memories` | Private | Upload and archive new memory |
| `PUT` | `/api/memories/:id` | Private | Update memory details or media |
| `DELETE` | `/api/memories/:id` | Private | Delete memory and media asset |
| `GET` | `/api/friends` | Public | Get batchmate student ID cards |
| `POST` | `/api/friends` | Private | Create batchmate ID card |
| `GET` | `/api/messages` | Public | Get Memory Wall sticky notes |
| `POST` | `/api/messages` | Public | Pin sticky note to Memory Wall |
| `GET` | `/api/settings` | Public | Get site configuration & statistics |
| `PUT` | `/api/settings` | Private | Update site branding, colors & SEO |

---

## 📜 License

Created for private college memory archiving and alumni storytelling.
