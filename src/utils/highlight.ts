import highlight from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.min.css';

highlight.registerLanguage('javascript', javascript);

export default highlight;
