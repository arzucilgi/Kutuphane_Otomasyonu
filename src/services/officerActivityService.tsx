import { supabase } from "../lib/supabaseClient";

// Son eklenen kitaplar (ekleyen memur bazında)
export const fetchRecentBooks = async (officerId: string) => {
  const { data, error } = await supabase
    .from("kitaplar")
    .select(
      `
      id,
      kitap_adi,
      eklenme_tarihi,
      yazarlar: yazar_id (isim),
      yayinevleri: yayinevi_id (isim),
      raflar: raf_id (raf_no)
    `
    )
    .eq("ekleyen_memur_id", officerId)
    .order("eklenme_tarihi", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
};

// Son yapılan kiralamalar (onaylayan memur bazında)
export const fetchRecentRentals = async (officerId: string) => {
  const { data, error } = await supabase
    .from("kiralamalar")
    .select(
      `
      id,
      kitaplar(kitap_adi, yazarlar (
          isim
        )),
      kullanicilar(ad_soyad),
      kiralama_tarihi
    `
    )
    .or(`kiralayan_memur_id.eq.${officerId}`)
    .order("kiralama_tarihi", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
};

// Son eklenen öğrenciler (oluşturan memur bazında)
export const fetchRecentStudents = async (officerId: string) => {
  const { data, error } = await supabase
    .from("kullanicilar")
    .select("id, ad_soyad,eposta, olusturulma_tarihi, ekleyen_memur_id")
    .eq("ekleyen_memur_id", officerId)
    .order("olusturulma_tarihi", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
};

// Son teslim alınan kitaplar (teslim alan memur bazında)
export const fetchRecentReturnedBooks = async (officerId: string) => {
  const { data, error } = await supabase
    .from("kiralamalar")
    .select(
      `
      id,
      kitaplar(kitap_adi, yazarlar (isim)),
      kullanicilar(ad_soyad),
      kiralama_tarihi,
      teslim_edilme_tarihi
    `
    )
    .eq("teslim_alan_memur_id", officerId) // Burayı teslim alan memurun ID'si olan alanla değiştir
    .not(" teslim_edilme_tarihi", "is", null) // teslim_tarihi null olmayanlar (teslim alınmış)
    .order(" teslim_edilme_tarihi", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
};

export const fetchRecentPaidPenalties = async (officerId: string) => {
  // Eğer officerId özel filtre gerektirmiyorsa kaldırabilirsiniz.
  // Burada tüm ödenmiş cezaları son tarihe göre getiriyoruz.
  const { data, error } = await supabase
    .from("cezalar")
    .select(
      `
      id,
      baslangic,
      bitis,
      aciklama,
      odeme_tarihi,
      odeme_durumu,
      kullanici_id,
      kullanicilar(ad_soyad, eposta)
    `
    )
    .eq("odeme_durumu", true)
    .eq("onaylayan_memur_id", officerId)
    .order("odeme_tarihi", { ascending: false })
    .limit(5); // Son 10 ödenmiş ceza

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
