import { parse } from 'node-html-parser';
import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

const svgFiles = globSync('src/shared/assets/icons/*.svg');
const symbols = [];

svgFiles.forEach((file) => {
  const code = fs.readFileSync(file, 'utf-8');
  const svgElement = parse(code).querySelector('svg');
  const symbolElement = parse(`<symbol/>`).querySelector('symbol');
  const fileName = path.basename(file, '.svg');

  if (svgElement && symbolElement) {
    svgElement.childNodes.forEach((child) => symbolElement.appendChild(child));
    symbolElement.setAttribute('id', fileName);

    if (svgElement.attributes.viewBox) {
      symbolElement.setAttribute('viewBox', svgElement.attributes.viewBox);
    }

    if (svgElement.attributes.fill) {
      symbolElement.setAttribute('fill', svgElement.attributes.fill);
    }

    symbolElement.setAttribute(
      'xmlns',
      svgElement.attributes.xmlns || 'http://www.w3.org/2000/svg'
    );

    symbols.push(symbolElement.toString());
  }
});

const svgSprite = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`;
fs.writeFileSync('public/sprite.svg', svgSprite);