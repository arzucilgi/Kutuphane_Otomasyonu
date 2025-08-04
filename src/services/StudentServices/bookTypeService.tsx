export type Tur = { id: string; ad: string };
export type Kategori = { id: string; ad: string };
export type Yazar = { id: string; isim: string };
export type Yayinevi = { id: string; isim: string };
export type Raf = { id: string; raf_no: string; kategori_id: string };

export type Kitap = {
  id: string;
  kitap_adi: string;
  sayfa_sayisi: number | null;
  stok_adedi: number | null;
  kapak_url: string | undefined;
  ozet: string | null;
  kategori_id: string | null;
  kategori?: Kategori;
  yayinevi_id?: string | null;
  yayinevi?: Yayinevi;
  yazar_id?: string | null;
  yazar?: Yazar;
  eklenme_tarihi?: string;
  tur_id?: string;
  raf_id?: string;
  raf?: Raf;
};

export interface Comment {
  id: string;
  kullanici_id: string;
  kitap_id: string;
  yorum: string;
  puan: number;
  tarih: string;
}

export interface Kiralama {
  id: string;
  kiralama_tarihi: string;
  teslim_edilme_tarihi: string;
  son_teslim_tarihi: string;
  kullanicilar: {
    ad_soyad: string;
    eposta: string;
  };
  kitaplar: {
    id: string;
    kitap_adi: string;
    yayinevleri: { isim: string }[];
  }[];
}
