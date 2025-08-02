import { supabase } from "../lib/supabaseClient";

export const registerUser = async (
  ad_soyad: string,
  email: string,
  password: string
) => {
  try {
    // Supabase auth ile kullanıcıyı oluştur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ad_soyad,
          rol: "ogrenci",
        },
      },
    });

    if (error) throw new Error(error.message);

    if (!data.user) throw new Error("Kullanıcı oluşturulamadı.");

    // Kullanıcıyı kullanicilar tablosuna da ekle
    const { error: insertError } = await supabase.from("kullanicilar").insert([
      {
        id: data.user.id,
        ad_soyad,
        eposta: email,
        rol: "ogrenci",
      },
    ]);

    if (insertError) {
      console.error("Auth başarılı ancak veri ekleme hatası:", insertError);
      return {
        success: false,
        message: "Kayıt başarılı fakat veri eklenemedi.",
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};
