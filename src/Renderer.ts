import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { RenderMode, ViewMode } from './constants';
import data from './data.json';
import { createEditorView, delay, initResizableSplitter, jsonToMarkdown, markdownToHTML, safeParseJSON, syncViewScroll } from './utils';

class Renderer {
  private jsonView: HTMLDivElement;

  private previewView: HTMLDivElement;

  private htmlView: HTMLDivElement;

  private markdownView: HTMLDivElement;

  private viewModeRadioGroup: HTMLDivElement;

  private renderModeSelect: HTMLSelectElement;

  private splitter: HTMLDivElement;

  private jsonEditorView: EditorView;

  private htmlEditorView: EditorView;

  private markdownEditorView: EditorView;

  constructor() {
    this.jsonView = document.querySelector('#json-view')!;
    this.previewView = document.querySelector('#preview-view')!;
    this.htmlView = document.querySelector('#html-view')!;
    this.markdownView = document.querySelector('#markdown-view')!;
    this.viewModeRadioGroup = document.querySelector('#view-mode')!;
    this.renderModeSelect = document.querySelector('#render-mode')!;
    this.splitter = document.querySelector('.splitter')!;
    this.jsonEditorView = this.createJSONEditorView();
    this.htmlEditorView = this.createHTMLEditorView();
    this.markdownEditorView = this.createMarkdownEditorView();
    this.initEventListeners();
  }

  private createJSONEditorView(): EditorView {
    return createEditorView(
      this.jsonView,
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
              this.jsonEditorView.dispatch({
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

  private createHTMLEditorView(): EditorView {
    return createEditorView(
      this.htmlView,
      '',
      [
        html(),
        EditorView.lineWrapping,
        EditorState.readOnly.of(true),
      ],
    );
  }

  private createMarkdownEditorView(): EditorView {
    return createEditorView(
      this.markdownView,
      '',
      [
        markdown(),
        EditorView.lineWrapping,
        EditorState.readOnly.of(true),
      ],
    );
  }

  private updateEditorViewState() {
    const data = safeParseJSON(this.jsonEditorView.state.doc.toString());
    if (!data) return;

    const markdown = jsonToMarkdown(data);
    const html = markdownToHTML(markdown, ['target']);

    this.previewView.innerHTML = html;

    this.htmlEditorView.dispatch({
      changes: {
        from: 0,
        to: this.htmlEditorView.state.doc.length,
        insert: html,
      },
    });

    this.markdownEditorView.dispatch({
      changes: {
        from: 0,
        to: this.markdownEditorView.state.doc.length,
        insert: markdown,
      },
    });
  }

  private initEventListeners() {
    this.initSplitter();
    this.initScroller();
    this.initViewModeRadioGroup();
    this.initRenderModeSelect();
  }

  private initSplitter() {
    initResizableSplitter(this.splitter, this.jsonView);
  }

  private initScroller() {
    const views = [
      this.jsonView,
      this.previewView,
      this.htmlView,
      this.markdownView,
    ];

    views.forEach((view) => {
      view.addEventListener('scroll', () => syncViewScroll(views, view));
    });
  }

  private initViewModeRadioGroup() {
    this.viewModeRadioGroup.addEventListener('change', (event: Event) => {
      const leftPane = document.querySelector('.pane-left') as HTMLDivElement;
      const rightPane = document.querySelector('.pane-right') as HTMLDivElement;
      const splitter = this.splitter;
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
        case ViewMode.VIEW:
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
      this.htmlView.classList.toggle('pane-right', value === RenderMode.HTML);
      this.markdownView.classList.toggle('pane-right', value === RenderMode.MARKDOWN);
      this.previewView.classList.toggle('pane-right', value === RenderMode.PREVIEW);
      const viewMode = (this.viewModeRadioGroup.querySelector('input:checked') as HTMLInputElement).value;
      if (viewMode === ViewMode.EDIT) return;
      this.htmlView.toggleAttribute('hidden', value !== RenderMode.HTML);
      this.markdownView.toggleAttribute('hidden', value !== RenderMode.MARKDOWN);
      this.previewView.toggleAttribute('hidden', value !== RenderMode.PREVIEW);
    });
  }
}

export default Renderer;
