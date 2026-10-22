const fs = require('fs');
const path = require('path');
const https = require('https');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const videosDir = path.join(__dirname, '..', 'public', 'uploads', 'videos');

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed with status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Seeding sample advertisement videos...');

  const videoFiles = [
    { filename: 'craft-stoneground-roast.mp4', label: 'Dark Roast Process' },
    { filename: 'creamy-velvety-drizzle.mp4', label: 'Velvety Smooth Drizzle' },
    { filename: 'crunchy-organic-peanut-butter.mp4', label: 'Extreme 32g Crunch' },
  ];

  for (const vf of videoFiles) {
    const targetPath = path.join(videosDir, vf.filename);
    if (!fs.existsSync(targetPath)) {
      console.log(`Downloading video for ${vf.filename}...`);
      try {
        await downloadFile(sampleVideoUrl, targetPath);
        console.log(`Saved ${vf.filename}`);
      } catch (e) {
        console.error(`Download failed:`, e.message);
      }
    }
  }

  // Check if DB already has records
  const count = await prisma.advertisementVideo.count();
  if (count === 0) {
    console.log('Creating initial advertisement video records in database...');
    await prisma.advertisementVideo.createMany({
      data: [
        {
          title: "Slow Roasted Dark Crunchy Peanut Butter",
          description: "Watch our slow-roasting craft in Gujarat. 100% single-origin peanuts ground fresh.",
          videoUrl: "/uploads/videos/craft-stoneground-roast.mp4",
          productLink: "/shop",
          tagText: "BESTSELLER • 32G PROTEIN",
          displayOrder: 1,
          active: true,
        },
        {
          title: "Belgian Dark Chocolate Peanut Indulgence",
          description: "Real cocoa bean roast blended with fresh roasted peanuts. Pure melt-in-mouth bliss.",
          videoUrl: "/uploads/videos/creamy-velvety-drizzle.mp4",
          productLink: "/collections/chocolate-collection",
          tagText: "CHEF SPECIAL • KETO",
          displayOrder: 2,
          active: true,
        },
        {
          title: "100% Natural Zero Sugar Zero Salt Spread",
          description: "Only one single pure ingredient. Clean athlete fuel trusted by gym trainers.",
          videoUrl: "/uploads/videos/crunchy-organic-peanut-butter.mp4",
          productLink: "/collections/natural-organic",
          tagText: "CLEAN FUEL • 100% PURE",
          displayOrder: 3,
          active: true,
        },
      ],
    });
    console.log('Successfully seeded 3 advertisement videos!');
  } else {
    console.log(`Already found ${count} advertisement videos in database.`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
