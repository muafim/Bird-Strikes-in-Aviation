export const number = (value: number, digits = 0) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
export const percent = (value: number, digits = 2) =>
  `${number(value, digits)}%`;
export const score = (value: number) => number(value, 4);
