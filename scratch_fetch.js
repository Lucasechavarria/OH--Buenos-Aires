const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://sjtxyfmyrwufkszmzjtp.supabase.co", "sb_publishable_cccNfTSoX3yR77WpTB9_rQ_pzKPcY9D");

supabase.from('brands').select('name').then(({data, error}) => {
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
});
