import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function inserirChamado(dados: {
  cliente_nome: string
  cliente_whatsapp: string
  problema: string
}) {
  const { data, error } = await supabaseAdmin
    .from('chamados')
    .insert([dados])
    .select()
    .single()

  if (error) throw error
  return data
}

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
