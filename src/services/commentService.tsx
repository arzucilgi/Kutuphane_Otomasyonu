import { supabase } from "../lib/supabaseClient";
import type { Comment } from "../services/bookTypeService";

export const fetchReviewsByBookId = async (bookId: string) => {
  const { data, error } = await supabase
    .from("yorumlar")
    .select("*")
    .eq("kitap_id", bookId)
    .order("tarih", { ascending: false });

  if (error) throw error;
  return data as Comment[];
};

export const addReview = async (review: Omit<Comment, "id">) => {
  const { data, error } = await supabase.from("yorumlar").insert([
    {
      kullanici_id: review.kullanici_id,
      kitap_id: review.kitap_id,
      yorum: review.yorum,
      puan: review.puan,
      tarih: review.tarih,
    },
  ]);

  if (error) throw error;
  return data;
};

export const updateReview = async (
  reviewId: string,
  updatedFields: Partial<Comment>
) => {
  const { data, error } = await supabase
    .from("yorumlar")
    .update(updatedFields)
    .eq("id", reviewId);

  if (error) throw error;
  return data;
};

export const fetchAverageRatingByBookId = async (bookId: string) => {
  const { data, error } = await supabase
    .from("yorumlar")
    .select("puan")
    .eq("kitap_id", bookId);

  if (error) throw error;

  const ratings = data.map((d) => d.puan);
  const average =
    ratings.length > 0
      ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length
      : 0;

  return average;
};
