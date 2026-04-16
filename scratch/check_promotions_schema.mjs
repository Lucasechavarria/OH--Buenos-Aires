
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envLocal = fs.readFileSync('.env.local', 'utf-8')
const getVar = (name) => {
  const match = envLocal.match(new RegExp(`${name}=(.*)`))
  return match ? match[1].trim() : null
}

const supabaseUrl = getVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  try {
    const { data, error } = await supabase.from('promotions').select('*').limit(1)
    if (error) {
      console.error('Error fetching promotions:', error)
    } else {
      console.log('Columns in promotions:', Object.keys(data[0] || {}))
    }
  } catch (err) {
    console.error('Crash:', err)
  }
}

checkSchema()
