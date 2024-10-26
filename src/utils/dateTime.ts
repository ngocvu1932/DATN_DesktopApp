// Hàm lấy ngày
export const getFormattedDate = (dateString: string) => {
  const datePart = dateString.substring(0, 10);
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};

// Hàm lấy giờ
export const getFormattedTime = (dateString: string) => {
  const timePart = dateString.substring(11, 16);
  return timePart;
};