import { supabase } from "../../lib/supabaseClient";

export const fetchMostReadBooksThisWeek = async () => {
  const { data, error } = await supabase.rpc("most_read_books_this_week"); // Buraya bir FUNCTION da tanımlayabilirsin istersen

  if (error) {
    console.error("Haftalık en çok okunan kitaplar alınamadı:", error.message);
    return [];
  }

  return data;
};
