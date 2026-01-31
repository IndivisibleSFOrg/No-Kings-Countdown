import { fetchCountdownItems } from "@/lib/googleSheets";
import { CountdownDisplay } from "./components/CountdownDisplay";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const communityActions = await fetchCountdownItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <CountdownDisplay actions={communityActions} />
    </div>
  );
}
