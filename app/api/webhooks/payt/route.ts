import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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
      valor: body.amount / 100,
      status: body.status,
      produto_nome: body.product?.name,
      estado: body.customer?.address?.state,
      created_at: body.created_at || new Date().toISOString(),
    }

    const { error } = await supabase
      .from('vendas')
      .upsert(venda, { onConflict: 'payt_order_id' })

    if (error) throw error

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
