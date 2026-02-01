// StoryRegistry.js
// Dynamically imports all story JSON files in the data folder and exports a storyDataMap object.
// Vite's import.meta.glob eagerly imports all matching files at build time
const modules = import.meta.glob("./*.json", { eager: true });

// Build a map: key = filename (without extension), value = imported JSON
const storyDataMap = {};
for (const path in modules) {
  // Extract filename without extension, e.g., './halloweenStory.json' => 'halloweenStory'
  const match = path.match(/\.\/(.+)\.json$/);
  if (match) {
    const key = match[1];
    storyDataMap[key] = modules[path].default || modules[path];
  }
}

export default storyDataMap;
