// src/services/officerService.ts
import { supabase } from "../lib/supabaseClient";

export const getLoggedInOfficer = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error("Oturum bulunamadı");
  }

  const userId = session.user.id;

  const { data: officerData, error: officerError } = await supabase
    .from("memurlar") // kendi memur tablonuzun adı
    .select("id,ad,soyad,eposta, rol, telefon, olusturulma_tarihi")
    .eq("id", userId)
    .single();

  if (officerError) {
    throw officerError;
  }

  return {
    id: officerData.id,
    name: officerData.ad,
    surname: officerData.soyad,
    title: officerData.rol,
    email: officerData.eposta,
    phone: officerData.telefon,
    created_at: officerData.olusturulma_tarihi,
  };
};
