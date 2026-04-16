const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://sjtxyfmyrwufkszmzjtp.supabase.co", "sb_publishable_cccNfTSoX3yR77WpTB9_rQ_pzKPcY9D");

const files = fs.readdirSync('./public').filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.svg') || f.endsWith('.jpeg'));

async function syncBrands() {
  const { data: existing } = await supabase.from('brands').select('name, logo_url');
  
  const existingUrls = new Set(existing.map(e => e.logo_url));
  const toInsert = [];

  for (const file of files) {
    const fileUrl = `/${file}`;
    if (!existingUrls.has(fileUrl)) {
      // Don't auto-insert floor plans and specific banners
      if (file.toLowerCase().includes('plano') || file.toLowerCase().includes('banner') || file.toLowerCase().includes('woman') || file.toLowerCase().includes('img2')) {
         continue;
      }

      let brandName = file.split('.')[0].replace(/[-_]/g, ' ').replace(/300x300/i, '').replace(/logo/i, '').trim();
      brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
      
      toInsert.push({
        name: brandName,
        logo_url: fileUrl,
        phone: '+54 11 0000-0000',
        google_maps_url: 'https://maps.app.goo.gl/ohbuenosaires'
      });
    }
  }

  if (toInsert.length > 0) {
    const { data, error } = await supabase.from('brands').insert(toInsert);
    if (error) console.error(error);
    else console.log(`Se insertaron ${toInsert.length} marcas nuevas desde public/`);
  } else {
    console.log("No hay marcas nuevas para insertar.");
  }
}

syncBrands();
