import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Tipos para o banco de dados
export interface TestResult {
  id?: string
  user_email: string
  user_name?: string
  iq_score: number
  correct_answers: number
  total_questions: number
  category_scores: {
    logica: { correct: number; total: number }
    matematica: { correct: number; total: number }
    verbal: { correct: number; total: number }
    espacial: { correct: number; total: number }
    memoria: { correct: number; total: number }
  }
  answers: number[]
  created_at?: string
  paid: boolean
  order_id?: string
}

export interface PaymentRecord {
  id?: string
  orderId: string
  customerEmail: string
  customerName: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  gateway: 'kiwify' | 'pagseguro'
  testData?: any
  created_at?: string
  updated_at?: string
}

// Função para salvar resultado do teste
export async function saveTestResult(result: TestResult) {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert([result])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao salvar resultado:', error)
    return { data: null, error }
  }
}

// Função para buscar resultados de um usuário
export async function getUserResults(email: string) {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar resultados:', error)
    return { data: null, error }
  }
}

// Função para atualizar status de pagamento
export async function updatePaymentStatus(orderId: string, paid: boolean) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        status: paid ? 'paid' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error)
    return { data: null, error }
  }
}

// Função para criar registro de pagamento
export async function createPaymentRecord(payment: {
  orderId: string
  customerEmail: string
  customerName: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  gateway: 'kiwify' | 'pagseguro'
  testData?: any
}) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        order_id: payment.orderId,
        customer_email: payment.customerEmail,
        customer_name: payment.customerName,
        amount: payment.amount,
        status: payment.status,
        gateway: payment.gateway,
        test_data: payment.testData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao criar registro de pagamento:', error)
    return { data: null, error }
  }
}

// Função para buscar pagamento por order_id
export async function getPaymentByOrderId(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return { data: null, error }
  }
}
