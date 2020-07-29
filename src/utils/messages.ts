export const generateMessage = (userName: string, messageBody: string) => {
  return {
    userName,
    messageBody,
    createdAt: new Date().getTime(),
  };
};

export const generateLocationMessage = (userName: string, url: string) => {
  return {
    userName,
    messageBody: url,
    createdAt: new Date().getTime(),
  };
};
