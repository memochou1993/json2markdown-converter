import fs from 'fs';
import doc from './src/doc.json';
import { jsonToMarkdown } from './src/utils';

const markdown = jsonToMarkdown(doc);

fs.writeFileSync('README.md', markdown);
