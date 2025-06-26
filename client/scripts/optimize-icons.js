import fs from 'fs';
import { optimize } from 'svgo';
import { glob } from 'glob';

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
      name: 'addAttributesToSVGElement',
      params: {
        attributes: []
      }
    }
  ],
  js2svg: {
    finalNewline: false,
    pretty: false
  }
};

const iconPath = 'src/shared/assets/icons/**/*.svg';
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
    
    let optimizedCode = result.data;
    
    optimizedCode = optimizedCode.replace(/fill="[^"]*"/g, 'fill="currentColor"');
    optimizedCode = optimizedCode.replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
    
    fs.writeFileSync(file, optimizedCode);
    optimizedCount++;
  
  } catch (error) {
    console.error(`${file}: ${error.message}`);
    errorCount++;
  }
}
