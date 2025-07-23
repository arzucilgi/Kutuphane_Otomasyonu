import { supabase } from "../lib/supabaseClient";

import {
  type Tur,
  type Kategori,
  type Yazar,
  type Yayinevi,
  type Kitap,
} from "./bookTypeService";

export async function fetchTurler(): Promise<Tur[]> {
  const { data, error } = await supabase.from("kitap_turleri").select("id, ad");
  if (error) throw error;
  return data ?? [];
}

export async function fetchKategoriler(): Promise<Kategori[]> {
  const { data, error } = await supabase.from("kategoriler").select("id, ad");
  if (error) throw error;
  return data ?? [];
}

export async function fetchYazarlar(): Promise<Yazar[]> {
  const { data, error } = await supabase.from("yazarlar").select("id, isim");
  if (error) throw error;
  return data ?? [];
}

export async function fetchYayinevleri(): Promise<Yayinevi[]> {
  const { data, error } = await supabase.from("yayinevleri").select("id, isim");
  if (error) throw error;
  return data ?? [];
}

type KitapFilter = {
  turId?: string;
  kategoriId?: string;
  search?: string;
};

export async function fetchKitaplar(
  filter: KitapFilter = {}
): Promise<Kitap[]> {
  let query = supabase
    .from("kitaplar")
    .select(
      "id, kitap_adi, sayfa_sayisi, stok_adedi, kapak_url, ozet, kategori_id, eklenme_tarihi, yayinevi_id, yazar_id, tur_id"
    );

  if (filter.turId) query = query.eq("tur_id", filter.turId);
  if (filter.kategoriId) query = query.eq("kategori_id", filter.kategoriId);
  if (filter.search) query = query.ilike("kitap_adi", `%${filter.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
