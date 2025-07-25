import { supabase } from "../lib/supabaseClient";

export const toggleFavoriteBook = async (user_id: string, book_id: string) => {
  try {
    // Favori kayıtlarını kontrol et
    const { data: existingFavorites, error: fetchError } = await supabase
      .from("favoriler")
      .select("id")
      .eq("kullanici_id", user_id)
      .eq("kitap_id", book_id);

    if (fetchError) throw fetchError;

    if (existingFavorites && existingFavorites.length > 0) {
      // Zaten favoriyse => kaldır
      const { error: deleteError } = await supabase
        .from("favoriler")
        .delete()
        .eq("kullanici_id", user_id)
        .eq("kitap_id", book_id);

      if (deleteError) throw deleteError;

      return { success: true, status: "removed" };
    } else {
      // Favori değilse => ekle
      const { error: insertError } = await supabase.from("favoriler").insert([
        {
          kullanici_id: user_id,
          kitap_id: book_id,
        },
      ]);

      if (insertError) throw insertError;

      return { success: true, status: "added" };
    }
  } catch (error: any) {
    console.error("toggleFavoriteBook error:", error.message);
    return { success: false, message: "Favorileme işlemi başarısız oldu." };
  }
};

export const fetchUserFavorites = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("favoriler")
      .select("kitap_id")
      .eq("kullanici_id", user_id);

    if (error) throw error;

    return data.map((fav) => fav.kitap_id);
  } catch (error: any) {
    console.error("fetchUserFavorites error:", error.message);
    return [];
  }
};
