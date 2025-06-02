export const isValidDate = (d: any): boolean => {
  return !isNaN(Date.parse(d));
}