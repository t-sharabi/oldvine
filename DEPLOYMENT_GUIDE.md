# Deployment Guide - The Old Vine Hotel Website

This guide explains how to deploy the website to **any server** after cloning the repository.

## ✅ What Makes This Portable

- **Fully Static**: No backend/server-side code required
- **No Database**: All content is in JSON files
- **No Environment Variables**: Works out of the box
- **Standard Web Server**: Works with Apache, Nginx, or any static hosting

## 🚀 Quick Deployment Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/t-sharabi/oldvine.git
cd oldvine
```

### Step 2: Install Dependencies

```bash
cd client
npm install
```

### Step 3: Build for Production

```bash
npm run build
```

This creates an optimized production build in `client/build/` directory.

### Step 4: Deploy the Build Folder

Upload the **entire contents** of `client/build/` to your web server.

---

## 📦 Deployment Options

### Option 1: cPanel / Shared Hosting (GoDaddy, Bluehost, etc.)

1. **Build the website** (steps 1-3 above)

2. **Upload via cPanel File Manager:**
   - Log into cPanel
   - Open File Manager
   - Navigate to `public_html` (or `www` or `htdocs`)
   - Upload all files from `client/build/` to this directory
   - Ensure `.htaccess` file is uploaded (for routing)

3. **Or upload via FTP:**
   ```bash
   # Using command line FTP
   cd client/build
   ftp your-server.com
   # Upload all files to public_html/
   ```

4. **Verify:**
   - Visit your domain
   - Check that all pages load correctly
   - Test language switching

### Option 2: VPS / Cloud Server (DigitalOcean, AWS, etc.)

#### Using SCP:

```bash
# Build first
cd client
npm run build

# Upload to server
scp -r build/* user@your-server.com:/var/www/html/
```

#### Using Git on Server:

```bash
# On your server
cd /var/www/html
git clone https://github.com/t-sharabi/oldvine.git
cd oldvine/client
npm install
npm run build

# Copy build to web root
cp -r build/* /var/www/html/
```

### Option 3: Netlify (Recommended for Easy Deployment)

1. **Connect Repository:**
   - Go to [Netlify](https://www.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select `oldvine` repository

2. **Build Settings:**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`

3. **Deploy:**
   - Netlify will automatically build and deploy
   - Your site will be live at `your-site.netlify.app`
   - You can add a custom domain

### Option 4: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel
   ```

3. **Or connect via GitHub:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `client`
   - Deploy

### Option 5: GitHub Pages

1. **Install gh-pages:**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   "homepage": "https://t-sharabi.github.io/oldvine",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 6: AWS S3 + CloudFront

1. **Build the website:**
   ```bash
   cd client
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** to serve from S3 bucket

---

## 🔧 Server Configuration

### Apache (.htaccess)

The repository includes `.htaccess` for Apache servers. It handles:
- React Router (SPA routing)
- URL rewriting
- Proper MIME types

**No additional configuration needed** - just ensure `.htaccess` is uploaded.

### Nginx

If using Nginx, add this to your server block:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### IIS (Windows Server)

Create `web.config` in the root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## 📋 Pre-Deployment Checklist

- [ ] Build completed successfully (`npm run build`)
- [ ] All files in `client/build/` are ready
- [ ] `.htaccess` file is included (for Apache)
- [ ] Images are optimized and included
- [ ] Static data JSON files are present
- [ ] Tested locally with `npm start`

---

## 🌐 Post-Deployment Verification

After deploying, verify:

1. **Homepage loads:** `https://your-domain.com`
2. **All pages accessible:**
   - `/about`
   - `/rooms`
   - `/gallery`
   - `/contact`
   - `/facilities`
3. **Language switching works:** EN, AR, FR
4. **Images load correctly:** Check galleries and room images
5. **Mobile responsive:** Test on mobile devices
6. **404 handling:** Non-existent routes redirect to homepage

---

## 🔄 Updating the Website

To update content after deployment:

1. **Edit content files:**
   - `client/public/static-data/*.json` - Content data
   - `client/src/locales/*.json` - Translations

2. **Rebuild:**
   ```bash
   cd client
   npm run build
   ```

3. **Redeploy:**
   - Upload new `client/build/` contents to server
   - Or push to Git and let CI/CD handle it (if configured)

---

## 🆘 Troubleshooting

### Issue: Routes return 404

**Solution:** Ensure `.htaccess` (Apache) or proper Nginx config is in place for SPA routing.

### Issue: Images not loading

**Solution:** Check that `images/` folder is uploaded and paths are correct.

### Issue: Language switching not working

**Solution:** Verify `locales/` JSON files are included in build.

### Issue: Blank page

**Solution:** 
- Check browser console for errors
- Verify all files uploaded correctly
- Check server error logs

---

## 📞 Support

For issues or questions:
- Check the main [README.md](README.md)
- Review server logs
- Verify all build files are present

---

**The website is fully portable and can be deployed to any static hosting service!** 🎉
