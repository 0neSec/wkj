import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { OrganizationStructureContent, organizationStructureService } from "../../../services/Tentang/StrukturOrganisasi";

const OrganizationStructure: React.FC = () => {
  const [structures, setStructures] = useState<OrganizationStructureContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch organization structures...");

        const response = await organizationStructureService.getOrganizationStructures();
        console.log("Organization structures fetched:", response);

        if (Array.isArray(response)) {
          setStructures(response);
        } else {
          console.error("Invalid response format:", response);
          setError("Format data tidak valid.");
        }
      } catch (err) {
        console.error("Error fetching organization structures:", err);
        setError("Gagal memuat struktur organisasi. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchStructures();
  }, []);

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
    <div className="max-w-7xl mx-auto">
      {structures.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Tidak ada struktur organisasi yang tersedia.
        </div>
      ) : (
        <div className="space-y-6">
          {structures.map((structure) => (
            <div key={structure.id} className="flex flex-col items-center">
              <img
                src={`${process.env.REACT_APP_API_URL}${structure.image_url}`}
                alt="Struktur Organisasi"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/api/placeholder/800/600";
                  target.alt = "Gambar tidak tersedia";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationStructure;