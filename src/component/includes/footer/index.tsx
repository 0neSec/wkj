import React from 'react';
import { FaEnvelope, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <div>
      <footer className="bg-gray-800 text-white py-10 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mt-4">Alamat</h3>
              <p>
                Jl. Raya Moga - Guci, Kebonagung,
                <br />
                KECAMATAN:, Kec. Balapulang
                <br />
                Kabupaten Tegal
                <br />
                Jawa Tengah 52464
              </p>
              <img src="/assets/logo.png" alt="Logo" width={60} height={38} />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Map</h3>
              <div className="h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.189947273622!2d109.12901517499826!3d-7.103972192899405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f947b2f61ffa1%3A0x106996704d975489!2sWISATA%20KESEHATAN%20JAMU%20KALIBAKUNG!5e0!3m2!1sid!2sid!4v1729479763317!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="rounded-lg shadow-md"
                ></iframe>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Kontak</h3>
              <p>
                Telepon <a href="tel:082327858995">085226157208</a>
                <br />
                Email{' '}
                <a href="mailto:wkjofficial@gmail.com">
                  wkjofficial@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Time Pelayanan</h3>
              <p>
                <strong>Senin-Kamis:</strong> 07.15 – 14.15
                <br />
                <strong>Jum’at:</strong> 07.15 – 11.15
                <br />
                <strong>Sabtu:</strong> 07.15 – 12.45
              </p>
              <h3 className="text-xl font-semibold mt-4">Time Pendaftaran</h3>
              <p>
                <strong>Senin-Kamis:</strong> 07.15 – 11.00
                <br />
                <strong>Jum’at:</strong> 07.15 – 10.00
                <br />
                <strong>Sabtu:</strong> 07.15 – 10.30
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Follow</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/wkj.kalibakung/"
                  className="text-gray-400 hover:text-white"
                >
                  <FaInstagram size={30} />
                </a>
                <a
                  href="mailto:wkjofficial@gmail.com"
                  className="text-gray-400 hover:text-white"
                >
                  <FaEnvelope size={30} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p>
              Reserved powered by{' '}
              <span className="text-[#45a6ae] text-sm">Astron Dev</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
