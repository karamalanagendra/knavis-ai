# ProtocolIQ Website — knavis-ai.com

AI-Native Clinical Trial Platform marketing website built with Next.js 14, Tailwind CSS, and Framer Motion.

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Landing page — Hero, Features, ROI Calculator, Testimonials, FAQ |
| `/platform` | `src/app/platform/page.tsx` | Platform deep-dive — AI Agents, Data Sources, Workflow |
| `/about` | `src/app/about/page.tsx` | Founder story, 18+ years, 5 patents, career timeline |
| `/blog` | `src/app/blog/page.tsx` | Article listing with search + category filter |
| `/demo` | `src/app/demo/page.tsx` | Demo booking form with validation + success state |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + CSS variables
- **Animation**: Framer Motion
- **Fonts**: Outfit + DM Serif Display + JetBrains Mono (Google Fonts)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add custom domain in Vercel dashboard:
# knavis-ai.com → protocoliq-website project
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens + animations
│   ├── layout.tsx           # Root layout + SEO metadata
│   ├── page.tsx             # / Landing page
│   ├── platform/page.tsx    # /platform
│   ├── about/page.tsx       # /about
│   ├── blog/page.tsx        # /blog
│   └── demo/page.tsx        # /demo
├── components/
│   └── layout/
│       ├── Navbar.tsx       # Shared sticky navbar
│       └── Footer.tsx       # Shared footer
└── lib/
    ├── constants.ts         # Site config, nav links, data
    └── utils.ts             # Helper functions
```

## Design System

Colors defined as CSS variables:
- `--accent: #00D4FF` (cyan)
- `--violet: #7C3AED`
- `--green: #00FF94`
- `--orange: #FF8A3D`
- `--red: #FF5E7A`

Fonts:
- **Headings**: Outfit (800 weight)
- **Display**: DM Serif Display (italic)
- **Code/Mono**: JetBrains Mono

---

Built by Nagendra Kumar K · Principal Architect, Clinical GenAI · knavis-ai.com
