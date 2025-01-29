const safeParseJSON = (str: string): object | undefined => {
  try {
    return JSON.parse(str);
  } catch {
    return;
  }
};

export default safeParseJSON;
