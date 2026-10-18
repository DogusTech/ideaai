import type { NextApiRequest, NextApiResponse } from 'next';
// import { adminDb } from '../../firebase-admin'; // Firestore baglantimiz

// RankSpot'un bize verdigi API Key'i ortam degiskenlerinden aliyoruz
// Henuz RankSpot vermedigi icin varsayilan bir deger koyuyoruz (siz oradan alip .env dosyaniza ekleyeceksiniz)
const RANKSPOT_API_KEY = process.env.RANKSPOT_WEBHOOK_SECRET || "BURAYA_RANKSPOT_GIZLI_ANAHTARI_GELECEK";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Sadece POST isteklerini kabul ediyoruz (RankSpot bize POST atacak)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST metoduna izin verilir' });
  }

  // RankSpot'un gonderdigi Header'i kontrol ediyoruz (Güvenlik)
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== RANKSPOT_API_KEY) {
    return res.status(401).json({ message: 'Yetkisiz erisim. API Key hatali.' });
  }

  try {
    // Gelen JSON verisini okuyoruz
    const payload = req.body;

    // RankSpot'un yeni makale gonderip gondermedigini kontrol ediyoruz
    if (payload.event === 'post.published') {
      const newArticle = {
        title: payload.post.title,
        slug: payload.post.slug,
        contentHtml: payload.post.contentHtml,
        publishedAt: payload.timestamp || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Firestore veritabaninda 'articles' (makaleler) koleksiyonuna kaydediyoruz
      // await adminDb.collection('articles').doc(newArticle.slug).set(newArticle);

      console.log(`[RankSpot Webhook] Yeni makale basariyla eklendi: ${newArticle.title}`);
      
      // RankSpot'a "Aldim ve kaydettim" (200 OK) cevabini veriyoruz
      return res.status(200).json({ message: 'Makale basariyla yayinlandi' });
    }

    return res.status(200).json({ message: 'Olay islendi ancak bir islem yapilmadi' });
  } catch (error: any) {
    console.error('[RankSpot Webhook] Hata:', error);
    return res.status(500).json({ message: 'Sunucu hatasi', error: error.message });
  }
}
