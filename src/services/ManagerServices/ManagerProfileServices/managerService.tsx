import { supabase } from "../../../lib/supabaseClient";

export const fetchManagerByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("yoneticiler")
    .select("*")
    .eq("eposta", email)
    .single(); // yalnızca tek bir kayıt bekliyoruz

  if (error) throw error;
  return data;
};
