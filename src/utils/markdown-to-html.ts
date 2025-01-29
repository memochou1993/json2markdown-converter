import { Converter } from '@memochou1993/markdown2html';
import { markedHighlight } from 'marked-highlight';
import highlight from './highlight';

const markdownToHTML = (markdown: string, allowedAttributes: string[] = []) => {
  return new Converter(markdown)
    .setDOMPurifyConfig({
      ADD_ATTR: allowedAttributes,
    })
    .setMarkedExtensions([
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
