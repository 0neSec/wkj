import React from 'react';
import { IconType } from 'react-icons';
import { FaHistory, FaHandsHelping, FaMedkit, FaRegStar, FaLeaf } from 'react-icons/fa';

interface AboutItemProps {
  icon: IconType;
  title: string;
  content: React.ReactNode;
}

const AboutItem: React.FC<AboutItemProps> = ({ icon: Icon, title, content }) => (
  <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
      <Icon className="mr-2 text-green-600" /> {title}
    </h3>
    <div className="mt-3 text-gray-600">{content}</div>
  </div>
);

interface AboutItemData {
  icon: IconType;
  title: string;
  content: React.ReactNode;
}

const AboutSection: React.FC = () => {
  const aboutItems: AboutItemData[] = [
    {
      icon: FaHistory,
      title: "Sejarah",
      content: "Wisata Kesehatan Jamu Tegal (WKJ) didirikan sebagai upaya untuk melestarikan budaya pengobatan tradisional jamu yang sudah dikenal sejak ratusan tahun di Indonesia. Lokasi ini berperan sebagai pusat wisata kesehatan yang berfokus pada pengobatan alami menggunakan bahan-bahan herbal dan ramuan asli Indonesia. Kesehatan Jamu Tegal (WKJ) didirikan sebagai upaya untuk melestarikan budaya pengobatan tradisional jamu yang sudah dikenal sejak ratusan tahun di Indonesia..."
    },
    {
      icon: FaHandsHelping,
      title: "Misi",
      content: "Misi utama WKJ adalah memperkenalkan manfaat kesehatan dari jamu dan peMisi utama WKJ adalah memperkenalkan manfaat kesehatan dari jamu dan pengobatan herbal kepada masyarakat luas. Kami berkomitmen untuk menyediakan layanan kesehatan alami yang aman, berkualitas, dan berbasis penelitian ilmiah, serta mendukung pelestarian budaya Indonesia.ngobatan herbal kepada masyarakat luas..."
    },
    {
      icon: FaMedkit,
      title: "Layanan Unggulan",
      content: (
        <ul className="space-y-2 list-disc list-inside">
          <li>Pengobatan dengan Jamu Tradisional</li>
          <li>Terapi Kesehatan Alami</li>
          <li>Wisata Edukasi Tanaman Herbal</li>
          <li>Konsultasi Pengobatan Herbal</li>
          <li>Workshop Pembuatan Jamu dan Obat Herbal</li>
        </ul>
      )
    },
    {
      icon: FaRegStar,
      title: "Visi",
      content: "WKJ bertujuan untuk menjadi pusat wisata kesehatan berbasis herbal yang mendunia, menginspirasi dan membantu orang untuk menjaga kesehatan dengan cara yang alami dan tradisional."
    },
    {
      icon: FaLeaf,
      title: "Manfaat Kesehatan",
      content: "Tanaman herbal yang digunakan di WKJ memiliki berbagai manfaat kesehatan, seperti meningkatkan daya tahan tubuh, membantu detoksifikasi, mengurangi stres, dan memperbaiki metabolisme. Setiap pengobatan yang diberikan di WKJ dirancang untuk menyeimbangkan tubuh dan pikiran secara alami."
    }
  ];

  return (
    <section className="py-10 bg-gradient-to-r via-white to-green-50 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400 sm:text-5xl lg:text-6xl animate-fade-in">
            Tentang Wisata Kesehatan Jamu Tegal
          </h2>
          <p className="mt-4 text-lg text-gray-600 animate-fade-in">
            Menghadirkan pengalaman kesehatan alami melalui pengobatan herbal dan jamu tradisional khas Indonesia.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {aboutItems.map((item, index) => (
            <AboutItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;