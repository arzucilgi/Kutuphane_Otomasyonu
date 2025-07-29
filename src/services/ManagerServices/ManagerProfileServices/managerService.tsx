import { supabase } from "../../../lib/supabaseClient";

export const fetchManagerByEmail = async (id: string) => {
  const { data, error } = await supabase
    .from("yoneticiler")
    .select("*")
    .eq("id", id)
    .single(); // yalnızca tek bir kayıt bekliyoruz

  if (error) throw error;
  return data;
};
