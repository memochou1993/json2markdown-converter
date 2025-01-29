import { Converter } from '@memochou1993/json2markdown';
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
      return element;
    });
};

export default jsonToMarkdown;
