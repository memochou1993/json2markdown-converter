import { Converter } from '@memochou1993/markdown2html';
import { markedHighlight } from 'marked-highlight';
import externalLink from '~/assets/external-link.svg?raw';
import highlight from './highlight';

const markdownToHTML = (markdown: string, allowedAttributes: string[] = []) => {
  return new Converter(markdown)
    .setDOMPurifyConfig({
      ADD_ATTR: allowedAttributes,
    })
    .setMarkedExtensions([
      {
        renderer: {
          link({ href, title, text }) {
            return `
              <a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">
                ${text || href}${href.startsWith('http') && externalLink}
              </a>
            `;
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
