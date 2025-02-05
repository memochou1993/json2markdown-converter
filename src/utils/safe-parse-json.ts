const safeParseJSON = (data: unknown): object | undefined => {
  if (typeof data !== 'string') return;
  try {
    return JSON.parse(data);
  } catch {
    return;
  }
};

export default safeParseJSON;
