import React, { useEffect, useState } from 'react';
import { VisiContent, visiService } from '../../../services/Tentang/VisiManagement';
import { MisiContent, misiService } from '../../../services/Tentang/MisiService';

const VisiMisiSection = () => {
  const [visiList, setVisiList] = useState<VisiContent[]>([]);
  const [misiList, setMisiList] = useState<MisiContent[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [visiData, misiData] = await Promise.all([
          visiService.getVisiList(),
          misiService.getMisiList()
        ]);
        setVisiList(visiData);
        setMisiList(misiData);
      } catch (err) {
        setError('Gagal memuat konten Visi dan Misi');
        console.error('Error fetching content:', err);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="max-w-8xl mx-auto px-4 py-12">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Visi Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Visi</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-1 w-16 bg-green-600 rounded-full" />
              <div className="h-2 w-2 bg-green-600 rounded-full" />
              <div className="h-1 w-16 bg-green-600 rounded-full" />
            </div>
          </div>

          <div className="">
            <div className="p-6">
              {visiList.length > 0 ? (
                <p className="text-black leading-relaxed text-center">
                  {visiList[0]?.description}
                </p>
              ) : (
                <p className="text-gray-500 text-center italic">Konten visi sedang dimuat...</p>
              )}
            </div>
          </div>
        </div>

        {/* Misi Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Misi</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-1 w-16 bg-green-600 rounded-full" />
              <div className="h-2 w-2 bg-green-600 rounded-full" />
              <div className="h-1 w-16 bg-green-600 rounded-full" />
            </div>
          </div>

          <div className="">
            <div className="p-6">
              {misiList.length > 0 ? (
                <ul className="space-y-4">
                  {misiList.map((misi, index) => (
                    misi.description.split('\n').map((line, lineIndex) => (
                      <li key={`${misi.id}-${lineIndex}`} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm font-medium mr-3 flex-shrink-0">
                          {lineIndex + 1}
                        </span>
                        <p className="text-black leading-relaxed">{line.trim()}</p>
                      </li>
                    ))
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center italic">Konten misi sedang dimuat...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisiMisiSection;