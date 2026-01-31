import Papa from 'papaparse';

export interface CountdownItem {
  Action: string;
  Details: string;
  link_url: string;
  link: string;
  date: number;
  image: string;
  headline: string;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1kG5tVKYaz6Wny2wIZKmbhloD_3Bwl5NeqsPNNGxcHIA/export?format=csv';

export async function fetchCountdownItems(): Promise<CountdownItem[]> {
  try {
    const response = await fetch(SHEET_URL, { next: { revalidate: 60 } }); // Revalidate every 60 seconds
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<CountdownItem>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
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
