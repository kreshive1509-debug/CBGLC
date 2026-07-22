export const formatIndianNumber = (value: number) => {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
};

export const formatAdminTimestamp = (value?: string | Date | null) => {
  if (!value) return 'Not updated yet';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not updated yet';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
