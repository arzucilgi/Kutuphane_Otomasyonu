import { supabase } from "../../lib/supabaseClient";

export const rentBookIfAllowed = async (
  user_id: string,
  book_id: string,
  return_date: Date
) => {
  try {
    // 1. Aynı kitabı aktif olarak kiralamış mı kontrol et (onaylı ve teslim edilmemiş)
    const { data: existingRentals, error: existingError } = await supabase
      .from("kiralamalar")
      .select("id")
      .eq("kullanici_id", user_id)
      .eq("kitap_id", book_id)
      .is("teslim_edilme_tarihi", null);
    // .eq("aktif", true);

    if (existingError) throw existingError;

    if (existingRentals && existingRentals.length > 0) {
      return {
        success: false,
        message:
          "Bu kitabı zaten ödünç aldınız ve henüz iade etmediniz veya onay bekliyor.",
      };
    }

    // 2. Kullanıcının aktif (onaylanmış) kiralama sayısını kontrol et
    const { count, error: countError } = await supabase
      .from("kiralamalar")
      .select("*", { count: "exact", head: true })
      .eq("kullanici_id", user_id)
      .is("teslim_edilme_tarihi", null);
    // .eq("aktif", true);

    if (countError) throw countError;

    if (count !== null && count >= 5) {
      return {
        success: false,
        message: "En fazla 5 aktif kitap ödünç alabilirsiniz.",
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

    // 4. Kiralama kaydını oluştur (aktif: false -> onay bekliyor)
    const { error: rentError } = await supabase.from("kiralamalar").insert([
      {
        kullanici_id: user_id,
        kitap_id: book_id,
        kiralama_tarihi: new Date().toISOString(),
        teslim_edilme_tarihi: null,
        son_teslim_tarihi: return_date.toISOString(),
        aktif: false, // ❗ Onay bekliyor
      },
    ]);

    if (rentError) throw rentError;

    return {
      success: true,
      message: "Kiralama talebiniz alındı, onay bekliyor.",
    };
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
    .is("teslim_edilme_tarihi", null) // sadece teslim edilmemişleri say
    .eq("aktif", true);

  if (error) {
    console.error(
      "Aktif (veya bekleyen) kiralama sayısı alınamadı:",
      error.message
    );
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
       kitaplar(id, kitap_adi, yayinevleri:yayinevi_id(isim))`
    )
    .eq("kitap_id", bookId)
    .order("kiralama_tarihi", { ascending: false })
    .eq("aktif", true);

  if (error) throw error;

  const normalized = (data ?? []).map((rental) => ({
    ...rental,
    kullanicilar: Array.isArray(rental.kullanicilar)
      ? rental.kullanicilar[0]
      : rental.kullanicilar,
  }));

  return normalized;
};
