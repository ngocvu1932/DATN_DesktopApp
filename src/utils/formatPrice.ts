export const formatPrice = (price: string) => {
  return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(Number(price));
};
