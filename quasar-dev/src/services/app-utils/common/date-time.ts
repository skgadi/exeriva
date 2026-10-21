/**
 * convert time in seconds to hours minutes and seconds
 * @param timeInSeconds time in seconds
 * @returns string in format of hh:mm:ss
 */
export const convertTimeInSecondsToHMS = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
