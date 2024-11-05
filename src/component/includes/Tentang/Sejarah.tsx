import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  HistoryContent,
  historyService,
} from "../../../services/Tentang/HistoryService";

const History: React.FC = () => {
  const [histories, setHistories] = useState<HistoryContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch histories...");

        const response = await historyService.getHistories();
        console.log("Histories fetched:", response);

        if (Array.isArray(response)) {
          setHistories(response);
        } else {
          console.error("Invalid response format:", response);
          setError("Format data tidak valid.");
        }
      } catch (err) {
        console.error("Error fetching histories:", err);
        setError("Gagal memuat riwayat. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  const formatDescription = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {line}
      </p>
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {histories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Tidak ada riwayat yang tersedia.
        </div>
      ) : (
        <div className="space-y-6">
          {histories.map((history) => (
            <div
              key={history.id}
              className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-black text-lg leading-relaxed ">
                <p>{formatDescription(history.description)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
