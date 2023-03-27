export const formatTime = (time) => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

export const validarFormatEmail = (email) => {
  const regex = /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/igm;
  return regex.test(email);
}