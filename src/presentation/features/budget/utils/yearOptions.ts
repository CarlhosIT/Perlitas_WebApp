export const CURRENT_YEAR = new Date().getFullYear()
export const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR - 5 + i)
