import { supabase } from "../lib/supabaseClient";
import {
  type Tur,
  type Kategori,
  type Yazar,
  type Yayinevi,
  type Kitap,
} from "./bookTypeService";

export async function fetchBookByName(name: string): Promise<Kitap | null> {
  const { data, error } = await supabase
    .from("kitaplar")
    .select("*")
    .ilike("kitap_adi", `%${name}%`)
    .limit(1); // en fazla 1 sonuç getir

  if (error) throw error;
  return data?.[0] ?? null; // varsa ilk kitabı döndür
}

export async function fetchAuthorById(yazarId: string): Promise<string> {
  const { data, error } = await supabase
    .from("yazarlar")
    .select("isim")
    .eq("id", yazarId)
    .single();

  if (error) throw error;
  return data?.isim ?? "Bilinmiyor";
}

export async function rentBook(
  userId: string,
  kitapId: string,
  teslimTarihi: Date
): Promise<void> {
  const { error } = await supabase.from("kiralamalar").insert([
    {
      kullanici_id: userId,
      kitap_id: kitapId,
      kiralama_tarihi: new Date().toISOString(),
      son_teslim_tarihi: teslimTarihi.toISOString(),
    },
  ]);

  if (error) throw error;

  // stok azaltma
  await supabase.rpc("stok_azalt", { kitap_id_input: kitapId });
}
