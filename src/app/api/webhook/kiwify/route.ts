import { NextRequest, NextResponse } from 'next/server'
import { updatePaymentStatus } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log do webhook recebido (para debug)
    console.log('Webhook Kiwify recebido:', body)
    
    // Validar evento de pagamento aprovado
    if (body.event === 'sale.approved' || body.status === 'paid') {
      const {
        order_id,
        customer_email,
        customer_name,
        product_name,
        amount,
        transaction_id
      } = body
      
      // Atualizar status de pagamento no Supabase
      if (order_id) {
        const { data, error } = await updatePaymentStatus(order_id, true)
        
        if (error) {
          console.error('Erro ao atualizar pagamento no Supabase:', error)
        } else {
          console.log('Pagamento atualizado no Supabase:', data)
        }
      }
      
      console.log('Pagamento aprovado:', {
        order_id,
        customer_email,
        customer_name,
        product_name,
        amount,
        transaction_id
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook processado com sucesso' 
      })
    }
    
    // Outros eventos (sale.refunded, sale.chargeback, etc)
    return NextResponse.json({ 
      success: true, 
      message: 'Evento recebido mas não processado' 
    })
    
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

// Permitir requisições sem autenticação (webhook público)
export const dynamic = 'force-dynamic'
