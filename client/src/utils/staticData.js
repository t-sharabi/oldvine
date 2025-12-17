// Utility to load static data files instead of making API calls

const loadStaticData = async (filename) => {
  try {
    const response = await fetch(`/static-data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading static data ${filename}:`, error);
    return null;
  }
};

// Predefined data loaders
export const staticData = {
  // Home page content
  getHomeContent: async () => {
    const data = await loadStaticData('home-content.json');
    return data?.data?.content || null;
  },

  // About page content
  getAboutContent: async () => {
    const data = await loadStaticData('about-content.json');
    return data?.data?.content || null;
  },

  // Room categories
  getRoomCategories: async () => {
    const data = await loadStaticData('room-categories.json');
    return data?.data?.categories || [];
  },

  // Single room category
  getRoomCategory: async (slug) => {
    const data = await loadStaticData(`room-category-${slug}.json`);
    return data?.data?.category || null;
  },

  // Gallery categories
  getGalleryCategories: async () => {
    const data = await loadStaticData('gallery-categories.json');
    return data?.data?.categories || [];
  },

  // Single gallery category
  getGalleryCategory: async (slug) => {
    const data = await loadStaticData(`gallery-category-${slug}.json`);
    return data?.data?.category || null;
  },
};

export default staticData;

