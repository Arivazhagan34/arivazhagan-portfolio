import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const imageBase=path.join(root,'images','designs');
const videoBase=path.join(root,'videos');
const allowedImageCats=['BANNERS','BROCHURE','FLYERS','POSTER_DESIGN','PRODUCT_LABEL_DESIGN'];
const allowedVideoCats=['REELS','MOTION_POSTER','INTRO_OUTRO','INTERVIEWS'];
function walkFiles(dir,extensions){if(!fs.existsSync(dir))return [];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>{const full=path.join(dir,ent.name);return ent.isDirectory()?walkFiles(full,extensions):extensions.includes(path.extname(ent.name).toLowerCase())?[full]:[]})}
function slugCat(folder){return folder.replace(/[ -]+/g,'_').toUpperCase()}
const images=walkFiles(imageBase,['.jpg']).map(file=>({category:slugCat(path.relative(imageBase,path.dirname(file)).split(path.sep)[0]),name:path.basename(file,path.extname(file)),path:'images/designs/'+path.relative(imageBase,file).split(path.sep).join('/')})).filter(x=>allowedImageCats.includes(x.category));
const videos=walkFiles(videoBase,['.mp4']).map(file=>({category:slugCat(path.relative(videoBase,path.dirname(file)).split(path.sep)[0]),name:path.basename(file,path.extname(file)),path:'videos/'+path.relative(videoBase,file).split(path.sep).join('/')})).filter(x=>allowedVideoCats.includes(x.category));
fs.writeFileSync(path.join(root,'media-list.json'),JSON.stringify({images,videos},null,2));
console.log(`Generated media list: ${images.length} JPGs, ${videos.length} MP4s`);
