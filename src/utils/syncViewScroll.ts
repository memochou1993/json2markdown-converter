let isSyncing = false;

const syncViewScroll = (views: HTMLElement[], activeView: HTMLElement) => {
  if (isSyncing) return;

  isSyncing = true;

  const { clientHeight, scrollHeight, scrollTop } = activeView;
  const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

  for (const view of views) {
    if (view === activeView) continue;
    const { clientHeight, scrollHeight } = view;
    view.scrollTop = (scrollHeight - clientHeight) * scrollPercentage;
  }

  setTimeout(() => {
    isSyncing = false;
  }, 0);
};

export default syncViewScroll;
