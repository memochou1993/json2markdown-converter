import { json } from '@codemirror/lang-json';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import data from './data.json';
import { createEditor, jsonToMarkdown, markdownToHTML, safeParseJSON } from './utils';

class Converter {
  private jsonView: EditorView;

  private markdownView: EditorView;

  private htmlView: HTMLElement;

  private viewModeSelect: HTMLSelectElement;

  private htmlModeSelect: HTMLSelectElement;

  constructor() {
    this.jsonView = this.createJSONEditor();
    this.markdownView = this.createMarkdownEditor();
    this.htmlView = document.querySelector('#html-view')!;
    this.viewModeSelect = document.querySelector('#view-mode')!;
    this.htmlModeSelect = document.querySelector('#html-mode')!;
    this.attachEventListeners();
  }

  private createJSONEditor(): EditorView {
    return createEditor(
      document.querySelector('#json-view')!,
      JSON.stringify(data, null, 2),
      [
        json(),
        EditorView.updateListener.of(update => this.handleJSONUpdate(update.state.doc.toString())),
      ],
    );
  }

  private createMarkdownEditor(): EditorView {
    return createEditor(
      document.querySelector('#markdown-view')!,
      '',
      [
        EditorState.readOnly.of(true),
      ],
    );
  }

  private attachEventListeners() {
    this.viewModeSelect.addEventListener('change', (event) => {
      const { value } = event.target as HTMLSelectElement;
      this.htmlView.toggleAttribute('hidden', value !== 'html');
      this.markdownView.dom.parentElement!.toggleAttribute('hidden', value !== 'markdown');
      this.htmlModeSelect.toggleAttribute('hidden', value !== 'html');
    });

    this.htmlModeSelect.addEventListener('change', () => {
      this.updateHTMLView();
    });
  }

  private handleJSONUpdate(str: string) {
    const obj = safeParseJSON(str);
    if (!obj) return;
    const markdown = jsonToMarkdown(obj);
    this.markdownView.dispatch({
      changes: {
        from: 0,
        to: this.markdownView.state.doc.length,
        insert: markdown,
      },
    });
    this.updateHTMLView();
  }

  private updateHTMLView() {
    const obj = safeParseJSON(this.jsonView.state.doc.toString());
    if (!obj) return;
    const markdown = jsonToMarkdown(obj);
    this.htmlView.innerHTML = markdownToHTML(markdown, this.htmlModeSelect.value === 'sanitized' ? ['target'] : ['onmouseover']);
  }
}

export default Converter;
