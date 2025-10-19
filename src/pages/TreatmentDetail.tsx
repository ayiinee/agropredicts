import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Bug,
  Shield,
  FlaskConical,
  Tractor,
  ShoppingBasket,
  Zap, // Ikon untuk aksi cepat
  Trash2, // Ikon untuk sanitasi/eradikasi
  Droplet, // Ikon untuk manajemen air
  ArrowLeft, // Ikon untuk tombol kembali
} from "lucide-react";

// Halaman statis ini berfokus pada Penanganan KURATIF Hama Wereng Coklat (Brown Planthopper)
const WerengCoklatTreatmentPage = () => {
  const navigate = useNavigate();

  const handleBuyMedicine = () => {
    // Navigate to marketplace page
    navigate("/marketplace");
  };

  const handleBack = () => {
    // Navigate back to home/dashboard
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center font-['Inter']">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-6 sm:p-8 transition-all duration-300">
        {/* BACK BUTTON */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition duration-150 font-medium p-2 rounded-lg hover:bg-gray-100"
            role="button"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali
          </button>
        </div>

        {/* Header */}
        <header className="mb-8 pb-4 border-b-4 border-red-500/50">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-red-700 flex items-center gap-3">
            <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
            AKSI CEPAT: Wereng Coklat
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Panduan Penanganan Tanaman yang Sudah Terinfeksi
          </p>
        </header>

        {/* Pest Card & Critical Alert */}
        <div className="mb-8 p-5 border-2 border-red-500 bg-red-100 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Bug className="h-6 w-6 text-red-700 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-red-800">
              Wereng Coklat (Hoppers Telah Terdeteksi)
            </h2>
          </div>
          <p className="mt-1 text-sm text-red-700 font-medium flex items-center">
            <Zap className="h-4 w-4 inline mr-2 align-text-bottom" />
            **Darurat!** Gejala kekuningan/kering sudah terlihat. Lakukan
            pengendalian bertarget segera.
          </p>
        </div>

        {/* Treatment Steps Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-gray-600" />
            Langkah Penyelamatan dan Pengendalian Kimiawi
          </h3>

          {/* 1. Manajemen Air (Penting!) */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Droplet className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <h4 className="font-bold text-lg text-blue-800">
                1. Keringkan Lahan Segera (Aksi Non-Kimia)
              </h4>
            </div>
            <p className="text-gray-700 text-sm pl-4">
              **Kunci utama!** Wereng Coklat menyukai lingkungan lembab.
              Keringkan petakan sawah (sampai tanah retak) untuk menekan
              populasi wereng. Lakukan ini sebelum aplikasi insektisida.
            </p>
          </div>

          {/* 2. Aplikasi Insektisida Bertarget */}
          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-red-600 flex-shrink-0" />
              <h4 className="font-bold text-lg text-red-800">
                2. Penyemprotan Insektisida (Sistemik/Kontak)
              </h4>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm pl-4">
              <li>
                **Pilih Bahan Aktif Cepat:** Prioritaskan insektisida sistemik
                atau kontak-lambung yang direkomendasikan. Contoh bahan aktif:
                **Dinotefuran, Buprofezin, Nitenpyram, atau Fipronil.**
              </li>
              <li>
                **Target Penyemprotan:** Arahkan semprotan ke **pangkal batang
                padi** (20 cm dari permukaan tanah), karena Wereng Coklat
                bersarang dan menghisap di area tersebut.
              </li>
              <li>
                **Waktu Aplikasi:** Lakukan saat populasi wereng masih berupa
                nimfa (Wereng muda, generasi G1/G2), bukan saat sudah menjadi
                *hopperburn* total. Lakukan saat tidak ada embun (pukul
                08.00-11.00 atau sore hari).
              </li>
            </ul>
          </div>

          {/* 3. Sanitasi dan Eradikasi */}
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="h-5 w-5 text-yellow-800 flex-shrink-0" />
              <h4 className="font-bold text-lg text-yellow-900">
                3. Sanitasi dan Eradikasi Fokus
              </h4>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm pl-4">
              <li>
                **Eradikasi Selektif:** Cabut dan kubur/bakar tanaman yang sudah
                menunjukkan gejala *hopperburn* (kering total) untuk
                menghilangkan sumber hama.
              </li>
              <li>
                **Bersihkan Gulma:** Pastikan gulma dan sisa-sisa tanaman di
                sekitar petak terbersihkan untuk memutus siklus hidup Wereng
                Coklat.
              </li>
            </ul>
          </div>

          {/* 4. Pemantauan Ulang */}
          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Tractor className="h-5 w-5 text-green-600 flex-shrink-0" />
              <h4 className="font-bold text-lg text-green-800">
                4. Monitoring dan Pengulangan
              </h4>
            </div>
            <p className="text-gray-700 text-sm pl-4">
              Lakukan pengamatan ulang 3-5 hari setelah penyemprotan. Jika masih
              ditemukan Wereng Coklat aktif dalam jumlah tinggi, ulangi aplikasi
              dengan bahan aktif yang berbeda untuk mencegah resistensi.
            </p>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={handleBuyMedicine}
            className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-full shadow-xl text-white bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-[1.01] hover:shadow-2xl active:bg-red-800"
            role="button"
          >
            <ShoppingBasket className="h-5 w-5 mr-3" />
            Beli Obat Insektisida Sistemik (Rekomendasi)
          </button>
          <p className="mt-4 text-center text-xs text-gray-500">
            *Klik untuk menemukan produk-produk dengan bahan aktif yang
            disarankan untuk aksi cepat.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App component wrapper required for single-file React Immersive
const App = () => {
  return <WerengCoklatTreatmentPage />;
};

export default App;
