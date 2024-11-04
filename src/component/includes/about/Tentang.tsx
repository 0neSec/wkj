import React, { useEffect, useState } from 'react';
import { ProfileContent, profileService } from '../../../services/profile';
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
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mx-4 md:mx-8">
        <p className="font-medium text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {profiles.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500 text-lg">No profiles available.</p>
        </div>
      ) : (
        <div className="space-y-6 px-4 md:px-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6 md:p-8">
              <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Tentang Kami
              </h1>
              <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
            </div>
                <div className="prose prose-gray max-w-none">
                  {formatDescription(profile.description)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TentangProfile;