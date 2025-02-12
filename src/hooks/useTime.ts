export const useTime = () => {
  const date = new Date();
  if (date.getHours() < 12) {
    return "Good morning";
  } else if (date.getHours() < 18) {
    return "Good afternoon";
  } else if (date.getHours() < 24) {
    return "Good evening";
  } else {
    return "Good night";
  }
};
