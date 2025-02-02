const scrollToAnchor = (target: string, container: HTMLElement) => {
  if (!target) return;

  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const containerRect = container.getBoundingClientRect();
  const elementRect = targetElement.getBoundingClientRect();
  const elementPosition = elementRect.top - containerRect.top + container.scrollTop;

  container.scrollTo({
    top: elementPosition,
    behavior: 'smooth',
  });
};

export default scrollToAnchor;
