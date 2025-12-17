const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5080';
const OUTPUT_DIR = path.join(__dirname, '../client/public/static-data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchAndSave(endpoint, filename) {
  try {
    console.log(`Fetching ${endpoint}...`);
    const response = await axios.get(`${API_URL}${endpoint}`);
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
    console.log(`✅ Saved to ${filename}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    return null;
  }
}

async function fetchAllData() {
  console.log('📦 Fetching all static data...\n');

  // Fetch all required data
  await fetchAndSave('/api/content/home', 'home-content.json');
  await fetchAndSave('/api/content/about', 'about-content.json');
  await fetchAndSave('/api/room-categories', 'room-categories.json');
  await fetchAndSave('/api/gallery-categories', 'gallery-categories.json');
  
  // Fetch individual room categories for galleries
  const categoriesRes = await axios.get(`${API_URL}/api/room-categories`);
  if (categoriesRes.data.success) {
    const categories = categoriesRes.data.data.categories || [];
    for (const category of categories) {
      await fetchAndSave(
        `/api/room-categories/${category.slug}`,
        `room-category-${category.slug}.json`
      );
    }
  }

  // Fetch individual gallery categories
  const galleryRes = await axios.get(`${API_URL}/api/gallery-categories`);
  if (galleryRes.data.success) {
    const galleries = galleryRes.data.data.categories || [];
    for (const gallery of galleries) {
      await fetchAndSave(
        `/api/gallery-categories/${gallery.slug}`,
        `gallery-category-${gallery.slug}.json`
      );
    }
  }

  console.log('\n✅ All static data fetched successfully!');
  console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
}

fetchAllData().catch(console.error);

