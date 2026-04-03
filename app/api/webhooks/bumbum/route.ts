import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const APPROVED = ['paid', 'approved']

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()

    const venda = {
      payt_order_id: body.order_id,
      cliente_nome: body.customer?.name,
      cliente_email: body.customer?.email,
      cliente_cpf: body.customer?.document || body.customer?.cpf || null,
      valor: body.amount / 100,
      status: body.status,
      produto_nome: body.product?.name || 'Bumbum',
      estado: body.customer?.address?.state,
      created_at: body.created_at || new Date().toISOString(),
    }

    const { data: vendaExistente } = await supabase
      .from('vendas')
      .select('status')
      .eq('payt_order_id', body.order_id)
      .single()

    const { error } = await supabase
      .from('vendas')
      .upsert(venda, { onConflict: 'payt_order_id' })

    if (error) throw error

    // Deduz estoque Bumbum apenas quando aprovado pela primeira vez
    const eraAprovada = vendaExistente && APPROVED.includes(vendaExistente.status)
    const agoraAprovada = APPROVED.includes(body.status)

    if (agoraAprovada && !eraAprovada) {
      const quantidade = body.quantity ?? 1
      await supabase.rpc('ajustar_estoque_bumbum', { delta: -quantidade })
      await supabase.from('estoque_movimentos').insert({
        tipo: 'saida',
        quantidade,
        produto: 'bumbum',
        descricao: `Venda #${body.order_id?.slice(0, 8).toUpperCase()} — ${body.customer?.name || 'Cliente'}`,
      })
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook Bumbum error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
