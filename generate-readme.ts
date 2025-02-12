import fs from 'fs';
import doc from '~/assets/docs/doc.json';
import { jsonToMarkdown } from '~/utils';

const markdown = jsonToMarkdown(doc);

fs.writeFileSync('README.md', markdown);
