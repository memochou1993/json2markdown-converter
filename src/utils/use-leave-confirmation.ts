const useLeaveConfirmation = () => {
  const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (process.env.NODE_ENV === 'development') return;
    event.preventDefault();
  };

  const enable = () => {
    window.addEventListener('beforeunload', handleBeforeUnload);
  };

  const disable = () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  return {
    enable,
    disable,
  };
};

export default useLeaveConfirmation;
