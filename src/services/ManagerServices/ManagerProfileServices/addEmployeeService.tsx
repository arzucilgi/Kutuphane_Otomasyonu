// services/employee/addEmployeeService.ts
import { supabase } from "../../../lib/supabaseClient";

interface EmployeeData {
  ad: string;
  soyad: string;
  eposta: string;
  sifre: string;
  telefon?: string;
}

export const addEmployeeService = async (
  data: EmployeeData,
  olusturanYoneticiId: string
) => {
  const { ad, soyad, eposta, sifre, telefon } = data;

  // 1. Auth tablosuna kullanıcı oluştur
  const { data: userData, error: userError } = await supabase.auth.signUp({
    email: eposta,
    password: sifre,
    options: {
      data: {
        ad,
        soyad,
        rol: "memur",
      },
    },
  });

  if (userError || !userData?.user?.id) {
    throw new Error(userError?.message || "Kullanıcı oluşturulamadı.");
  }

  const yeniKullaniciId = userData.user.id;

  // 2. memurlar tablosuna kayıt
  const { error: dbError } = await supabase.from("memurlar").insert({
    id: yeniKullaniciId,
    ad,
    soyad,
    eposta,
    telefon,
    rol: "memur",
    olusturan_yonetici_id: olusturanYoneticiId,
  });

  if (dbError) {
    throw new Error(dbError.message);
  }

  return true;
};
