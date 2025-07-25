// categoryService.ts
import { supabase } from "../lib/supabaseClient";

export interface Category {
  id: string;
  ad: string;
}

// Kategorileri getir
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("kategoriler").select("id, ad");

  if (error) {
    console.error("Kategori verisi alınamadı:", error.message);
    return [];
  }

  return data || [];
};

// Kullanıcının daha önce iade ettiği kitapların kategori bilgileriyle listesi
export const fetchUserReadStats = async (userId: string) => {
  const { data, error } = await supabase
    .from("kiralamalar")
    .select("kitaplar(kategori_id, kitap_adi)")
    .eq("kullanici_id", userId)
    .not("teslim_edilme_tarihi", "is", null);

  if (error) {
    console.error("İstatistik verisi alınamadı:", error.message);
    return [];
  }

  return data || [];
};
