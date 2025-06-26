import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
    {
      name: 'removeDimensions',
    }
  ],
};

const iconPath = 'src/assets/icons/**/*.svg';
const svgFiles = await glob(iconPath);

let optimizedCount = 0;
let errorCount = 0;

for (const file of svgFiles) {
  try {
    const code = fs.readFileSync(file, 'utf-8');
    const result = optimize(code, svgoConfig);
    
    if (result.error) {
      console.error(`${file}: ${result.error}`);
      errorCount++;
      continue;
    }
    
    fs.writeFileSync(file, result.data);
    optimizedCount++;
    
  } catch (error) {
    console.error(`${file}: ${error.message}`);
    errorCount++;
  }
}