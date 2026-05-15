export const convertHoursToSeconds = (hours: number): number => {
  return hours * 3600;
};

export const convertMinutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

export const convertSecondsToHours = (seconds: number): number => {
  return seconds / 3600;
};

export const convertSecondsToMinutes = (seconds: number): number => {
  return seconds / 60;
};

export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const getFutureTimestamp = (secondsFromNow: number): number => {
  return getCurrentTimestamp() + secondsFromNow;
};

export const isTimestampExpired = (timestamp: number): boolean => {
  return getCurrentTimestamp() > timestamp;
};

export const formatTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString();
};
