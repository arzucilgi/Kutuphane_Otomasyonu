import { supabase } from "../../lib/supabaseClient";

// Kullanıcının rolünü hem "kullanicilar" hem de "yoneticiler" tablolarından kontrol eder
export const getUserRoleFromTable = async (
  userId: string
): Promise<string | null> => {
  const { data: kullaniciData, error: kullaniciError } = await supabase
    .from("kullanicilar")
    .select("rol")
    .eq("id", userId)
    .maybeSingle();

  if (kullaniciData && !kullaniciError) {
    return kullaniciData.rol;
  }
  const { data: yoneticiData, error: yoneticiError } = await supabase
    .from("yoneticiler")
    .select("rol")
    .eq("id", userId)
    .maybeSingle();

  if (yoneticiData && !yoneticiError) {
    return yoneticiData.rol;
  }

  // Hiçbir tabloda kullanıcı bulunamazsa
  return null;
};
