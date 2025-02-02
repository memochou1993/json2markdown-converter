const scrollToTOCAnchor = (hash: string, container: HTMLElement) => {
  if (!hash) return;

  container.querySelectorAll('a').forEach((link) => {
    link.parentElement?.classList.toggle('active', link.getAttribute('href') === hash);
  });

  const links = container.querySelectorAll('li');
  const activeLink = Array.from(links).find(item => item.querySelector('a')?.getAttribute('href') === hash);
  if (!activeLink) return;

  const targetPosition = activeLink.offsetTop - (container.offsetHeight / 2) + (activeLink.offsetHeight / 2);

  container.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
};

export default scrollToTOCAnchor;
