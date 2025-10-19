import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WerengCoklatTreatment() {
  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Cara Penanganan: Wereng Coklat</h1>
          <p className="text-muted-foreground">
            Panduan praktis dan terperinci untuk mendeteksi, mencegah, dan
            mengendalikan Wereng Coklat (Brown Planthopper) pada tanaman padi.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Singkat</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Wereng Coklat (Brown Planthopper) adalah hama utama pada tanaman
              padi yang dapat menyebabkan serangan intensif dan gagal panen jika
              tidak ditangani segera. Serangan ditandai dengan tanaman
              melengkung (hopper burn), menguning, dan tanaman roboh pada kasus
              berat.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deteksi Awal & Gejala</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                Serangga kecil berbentuk seperti wereng, umumnya berwarna coklat
                kekuningan.
              </li>
              <li>
                Daun menguning dan mengering dari ujung daun (awal), lalu
                menyebar ke seluruh daun.
              </li>
              <li>
                Tanaman menunjukkan gejala "hopper burn" (daun mengerut dan
                tanaman tampak seperti terbakar).
              </li>
              <li>
                Populasi wereng dapat ditemukan pada bagian bawah daun dan di
                tunas; periksa pada pagi hari saat suhu lebih dingin.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Langkah Pencegahan</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                Rotasi tanaman dan varietas tahan: gunakan varietas padi tahan
                wereng bila tersedia.
              </li>
              <li>
                Pengelolaan air: hindari irigasi yang menyebabkan tanaman
                terlalu stres; pertahankan manajemen air yang baik—penggenangan
                yang konstan kadang menurunkan tekanan wereng.
              </li>
              <li>
                Pengelolaan nutrisi: hindari pemupukan nitrogen berlebih karena
                dapat meningkatkan kerentanan terhadap wereng.
              </li>
              <li>
                Pengamatan rutin: inspeksi berkala pada tepi lahan dan tanaman
                muda; catat jumlah wereng per tanaman (sampling) untuk ambang
                tindakan.
              </li>
              <li>
                Pengendalian biologi: pelihara musuh alami seperti kumbang
                predator, lebah pemangsa, dan parasitoid. Hindari insektisida
                spektrum luas jika populasi predator penting.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ambang Pengendalian & Tindakan Terukur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Lakukan tindakan jika jumlah wereng melebihi ambang ekonomi
              (contoh: rata-rata 5-10 ekor/akar sampel pada fase vegetatif
              tergantung rekomendasi lokal). Ambang berbeda berdasarkan varietas
              dan fase pertumbuhan—sesuaikan dengan panduan lokal.
            </p>

            <div className="mt-3 space-y-2 text-sm">
              <div className="font-semibold">
                Tindakan mekanis dan non-kimia:
              </div>
              <ul className="list-disc pl-5">
                <li>Pengamatan dan pemangkasan tanaman yang parah.</li>
                <li>Pengumpulan manual jika populasi kecil.</li>
              </ul>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="font-semibold">
                Tindakan kimia (jika diperlukan):
              </div>
              <ul className="list-disc pl-5">
                <li>
                  Gunakan insektisida selektif yang direkomendasikan oleh dinas
                  pertanian setempat.
                </li>
                <li>
                  Hindari insektisida yang membunuh musuh alami dan rotasi bahan
                  aktif untuk mengurangi resistensi.
                </li>
                <li>
                  Patuhi dosis, interval, dan aturan keamanan (APD) saat
                  aplikasi.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Produk & Formula</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Contoh bahan aktif yang sering direkomendasikan (cek ketersediaan
              lokal dan izin):
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                Neonicotinoid (mis. imidacloprid) — efektif namun perhatikan
                dampak pada penyerbuk dan lingkungan.
              </li>
              <li>
                Spinosad — opsi yang lebih ramah lingkungan untuk beberapa
                kondisi.
              </li>
              <li>
                Pyriproxyfen / Insektisida sistemik lainnya — digunakan
                tergantung rekomendasi lokal.
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Catatan: Pilihan bahan aktif harus disesuaikan dengan regulasi dan
              rekomendasi lokal; konsultasikan dengan penyuluh pertanian.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Langkah Aplikasi yang Aman</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                Gunakan alat pelindung diri penuh (sarung tangan, masker,
                pelindung mata, baju lengan panjang).
              </li>
              <li>Ikuti dosis anjuran pada label produk.</li>
              <li>
                Hindari penyemprotan saat masa berbunga untuk melindungi
                penyerbuk.
              </li>
              <li>
                Jangan mengaplikasikan saat angin kencang atau hujan yang dapat
                mengurangi efektivitas.
              </li>
              <li>
                Jangan membuang sisa racun ke saluran air atau sumber air minum.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pemantauan Pascapengendalian</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                Lakukan pemantauan 3-7 hari setelah aplikasi untuk menilai
                efektivitas.
              </li>
              <li>Catat perubahan populasi dan gejala tanaman.</li>
              <li>
                Catat semua aplikasi (jenis, dosis, waktu) untuk manajemen
                resistensi.
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => window.history.back()}
            className="bg-[#31B57F] hover:bg-[#27A06F]"
          >
            Kembali
          </Button>
        </div>
      </div>
    </RoleBasedLayout>
  );
}
