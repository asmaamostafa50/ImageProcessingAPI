import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const getImagesPath = (dirFiles: string = __dirname): string => {
  let imagesPath = '';
  const dir = fs.readdirSync(dirFiles);
  //console.log(dir);
  if (dir.includes('images')) {
    imagesPath = path.join(dirFiles, 'images');
  } else {
    imagesPath = getImagesPath(path.join(dirFiles, '..'));
  }
  return imagesPath;
};

const resizeImage = async (
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<void> => {
  const resizedDir = path.join(getImagesPath(), 'resized');
  if (!fs.existsSync(resizedDir)) fs.mkdirSync(resizedDir);

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  await image
    .resize(
      width > 0 ? width : metadata.width,
      height > 0 ? height : metadata.height
    )
    .toFile(outputPath);
};

export const handleImage = async (query: qs.ParsedQs): Promise<string> => {
  const { filename, width, height } = query;
  const imagesPath: string = getImagesPath();
  const originalImagePath: string = path.join(imagesPath, filename + '.jpg');

  if (!width && !height) {
    console.log('Return Original Image');
    return originalImagePath;
  }

  let dimensions = '';

  if (height) {
    dimensions = `-height${parseInt(height as string)}`;
  }
  if (width) {
    dimensions = dimensions + `-width${parseInt(width as string)}`;
  }

  const resizedImagePath = path.join(
    imagesPath,
    'resized',
    filename + dimensions + '.jpg'
  );

  if (fs.existsSync(resizedImagePath)) {
    console.log('Return Cached Image');
    return resizedImagePath;
  } else {
    await resizeImage(
      originalImagePath,
      resizedImagePath,
      parseInt(width as string),
      parseInt(height as string)
    );
    console.log('Resizing Is Done');
  }
  return resizedImagePath;
};
