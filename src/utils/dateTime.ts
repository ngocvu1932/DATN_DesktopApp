// Hàm lấy ngày
export const getFormattedDate = (dateString: string) => {
  const datePart = dateString.substring(0, 10);
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};

export const getFormattedDateTime = (dateString: string) => {
  const datePart = dateString.substring(0, 10);
  const timePart = dateString.substring(11, 16);
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year} - ${timePart}`;
};

// Hàm lấy giờ
export const getFormattedTime = (dateString: string) => {
  const timePart = dateString.substring(11, 16);
  return timePart;
};

export const getDaysArrayInMonth = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({length: daysInMonth}, (_, index) => index + 1);
};
