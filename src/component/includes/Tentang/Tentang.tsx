import React, { useEffect, useState } from 'react';
import { ProfileContent, profileService } from '../../../services/Tentang/TentangService';
import { Loader2 } from 'lucide-react';

const TentangProfile: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const data = await profileService.getProfile();
        setProfiles(data);
      } catch (err) {
        setError('Failed to load profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const formatDescription = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {line}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {profiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Tidak ada profil yang tersedia.
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-gray-700 leading-relaxed">
                {formatDescription(profile.description)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TentangProfile;
