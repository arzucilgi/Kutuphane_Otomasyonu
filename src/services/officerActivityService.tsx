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
