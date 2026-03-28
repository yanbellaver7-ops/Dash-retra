import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getVendas() {
  const { data, error } = await supabase
    .from('vendas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return null
  return data
}

export async function getVendasPorEstado() {
  const { data, error } = await supabase
    .from('vendas')
    .select('estado, valor')
    .eq('status', 'paid')

  if (error) return null
  return data
}
