const MESSAGE_CHAR_LIMIT = 2000;

const splitString = (string, prepend = '', append = '') => {
  if (string.length <= MESSAGE_CHAR_LIMIT) {
    return [string];
  }

  const splitIndex = string.lastIndexOf('\n', MESSAGE_CHAR_LIMIT - prepend.length - append.length);
  const sliceEnd = splitIndex > 0 ? splitIndex : MESSAGE_CHAR_LIMIT - prepend.length - append.length;
  const rest = splitString(string.slice(sliceEnd), prepend, append);

  return [`${string.slice(0, sliceEnd)}${append}`, `${prepend}${rest[0]}`, ...rest.slice(1)];
};