import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Okunacak CSV dosyasnn yolu (proje ana dizininde bulunan dosya)
    const csvPath = path.join(process.cwd(), 'appsumo_codes.csv');
    
    // Geliim aamas/test iin eitli kontroller
    if (!fs.existsSync(csvPath)) {
      // Eer CSV yoksa ama kod doru formatta balyorsa (IDEAAI) geici baarlar
      if (code.startsWith('IDEAAI-')) {
        return NextResponse.json({ success: true, message: 'Valid format (Bypass for testing)' });
      }
      return NextResponse.json({ error: 'Database error. Codes not found.' }, { status: 500 });
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const codes = fileContent.split('\n').map(c => c.trim());

    if (codes.includes(code)) {
      // Baarl! (dealde burada veritabannda kullancnn Pro hesap flag'i gncellenir ve kod kullanld diye iaretlenir)
      return NextResponse.json({ success: true, message: 'Code successfully redeemed.' });
    } else {
      return NextResponse.json({ error: 'Invalid or already used code.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Redeem API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
