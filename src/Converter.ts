import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import data from './data.json';
import { createEditor, delay, jsonToMarkdown, markdownToHTML, safeParseJSON, syncViewScroll } from './utils';

class Converter {
  private jsonView: EditorView;

  private htmlView: EditorView;

  private markdownView: EditorView;

  private previewView: HTMLElement;

  private viewModeSelect: HTMLSelectElement;

  private sanitizeModeSelect: HTMLSelectElement;

  constructor() {
    this.jsonView = this.createJSONEditor();
    this.htmlView = this.createHTMLEditor();
    this.markdownView = this.createMarkdownEditor();
    this.previewView = document.querySelector('#preview-view')!;
    this.viewModeSelect = document.querySelector('#view-mode')!;
    this.sanitizeModeSelect = document.querySelector('#sanitize-mode')!;
    this.attachEventListeners();
  }

  private createJSONEditor(): EditorView {
    return createEditor(
      document.querySelector('#json-view')!,
      JSON.stringify(data, null, 2),
      [
        json(),
        EditorView.updateListener.of(() => this.updateViewState()),
        EditorView.focusChangeEffect.of((state, focusing) => {
          if (!focusing) {
            (async () => {
              const data = safeParseJSON(state.doc.toString());
              if (!data) return;
              await delay(0);
              this.jsonView.dispatch({
                changes: {
                  from: 0,
                  to: state.doc.length,
                  insert: JSON.stringify(data, null, 2),
                },
              });
            })();
          }
          return null;
        }),
      ],
    );
  }

  private createHTMLEditor(): EditorView {
    return createEditor(
      document.querySelector('#html-view')!,
      '',
      [
        html(),
        EditorView.lineWrapping,
        EditorState.readOnly.of(true),
      ],
    );
  }

  private createMarkdownEditor(): EditorView {
    return createEditor(
      document.querySelector('#markdown-view')!,
      '',
      [
        markdown(),
        EditorView.lineWrapping,
        EditorState.readOnly.of(true),
      ],
    );
  }

  private attachEventListeners() {
    this.syncViewScroll([
      this.jsonView.dom.parentElement!,
      this.markdownView.dom.parentElement!,
      this.previewView,
    ]);

    this.viewModeSelect.addEventListener('change', (event) => {
      const { value } = event.target as HTMLSelectElement;
      this.htmlView.dom.parentElement!.toggleAttribute('hidden', value !== 'html');
      this.markdownView.dom.parentElement!.toggleAttribute('hidden', value !== 'markdown');
      this.previewView.toggleAttribute('hidden', value !== 'preview');
      this.sanitizeModeSelect.toggleAttribute('disabled', !['html', 'preview'].includes(value));
    });

    this.sanitizeModeSelect.addEventListener('change', () => {
      this.updateViewState();
    });
  }

  private updateViewState() {
    const data = safeParseJSON(this.jsonView.state.doc.toString());
    if (!data) return;

    const markdown = jsonToMarkdown(data);
    const html = markdownToHTML(markdown, this.sanitizeModeSelect.value === 'sanitized' ? ['target'] : ['onmouseover']);

    this.htmlView.dispatch({
      changes: {
        from: 0,
        to: this.htmlView.state.doc.length,
        insert: html,
      },
    });

    this.markdownView.dispatch({
      changes: {
        from: 0,
        to: this.markdownView.state.doc.length,
        insert: markdown,
      },
    });

    this.previewView.innerHTML = html;
  }

  private syncViewScroll(views: HTMLElement[]) {
    views.forEach((view) => {
      view.addEventListener('scroll', () => syncViewScroll(views, view));
    });
  }
}

export default Converter;
