import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { history, historyKeymap, indentWithTab, standardKeymap } from '@codemirror/commands';
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view';

const createEditor = (parent: Element, doc: string = '', extensions: Extension[] = []) => {
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

export default createEditor;
