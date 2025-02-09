import { Converter } from '@memochou1993/json2markdown';
import safeParseJSON from './safe-parse-json';
import toTitleCase from './to-title-case';

const jsonToMarkdown = (data: object) => {
  return new Converter(data)
    .toMarkdown((element) => {
      if (element.tag === 'heading') {
        element.value = toTitleCase(element.value);
      }
      if (element.tag === 'tr') {
        element.values = element.values.map(toTitleCase);
      }
      if (element.tag === 'td') {
        element.values = element.values.map((value) => {
          if (!value) {
            return '-';
          }
          const json = safeParseJSON(value);
          if (json) {
            const escape = (text: string) => text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
            return `<pre><code>${escape(JSON.stringify(json, null, 2))}</code></pre>`;
          }
          return value;
        });
      }
      if (element.tag === 'p') {
        element.value = element.value || '<p>-</p>';
      }
      return element;
    });
};

export default jsonToMarkdown;
