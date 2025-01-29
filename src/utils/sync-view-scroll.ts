const syncViewScroll = (views: HTMLElement[], activeView: HTMLElement) => {
  const { clientHeight, scrollHeight, scrollTop } = activeView;
  const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

  for (const view of views) {
    if (view === activeView) continue;
    const { clientHeight, scrollHeight } = view;
    view.scrollTop = (scrollHeight - clientHeight) * scrollPercentage;
  }
};

export default syncViewScroll;
