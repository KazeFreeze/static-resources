// This script is run by Node.js, not in the browser.
const fs = require('fs');
const path = require('path');

const mediaDir = path.join(__dirname, 'media'); // The folder with your media
const outputFile = path.join(__dirname, 'media-list.json'); // The output JSON file

// Supported file extensions
const supportedExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.mp4', '.webm'];

/**
 * Recursively finds all files in a directory and its subdirectories.
 * @param {string} dir - The directory to scan.
 * @returns {string[]} An array of file paths relative to the initial mediaDir.
 */
function findMediaFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      // It's a directory, so recurse into it
      results = results.concat(findMediaFiles(fullPath));
    } else {
      // It's a file, check the extension
      const extension = path.extname(file).toLowerCase();
      if (supportedExtensions.includes(extension)) {
        // Get the path relative to the root 'media' folder
        const relativePath = path.relative(mediaDir, fullPath).replace(/\\/g, '/'); // Ensure forward slashes
        results.push(relativePath);
      }
    }
  });
  return results;
}

try {
  const mediaFiles = findMediaFiles(mediaDir);

  // Write the list of filenames to the JSON file
  fs.writeFileSync(outputFile, JSON.stringify(mediaFiles, null, 2));

  console.log(`✅ Successfully generated media-list.json with ${mediaFiles.length} files from all subfolders.`);

} catch (err) {
  console.error('❌ Error generating media list:', err);
  // Create an empty list on error to prevent the site from breaking
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
  process.exit(1);
}