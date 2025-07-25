import { supabase } from "../lib/supabaseClient";

export const fetchLoggedInUserProfile = async () => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) return null;

    const { data, error } = await supabase
      .from("kullanicilar")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error("fetchLoggedInUserProfile error:", error.message);
    return null;
  }
};

export const fetchBooksRentedByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("kiralamalar")
    .select(
      `
      id,
      kiralama_tarihi,
      son_teslim_tarihi,
      teslim_edilme_tarihi,
      kitaplar (
        kitap_adi,
        yazarlar (
          isim
        )
      )
    `
    )
    .eq("kullanici_id", userId)
    .order("kiralama_tarihi", { ascending: false });

  if (error) {
    console.error("Kitap verisi alınamadı:", error.message);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    kitap_adi: item.kitaplar?.kitap_adi || "Bilinmiyor",
    yazar_adi: item.kitaplar?.yazarlar?.isim || "Bilinmiyor",
    kiralama_tarihi: item.kiralama_tarihi,
    son_teslim_tarihi: item.son_teslim_tarihi,
    teslim_edilme_tarihi: item.teslim_edilme_tarihi,
  }));
};
