const useLeaveConfirmation = () => {
  function handleBeforeUnload(event: BeforeUnloadEvent): void {
    event.preventDefault();
  }

  window.addEventListener('beforeunload', handleBeforeUnload);
};

export default useLeaveConfirmation;
