import { useEffect, useState } from "react";
import StatsOverlay, { PlayerData } from "@/components/StatsOverlay";

const API_URL = "http://localhost:8000/api/current-player-stats";

const Index = () => {
  const [data, setData] = useState<PlayerData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json?.status === "success") {
          setData(json.data);
        }
      } catch {
        // overlay stays silent on errors
      }
    };

    fetchData();
    const id = setInterval(fetchData, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return <StatsOverlay data={data} />;
};

export default Index;
