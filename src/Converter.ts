import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { ViewMode } from './constants';
import data from './data.json';
import { createEditor, delay, initResizableSplitter, jsonToMarkdown, markdownToHTML, safeParseJSON, syncViewScroll } from './utils';

// TODO: rename to Renderer
class Converter {
  // TODO:
  // private jsonView: HTMLDivElement;

  private jsonView: EditorView;

  private htmlView: EditorView;

  private markdownView: EditorView;

  private previewView: HTMLDivElement;

  private viewModeRadioGroup: HTMLDivElement;

  private renderModeSelect: HTMLSelectElement;

  constructor() {
    this.jsonView = this.createJSONEditor();
    this.htmlView = this.createHTMLEditor();
    this.markdownView = this.createMarkdownEditor();
    this.previewView = document.querySelector('#preview-view')!;
    this.viewModeRadioGroup = document.querySelector('#view-mode')!;
    this.renderModeSelect = document.querySelector('#render-mode')!;
    this.initEventListeners();
  }

  private createJSONEditor(): EditorView {
    return createEditor(
      document.querySelector('#json-view')!,
      JSON.stringify(data, null, 2),
      [
        json(),
        EditorView.updateListener.of(() => this.updateEditorViewState()),
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

  private updateEditorViewState() {
    const data = safeParseJSON(this.jsonView.state.doc.toString());
    if (!data) return;

    const markdown = jsonToMarkdown(data);
    const html = markdownToHTML(markdown, ['target']);

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

  private initEventListeners() {
    this.initSplitter();
    this.initScroller();
    this.initViewModeRadioGroup();
    this.initRenderModeSelect();
  }

  private initSplitter() {
    initResizableSplitter(document.querySelector('.splitter')!, this.jsonView.dom.parentElement);
  }

  private initScroller() {
    const views = [this.jsonView.dom.parentElement!, this.markdownView.dom.parentElement!, this.previewView];
    views.forEach((view) => {
      view.addEventListener('scroll', () => syncViewScroll(views, view));
    });
  }

  private initViewModeRadioGroup() {
    this.viewModeRadioGroup.addEventListener('change', (event: Event) => {
      const leftPane = document.querySelector<HTMLDivElement>('.pane-left')!;
      const splitter = document.querySelector<HTMLDivElement>('.splitter')!;
      const rightPane = document.querySelector<HTMLDivElement>('.pane-right')!;
      const input = event.target as HTMLInputElement;
      switch (input.value) {
        case ViewMode.EDIT:
          leftPane.toggleAttribute('hidden', false);
          leftPane.style.width = '100%';
          leftPane.style.maxWidth = '100%';
          splitter.hidden = true;
          rightPane.toggleAttribute('hidden', true);
          break;
        case ViewMode.SPLIT:
          leftPane.toggleAttribute('hidden', false);
          leftPane.style.width = '50%';
          leftPane.style.maxWidth = '80%';
          splitter.hidden = false;
          rightPane.toggleAttribute('hidden', false);
          break;
        case ViewMode.PREVIEW:
          leftPane.toggleAttribute('hidden', true);
          splitter.hidden = true;
          rightPane.toggleAttribute('hidden', false);
          break;
      }
    });
  }

  private initRenderModeSelect() {
    this.renderModeSelect.addEventListener('change', (event) => {
      const { value } = event.target as HTMLSelectElement;
      this.htmlView.dom.parentElement!.classList.toggle('pane-right', value === 'html');
      this.markdownView.dom.parentElement!.classList.toggle('pane-right', value === 'markdown');
      this.previewView.classList.toggle('pane-right', value === 'preview');
      const viewMode = this.viewModeRadioGroup.querySelector<HTMLInputElement>('input:checked')!.value;
      if (viewMode === ViewMode.EDIT) return;
      this.htmlView.dom.parentElement!.toggleAttribute('hidden', value !== 'html');
      this.markdownView.dom.parentElement!.toggleAttribute('hidden', value !== 'markdown');
      this.previewView.toggleAttribute('hidden', value !== 'preview');
    });
  }
}

export default Converter;
