import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { history, historyKeymap, indentWithTab, standardKeymap } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, ViewUpdate, crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view';
import { Converter as JSONToMarkdownConverter } from '@memochou1993/json2markdown';
import { Converter as MarkdownToHTMLConverter } from '@memochou1993/markdown2html';
import { toTitleCase } from '@memochou1993/stryle';
import data from './data.json';
import './style.scss';

document.querySelector('#app')!.innerHTML = `
  <header>
    JSON2Markdown2HTML
  </header>
  <main>
    <div class="container">
      <div id="json-view"></div>
      <div id="markdown-view" hidden></div>
      <div id="html-view"></div>
    </div>
  </main>
`;

const initEditor = (parent: Element, doc: string = '', extensions: Extension[] = []) => {
  return new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        autocompletion(),
        bracketMatching(),
        closeBrackets(),
        crosshairCursor(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        EditorView.contentAttributes.of({ 'aria-label': 'Editor' }),
        foldGutter(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        indentOnInput(),
        keymap.of([
          ...closeBracketsKeymap,
          ...completionKeymap,
          ...foldKeymap,
          ...historyKeymap,
          ...lintKeymap,
          ...standardKeymap,
          indentWithTab,
        ]),
        lineNumbers(),
        rectangularSelection(),
        ...extensions,
      ],
    }),
  });
};

const handleUpdate = (view: EditorView, { state }: ViewUpdate) => {
  let data = {};
  try {
    data = JSON.parse(state.doc.toString());
  } catch {
    return;
  }
  const doc = JSONToMarkdownConverter.toMarkdown(data, (element) => {
    if (element.tag === 'heading') {
      element.value = toTitleCase(element.value);
    }
    if (element.tag === 'tr') {
      element.values = element.values.map(value => toTitleCase(String(value)));
    }
    return element;
  });
  view.dispatch({
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: doc,
    },
  });
  document.querySelector('#html-view')!.innerHTML = MarkdownToHTMLConverter.toHTML(doc);
};

initEditor(document.querySelector('#json-view')!, JSON.stringify(data, null, 2), [
  json(),
  EditorView.updateListener.of(update => handleUpdate(markdownView, update)),
]);

const markdownView = initEditor(document.querySelector('#markdown-view')!, '', [
  EditorState.readOnly.of(true),
]);
