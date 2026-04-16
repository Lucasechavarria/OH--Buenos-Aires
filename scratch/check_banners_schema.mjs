
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envLocal = fs.readFileSync('.env.local', 'utf-8')
const getVar = (name) => {
  const match = envLocal.match(new RegExp(`${name}=(.*)`))
  return match ? match[1].trim() : null
}

const supabaseUrl = getVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkBanners() {
  const { data, error } = await supabase.from('banners').select('*').limit(1)
  if (error) {
    console.log('Error or table might not exist:', error.message)
  } else {
    console.log('Columns in banners:', Object.keys(data[0] || {}))
  }
}

checkBanners()
