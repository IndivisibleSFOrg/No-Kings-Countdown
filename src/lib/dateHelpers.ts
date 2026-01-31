// Get the current day of the month (1-31)
export const getCurrentDay = (): number => {
  const today = new Date();
  return today.getDate();
};
