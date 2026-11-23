
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const imageBase = path.join(root, 'images', 'designs');
const videoBase = path.join(root, 'videos');

const allowedImageCats = [
  'BANNERS',
  'BROCHURE',
  'FLYERS',
  'POSTER_DESIGN',
  'PRODUCT_LABEL_DESIGN'
];

const allowedVideoCats = [
  'REELS',
  'MOTION_POSTER',
  'INTRO_OUTRO',
  'INTERVIEWS'
];

// Supported file formats
const imageExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp'
];

const videoExtensions = [
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
  '.ogv',
  '.ogg',
  '.avi',
  '.mkv',
  '.3gp'
];

// Scan folders recursively
function walkFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(ent => {
    const full = path.join(dir, ent.name);

    return ent.isDirectory()
      ? walkFiles(full, extensions)
      : extensions.includes(path.extname(ent.name).toLowerCase())
        ? [full]
        : [];
  });
}

// Convert folder names into category names
function slugCat(folder) {
  return folder.replace(/[ -]+/g, '_').toUpperCase();
}

// Generate image list
const images = walkFiles(imageBase, imageExtensions)
  .map(file => ({
    category: slugCat(
      path.relative(imageBase, path.dirname(file)).split(path.sep)[0]
    ),
    name: path.basename(file, path.extname(file)),
    path:
      'images/designs/' +
      path.relative(imageBase, file).split(path.sep).join('/')
  }))
  .filter(item => allowedImageCats.includes(item.category));

// Generate video list
const videos = walkFiles(videoBase, videoExtensions)
  .map(file => ({
    category: slugCat(
      path.relative(videoBase, path.dirname(file)).split(path.sep)[0]
    ),
    name: path.basename(file, path.extname(file)),
    path:
      'videos/' +
      path.relative(videoBase, file).split(path.sep).join('/')
  }))
  .filter(item => allowedVideoCats.includes(item.category));

// Create media-list.json
fs.writeFileSync(
  path.join(root, 'media-list.json'),
  JSON.stringify({ images, videos }, null, 2)
);

console.log(
  `Generated media list: ${images.length} images, ${videos.length} videos`
);
