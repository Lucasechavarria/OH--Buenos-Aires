const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://sjtxyfmyrwufkszmzjtp.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testDelete() {
  const { data, error } = await supabase.from('brands').delete().eq('name', 'Acai');
  console.log('Error:', error);
}

testDelete();
