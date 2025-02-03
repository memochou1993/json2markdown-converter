const scrollToTOCAnchor = (hash: string, container: HTMLElement) => {
  if (!hash) return;

  container.querySelectorAll('li').forEach((listItem) => {
    listItem.classList.remove('active', 'expanded');
  });

  const activeAnchor = container.querySelector(`a[href="${hash}"]`) as HTMLAnchorElement;
  if (!activeAnchor) return;

  const listItem = activeAnchor.closest('li');
  if (listItem) {
    listItem.classList.add('active');
    for (let parent = listItem.closest('li')?.parentElement?.closest('li'); parent; parent = parent.parentElement?.closest('li')) {
      parent.classList.add('expanded');
    }
  }

  const targetPosition = activeAnchor.offsetTop - (container.offsetHeight / 2) + (activeAnchor.offsetHeight / 2);

  container.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
};

export default scrollToTOCAnchor;
