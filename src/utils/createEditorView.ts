import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { history, historyKeymap, indentWithTab, standardKeymap } from '@codemirror/commands';
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import type { Extension } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view';

const createEditorView = (parent: Element, doc: string = '', extensions: Extension[] = []) => {
  return new EditorView({
    parent,
    state: EditorState.create({
      doc: doc.endsWith('\n') ? doc : `${doc}\n`,
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
        oneDark,
        rectangularSelection(),
        ...extensions,
      ],
    }),
  });
};

export default createEditorView;
