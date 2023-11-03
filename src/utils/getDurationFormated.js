export function getDurationFormatted(millis) {
  const minutes = millis / 1000 / 60;
  const minutesDisplay = Math.floor(minutes);
  const seconds = (minutes - minutesDisplay) * 60;
  const secondsDisplay =
    seconds < 10 ? `0${Math.round(seconds)}` : Math.round(seconds);
  return `${minutesDisplay}:${secondsDisplay}`;
}
