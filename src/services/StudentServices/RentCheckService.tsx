import { supabase } from "../../lib/supabaseClient";

/**
 * Kullanıcının belirtilen kitabı kiralayıp kiralayamayacağını kontrol eder,
 * izin veriyorsa kiralama işlemini yapar.
 *
 * @param user_id Kullanıcının ID'si
 * @param book_id Kiralanacak kitabın ID'si
 * @param return_date Kitabın son teslim tarihi
 * @returns İşlem sonucu ve mesaj
 */
export const rentBookIfAllowed = async (
  user_id: string,
  book_id: string,
  return_date: Date
) => {
  try {
    // 1. Aynı kitabı daha önce almış ve iade etmemiş mi kontrolü
    const { data: existingRentals, error: existingError } = await supabase
      .from("kiralamalar")
      .select("id")
      .eq("kullanici_id", user_id)
      .eq("kitap_id", book_id)
      .is("teslim_edilme_tarihi", null);

    if (existingError) throw existingError;

    if (existingRentals && existingRentals.length > 0) {
      return {
        success: false,
        message: "Bu kitabı zaten ödünç aldınız ve henüz iade etmediniz.",
      };
    }

    // 2. Kullanıcının aktif kiralama sayısını kontrol et
    const { count, error: countError } = await supabase
      .from("kiralamalar")
      .select("*", { count: "exact", head: true })
      .eq("kullanici_id", user_id)
      .is("teslim_edilme_tarihi", null);

    if (countError) throw countError;

    if (count !== null && count >= 5) {
      return {
        success: false,
        message: "En fazla 5 kitap ödünç alabilirsiniz.",
      };
    }

    // 3. Kitabın stok durumu kontrolü
    const { data: kitap, error: kitapError } = await supabase
      .from("kitaplar")
      .select("stok_adedi")
      .eq("id", book_id)
      .single();

    if (kitapError) throw kitapError;

    if (kitap.stok_adedi <= 0) {
      return { success: false, message: "Kitap stokta yok." };
    }

    // 4. Kiralama kaydını oluştur
    const { error: rentError } = await supabase.from("kiralamalar").insert([
      {
        kullanici_id: user_id,
        kitap_id: book_id,
        kiralama_tarihi: new Date().toISOString(),
        teslim_edilme_tarihi: null,
        son_teslim_tarihi: return_date.toISOString(),
      },
    ]);

    if (rentError) throw rentError;

    // 5. Kitap stok bilgisini güncelle (stok adedini 1 azalt)
    const { error: updateStokError } = await supabase
      .from("kitaplar")
      .update({ stok_adedi: kitap.stok_adedi - 1 })
      .eq("id", book_id);

    if (updateStokError) throw updateStokError;

    // 6. NOT: Kullanıcının aktif kitap sayısını veritabanında tutmuyoruz,
    // aktif kiralama sayısı gerektiğinde dinamik olarak hesaplanmalı.

    return { success: true, message: "Kitap başarıyla ödünç alındı." };
  } catch (err: any) {
    console.error("rentBookIfAllowed error:", err.message);
    return { success: false, message: "Kiralama sırasında hata oluştu." };
  }
};

/**
 * Kullanıcının aktif (teslim edilmemiş) kiralama sayısını döner.
 *
 * @param userId Kullanıcının ID'si
 * @returns Aktif kiralama sayısı
 */
export const getActiveRentalCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("kiralamalar")
    .select("*", { count: "exact", head: true })
    .eq("kullanici_id", userId)
    .is("teslim_edilme_tarihi", null);

  if (error) {
    console.error("Aktif kiralama sayısı alınamadı:", error.message);
    return 0;
  }

  return count ?? 0;
};

export const fetchBookHistory = async (bookId: string) => {
  const { data, error } = await supabase
    .from("kiralamalar")
    .select(
      `id, kiralama_tarihi, teslim_edilme_tarihi, son_teslim_tarihi,
       kullanicilar(ad_soyad, eposta),
       kitaplar(kitap_adi, yayinevleri:yayinevi_id(isim))`
    )
    .eq("kitap_id", bookId)
    .order("kiralama_tarihi", { ascending: false });

  if (error) throw error;

  const normalized = (data ?? []).map((rental) => ({
    ...rental,
    kullanicilar: Array.isArray(rental.kullanicilar)
      ? rental.kullanicilar[0]
      : rental.kullanicilar,
  }));

  return normalized;
};
