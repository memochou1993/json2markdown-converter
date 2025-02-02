import { Converter } from '@memochou1993/markdown2html';
import { markedHighlight } from 'marked-highlight';
import externalLinkImage from '~/assets/external-link.svg?raw';
import linkImage from '~/assets/link.svg?raw';
import highlight from './highlight';
import toKebabCase from './to-kebab-case';

const markdownToHTML = (markdown: string, allowedAttributes: string[] = []) => {
  const idCounts: Record<string, number> = {};
  return new Converter(markdown)
    .setDOMPurifyConfig({
      ADD_ATTR: allowedAttributes,
    })
    .setMarkedExtensions([
      {
        renderer: {
          heading({ depth, text }) {
            const id = toKebabCase(text);
            const count = idCounts[id] || 0;
            const uniqueId = `${id}${count > 0 ? `-${count}` : ''}`;
            idCounts[id] = count + 1;
            return `<h${depth}><a id="${uniqueId}" href="#${uniqueId}" class="anchor">${linkImage}${text}</a></h${depth}>`;
          },
          link({ href, title, text }) {
            return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text || href}${href.startsWith('http') && externalLinkImage}</a>`;
          },
        },
      },
      markedHighlight({
        langPrefix: 'lang-',
        highlight(code, lang) {
          const options = {
            language: highlight.getLanguage(lang) ? lang : 'javascript',
          };
          return highlight.highlight(code, options).value;
        },
      }),
    ])
    .toHTML();
};

export default markdownToHTML;
