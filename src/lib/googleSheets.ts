import Papa from 'papaparse';

// CountdownItem represents the structured data used in the application, while
// CountdownCSVItem represents the raw data format from the CSV. The
// toCountdownItem function transforms the raw CSV data into the structured
// format, including parsing the date field appropriately. The
// fetchCountdownItems function retrieves the CSV data from the Google Sheet,
// parses it, and returns an array of CountdownItem objects.

export interface CountdownItem {
  action: string;
  details: string;
  link_url: string;
  link_text: string;
  date: Date;
  image: string;
  headline: string;
}

export interface CountdownCSVItem {
  Action: string;
  Details: string;
  link_url: string;
  link: string;
  date: number | string;
  image: string;
  headline: string;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1kG5tVKYaz6Wny2wIZKmbhloD_3Bwl5NeqsPNNGxcHIA/export?format=csv';

// Input: CSV `date` field as number/string (either day-of-month like "5"/5 or a full date string).
// Output: JavaScript `Date`.
// Transform: if input is a day-of-month, use today's year/month at midnight and set that day; otherwise parse the string; fallback is `new Date()`.
const parseCsvDate = (value: CountdownCSVItem["date"]): Date => {
  const day = typeof value === "number" ? value : Number.parseInt(value, 10);
  if (Number.isFinite(day)) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(day);
    return date;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return new Date();
};

export const toCountdownItem = (item: CountdownCSVItem): CountdownItem => ({
  action: item.Action,
  details: item.Details,
  link_url: item.link_url,
  link_text: item.link,
  date: parseCsvDate(item.date),
  image: item.image,
  headline: item.headline,
});

export async function fetchCountdownItems(): Promise<CountdownItem[]> {
  try {
    const response = await fetch(SHEET_URL, { next: { revalidate: 60 } }); // Revalidate every 60 seconds
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<CountdownCSVItem>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data.map((item) => toCountdownItem(item)));
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    return [];
  }
}
