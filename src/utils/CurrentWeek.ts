// Function to get the start date of the current week and format it
export function CurrentWeek(): string {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = weekStart.toLocaleDateString("en-US", options);

  // Add appropriate suffix to the day
  const day = weekStart.getDate();
  let daySuffix: string;
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = "st";
  } else if (day === 2 || day === 22) {
    daySuffix = "nd";
  } else if (day === 3 || day === 23) {
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  return formattedDate.replace(`${day}`, `${day}${daySuffix}`);
}
