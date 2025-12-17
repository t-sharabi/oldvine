# The Old Vine Hotel - Website

A modern, responsive hotel website built with React.js, featuring multilingual support (English, Arabic, French) and a fully static deployment.

## 🌐 Live Website

**https://oldvinehotel.com**

## ✨ Features

- 🎨 Modern, responsive design
- 🌐 Multilingual support (EN, AR, FR)
- 🏨 Room gallery with categories
- 📸 Photo galleries (Hotel & Restaurant)
- 📍 Contact page with Google Maps
- 📱 Mobile-optimized
- ⚡ Fully static (no backend required)
- 🎯 SEO-friendly

## 🛠️ Technology Stack

- **Frontend**: React.js with Material-UI
- **Routing**: React Router DOM
- **Internationalization**: i18next
- **Styling**: Material-UI (MUI) components
- **Build Tool**: Create React App
- **Deployment**: Static hosting (cPanel/GoDaddy)

## 📁 Project Structure

```
vine_hotel/
├── client/                 # React frontend
│   ├── public/            # Static assets (images, JSON data)
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── locales/       # Translation files
│   │   └── utils/         # Utilities
│   └── build/             # Production build (generated)
├── docs/                  # Documentation
└── scripts/               # Build/deployment scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vine_hotel
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The website will open at `http://localhost:3060`

### Building for Production

```bash
cd client
npm run build
```

The production build will be in `client/build/` directory.

## 📝 Content Management

The website uses static JSON files for content, located in:
- `client/public/static-data/` - Content data files
- `client/src/locales/` - Translation files

To update content:
1. Edit the JSON files in `client/public/static-data/`
2. Edit translations in `client/src/locales/`
3. Rebuild the site: `npm run build`

## 🌍 Languages

- **English (en)** - Default
- **Arabic (ar)** - العربية
- **French (fr)** - Français

Users can switch languages using the language selector in the header.

## 📦 Deployment

The website is deployed as a static site. To deploy:

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```

2. Upload the contents of `client/build/` to your web server's `public_html` directory.

3. Ensure `.htaccess` is included for proper routing.

## 📄 License

MIT License

---

**Note**: This repository contains only the frontend/website code. The CMS/backend code is excluded from this repository.
