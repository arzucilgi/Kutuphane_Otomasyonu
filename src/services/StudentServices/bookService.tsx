import { supabase } from "../../lib/supabaseClient";

import {
  type Tur,
  type Kategori,
  type Yazar,
  type Yayinevi,
  type Raf,
  type Kitap,
} from "./bookTypeService";

// Türleri getir
export async function fetchTurler(): Promise<Tur[]> {
  const { data, error } = await supabase.from("kitap_turleri").select("id, ad");
  if (error) throw error;
  return data ?? [];
}

// Kategorileri getir
export async function fetchKategoriler(): Promise<Kategori[]> {
  const { data, error } = await supabase.from("kategoriler").select("id, ad");
  if (error) throw error;
  return data ?? [];
}

// Yazarları getir
export async function fetchYazarlar(): Promise<Yazar[]> {
  const { data, error } = await supabase.from("yazarlar").select("id, isim");
  if (error) throw error;
  return data ?? [];
}

// Yayinevlerini getir
export async function fetchYayinevleri(): Promise<Yayinevi[]> {
  const { data, error } = await supabase.from("yayinevleri").select("id, isim");
  if (error) throw error;
  return data ?? [];
}

// Rafları getir
export async function fetchRaflar(): Promise<Raf[]> {
  const { data, error } = await supabase.from("raflar").select("id, raf_no");
  if (error) throw error;
  console.log("rafDAta", data);

  return data ?? [];
}

// Kitapları filtreleyerek getir
type KitapFilter = {
  turId?: string;
  kategoriId?: string;
  yazarId?: string;
  search?: string;
};

export async function fetchKitaplar(
  filter: KitapFilter = {}
): Promise<Kitap[]> {
  let query = supabase
    .from("kitaplar")
    .select(
      "id, kitap_adi, sayfa_sayisi, stok_adedi, kapak_url, ozet, kategori_id, eklenme_tarihi, yayinevi_id, yazar_id, tur_id, raf_id "
    );

  if (filter.turId) query = query.eq("tur_id", filter.turId);
  if (filter.kategoriId) query = query.eq("kategori_id", filter.kategoriId);
  if (filter.yazarId) query = query.eq("yazar_id", filter.yazarId);
  if (filter.search) query = query.ilike("kitap_adi", `%${filter.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
