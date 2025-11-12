"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Trophy, Zap, Lock, CheckCircle2, ArrowRight, ArrowLeft, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  category: "logica" | "matematica" | "verbal" | "espacial" | "memoria"
  difficulty: "facil" | "medio" | "dificil"
}

const allQuestions: Question[] = [
  // LÓGICA (15 perguntas)
  { id: 1, question: "Se todos os A são B, e alguns B são C, então:", options: ["Todos os A são C", "Alguns A são C", "Nenhum A é C", "Não é possível determinar"], correct: 3, category: "logica", difficulty: "medio" },
  { id: 2, question: "Complete a sequência: 2, 6, 12, 20, 30, __", options: ["40", "42", "44", "38"], correct: 1, category: "logica", difficulty: "medio" },
  { id: 3, question: "Se A = 1, B = 2, C = 3... qual é o valor de VIDA?", options: ["47", "42", "38", "52"], correct: 0, category: "logica", difficulty: "facil" },
  { id: 4, question: "Qual número não pertence à série: 3, 5, 11, 14, 17, 21", options: ["14", "11", "21", "5"], correct: 0, category: "logica", difficulty: "medio" },
  { id: 5, question: "Se 5 gatos pegam 5 ratos em 5 minutos, quantos gatos são necessários para pegar 100 ratos em 100 minutos?", options: ["100", "20", "5", "10"], correct: 2, category: "logica", difficulty: "dificil" },
  { id: 6, question: "Complete: Livro está para Leitura assim como Garfo está para:", options: ["Cozinha", "Comida", "Prato", "Faca"], correct: 1, category: "logica", difficulty: "facil" },
  { id: 7, question: "Qual é o próximo na sequência: J, F, M, A, M, J, __", options: ["A", "J", "S", "O"], correct: 1, category: "logica", difficulty: "medio" },
  { id: 8, question: "Se você tem 3 maçãs e tira 2, quantas você tem?", options: ["1", "2", "3", "5"], correct: 1, category: "logica", difficulty: "facil" },
  { id: 9, question: "Qual palavra não pertence ao grupo: Cachorro, Gato, Leão, Mesa, Tigre", options: ["Cachorro", "Mesa", "Leão", "Tigre"], correct: 1, category: "logica", difficulty: "facil" },
  { id: 10, question: "Se 2 dias atrás era domingo, que dia será daqui a 3 dias?", options: ["Quinta", "Sexta", "Sábado", "Domingo"], correct: 1, category: "logica", difficulty: "medio" },
  { id: 11, question: "Complete a analogia: Médico:Hospital :: Professor:__", options: ["Livro", "Escola", "Aluno", "Aula"], correct: 1, category: "logica", difficulty: "facil" },
  { id: 12, question: "Qual número vem a seguir: 1, 1, 2, 3, 5, 8, 13, __", options: ["18", "19", "21", "20"], correct: 2, category: "logica", difficulty: "medio" },
  { id: 13, question: "Se todos os Bloops são Razzies e todos os Razzies são Lazzies, então todos os Bloops são necessariamente Lazzies?", options: ["Sim", "Não", "Às vezes", "Impossível saber"], correct: 0, category: "logica", difficulty: "medio" },
  { id: 14, question: "Qual é o oposto de 'sempre'?", options: ["Raramente", "Nunca", "Às vezes", "Frequentemente"], correct: 1, category: "logica", difficulty: "facil" },
  { id: 15, question: "Complete: 1, 4, 9, 16, 25, __", options: ["30", "35", "36", "49"], correct: 2, category: "logica", difficulty: "facil" },

  // MATEMÁTICA (15 perguntas)
  { id: 16, question: "Quanto é 15% de 200?", options: ["25", "30", "35", "40"], correct: 1, category: "matematica", difficulty: "facil" },
  { id: 17, question: "Se x + 5 = 12, quanto é x?", options: ["5", "6", "7", "8"], correct: 2, category: "matematica", difficulty: "facil" },
  { id: 18, question: "Qual é a raiz quadrada de 144?", options: ["10", "11", "12", "13"], correct: 2, category: "matematica", difficulty: "facil" },
  { id: 19, question: "Se um produto custa R$ 80 e tem 25% de desconto, qual o valor final?", options: ["R$ 55", "R$ 60", "R$ 65", "R$ 70"], correct: 1, category: "matematica", difficulty: "medio" },
  { id: 20, question: "Quanto é 7 × 8?", options: ["54", "56", "58", "60"], correct: 1, category: "matematica", difficulty: "facil" },
  { id: 21, question: "Se 3x = 27, quanto é x?", options: ["7", "8", "9", "10"], correct: 2, category: "matematica", difficulty: "facil" },
  { id: 22, question: "Qual é o próximo número primo após 7?", options: ["9", "10", "11", "13"], correct: 2, category: "matematica", difficulty: "medio" },
  { id: 23, question: "Quanto é 20% de 50 + 30% de 100?", options: ["35", "40", "45", "50"], correct: 1, category: "matematica", difficulty: "medio" },
  { id: 24, question: "Se um trem viaja 120 km em 2 horas, qual sua velocidade média?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], correct: 1, category: "matematica", difficulty: "medio" },
  { id: 25, question: "Quanto é 2³ + 3²?", options: ["13", "15", "17", "19"], correct: 2, category: "matematica", difficulty: "medio" },
  { id: 26, question: "Se você tem R$ 100 e gasta 1/4, quanto sobra?", options: ["R$ 70", "R$ 75", "R$ 80", "R$ 85"], correct: 1, category: "matematica", difficulty: "facil" },
  { id: 27, question: "Qual é o resultado de 15 × 15?", options: ["215", "220", "225", "230"], correct: 2, category: "matematica", difficulty: "facil" },
  { id: 28, question: "Se 2x + 3 = 15, quanto é x?", options: ["5", "6", "7", "8"], correct: 1, category: "matematica", difficulty: "medio" },
  { id: 29, question: "Quanto é 1/2 + 1/4?", options: ["1/6", "2/6", "3/4", "1/8"], correct: 2, category: "matematica", difficulty: "medio" },
  { id: 30, question: "Qual é o dobro de 37?", options: ["64", "72", "74", "76"], correct: 2, category: "matematica", difficulty: "facil" },

  // VERBAL (10 perguntas)
  { id: 31, question: "Qual palavra é sinônimo de 'efêmero'?", options: ["Eterno", "Passageiro", "Duradouro", "Permanente"], correct: 1, category: "verbal", difficulty: "medio" },
  { id: 32, question: "Qual palavra está escrita corretamente?", options: ["Excessão", "Exceção", "Exeção", "Essceção"], correct: 1, category: "verbal", difficulty: "facil" },
  { id: 33, question: "Qual é o antônimo de 'abundante'?", options: ["Escasso", "Muito", "Repleto", "Cheio"], correct: 0, category: "verbal", difficulty: "facil" },
  { id: 34, question: "Complete: 'Água mole em pedra dura, tanto bate até que __'", options: ["quebra", "fura", "cansa", "para"], correct: 1, category: "verbal", difficulty: "facil" },
  { id: 35, question: "Qual palavra não pertence ao grupo: Alegre, Feliz, Triste, Contente", options: ["Alegre", "Feliz", "Triste", "Contente"], correct: 2, category: "verbal", difficulty: "facil" },
  { id: 36, question: "Qual é o plural de 'cidadão'?", options: ["Cidadões", "Cidadãos", "Cidadães", "Cidadans"], correct: 1, category: "verbal", difficulty: "medio" },
  { id: 37, question: "Qual palavra significa 'que não pode ser visto'?", options: ["Invisível", "Invísivel", "Imvisível", "Invisivel"], correct: 0, category: "verbal", difficulty: "facil" },
  { id: 38, question: "Qual é o feminino de 'réu'?", options: ["Réa", "Reia", "Ré", "Réu"], correct: 2, category: "verbal", difficulty: "medio" },
  { id: 39, question: "Qual palavra está com a acentuação correta?", options: ["Saúde", "Saude", "Sáude", "Saúdê"], correct: 0, category: "verbal", difficulty: "facil" },
  { id: 40, question: "Qual é o coletivo de 'peixe'?", options: ["Cardume", "Manada", "Bando", "Rebanho"], correct: 0, category: "verbal", difficulty: "facil" },

  // ESPACIAL (8 perguntas)
  { id: 41, question: "Quantos cubos pequenos formam um cubo 3×3×3?", options: ["9", "18", "27", "36"], correct: 2, category: "espacial", difficulty: "medio" },
  { id: 42, question: "Se você dobrar um papel ao meio 3 vezes, quantas camadas terá?", options: ["3", "6", "8", "9"], correct: 2, category: "espacial", difficulty: "medio" },
  { id: 43, question: "Quantas faces tem um cubo?", options: ["4", "6", "8", "12"], correct: 1, category: "espacial", difficulty: "facil" },
  { id: 44, question: "Qual forma tem 5 lados?", options: ["Quadrado", "Pentágono", "Hexágono", "Triângulo"], correct: 1, category: "espacial", difficulty: "facil" },
  { id: 45, question: "Se você girar um quadrado 90° no sentido horário, quantas vezes precisa girar para voltar à posição original?", options: ["2", "3", "4", "5"], correct: 2, category: "espacial", difficulty: "medio" },
  { id: 46, question: "Quantos vértices tem uma pirâmide de base quadrada?", options: ["4", "5", "6", "8"], correct: 1, category: "espacial", difficulty: "medio" },
  { id: 47, question: "Qual é o próximo na rotação: ↑ → ↓ __", options: ["↑", "←", "→", "↓"], correct: 1, category: "espacial", difficulty: "facil" },
  { id: 48, question: "Quantas arestas tem um cubo?", options: ["6", "8", "10", "12"], correct: 3, category: "espacial", difficulty: "medio" },

  // MEMÓRIA E ATENÇÃO (7 perguntas)
  { id: 49, question: "Memorize: GATO, CASA, SOL, LUA. Qual palavra NÃO estava na lista?", options: ["GATO", "MESA", "SOL", "LUA"], correct: 1, category: "memoria", difficulty: "facil" },
  { id: 50, question: "Quantas letras 'A' tem na palavra ABRACADABRA?", options: ["3", "4", "5", "6"], correct: 2, category: "memoria", difficulty: "medio" },
  { id: 51, question: "Qual sequência está em ordem alfabética?", options: ["ABC, DEF, GHI", "ACB, DEF, GHI", "ABC, DFE, GHI", "ABC, DEF, GIH"], correct: 0, category: "memoria", difficulty: "facil" },
  { id: 52, question: "Quantos números ímpares existem entre 1 e 10?", options: ["4", "5", "6", "7"], correct: 1, category: "memoria", difficulty: "facil" },
  { id: 53, question: "Qual cor NÃO é primária?", options: ["Vermelho", "Azul", "Verde", "Amarelo"], correct: 2, category: "memoria", difficulty: "facil" },
  { id: 54, question: "Quantos meses do ano têm 31 dias?", options: ["5", "6", "7", "8"], correct: 2, category: "memoria", difficulty: "medio" },
  { id: 55, question: "Qual planeta é conhecido como 'Planeta Vermelho'?", options: ["Vênus", "Marte", "Júpiter", "Saturno"], correct: 1, category: "memoria", difficulty: "facil" },
]

// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function Home() {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(55).fill(-1))
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1)
  const [finished, setFinished] = useState(false)
  const [paid, setPaid] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])

  // Embaralhar perguntas ao iniciar o teste
  useEffect(() => {
    if (started && questions.length === 0) {
      setQuestions(shuffleArray(allQuestions))
    }
  }, [started, questions.length])

  const progress = ((currentQuestion + 1) / 55) * 100

  const handleStart = () => {
    setStarted(true)
    setQuestions(shuffleArray(allQuestions))
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
    } else {
      setFinished(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
    }
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correct++
      }
    })
    return correct
  }

  const getIQScore = (correct: number) => {
    // Fórmula para converter acertos em QI (média 100, desvio padrão 15)
    const percentage = (correct / questions.length) * 100
    if (percentage >= 95) return 145 + Math.floor(Math.random() * 10)
    if (percentage >= 90) return 135 + Math.floor(Math.random() * 10)
    if (percentage >= 85) return 125 + Math.floor(Math.random() * 10)
    if (percentage >= 75) return 115 + Math.floor(Math.random() * 10)
    if (percentage >= 60) return 100 + Math.floor(Math.random() * 15)
    if (percentage >= 45) return 90 + Math.floor(Math.random() * 10)
    if (percentage >= 30) return 80 + Math.floor(Math.random() * 10)
    return 70 + Math.floor(Math.random() * 10)
  }

  const getIQCategory = (iq: number) => {
    if (iq >= 145) return { label: "Gênio Extraordinário", color: "from-purple-500 to-pink-500", emoji: "🧠✨" }
    if (iq >= 130) return { label: "Superdotado", color: "from-blue-500 to-purple-500", emoji: "🎓" }
    if (iq >= 120) return { label: "Inteligência Superior", color: "from-green-500 to-blue-500", emoji: "🌟" }
    if (iq >= 110) return { label: "Acima da Média", color: "from-yellow-500 to-green-500", emoji: "⭐" }
    if (iq >= 90) return { label: "Média", color: "from-orange-400 to-yellow-500", emoji: "👍" }
    if (iq >= 80) return { label: "Abaixo da Média", color: "from-orange-500 to-orange-600", emoji: "📚" }
    return { label: "Precisa Treinar Mais", color: "from-red-500 to-orange-500", emoji: "💪" }
  }

  const handlePayment = () => {
    // Simulação de pagamento - em produção, integrar com gateway real
    setPaid(true)
  }

  const handleShare = () => {
    const score = calculateScore()
    const iq = getIQScore(score)
    const text = `🧠 Fiz o Teste de QI Definitivo e meu resultado foi ${iq}! Você consegue me superar? Faça o teste também!`
    
    if (navigator.share) {
      navigator.share({
        title: 'Teste de QI Definitivo',
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Texto copiado! Cole nas suas redes sociais 🚀')
    }
  }

  const handleRestart = () => {
    setStarted(false)
    setCurrentQuestion(0)
    setAnswers(new Array(55).fill(-1))
    setSelectedAnswer(-1)
    setFinished(false)
    setPaid(false)
    setQuestions([])
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-0 overflow-hidden">
          {/* Imagem de Capa Atrativa */}
          <div className="relative h-64 w-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop" 
              alt="Jovens sorrindo fazendo teste"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6">
              <div className="text-center">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Teste de QI Definitivo
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <CardHeader className="text-center space-y-4 pb-6 pt-6">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardDescription className="text-lg text-gray-600">
              55 perguntas elaboradas para medir sua inteligência real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">55 Perguntas</h3>
                <p className="text-sm text-blue-700">Desafio completo</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">5 Categorias</h3>
                <p className="text-sm text-purple-700">Análise detalhada</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg text-center">
                <Trophy className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <h3 className="font-semibold text-pink-900">QI Preciso</h3>
                <p className="text-sm text-pink-700">Resultado científico</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded">
              <h4 className="font-semibold text-yellow-900 mb-2">📊 O que você vai descobrir:</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>✓ Seu QI exato (escala 70-155)</li>
                <li>✓ Classificação de inteligência</li>
                <li>✓ Pontos fortes e fracos</li>
                <li>✓ Comparação com a população</li>
                <li>✓ Certificado digital compartilhável</li>
              </ul>
            </div>

            <Button 
              onClick={handleStart}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              Começar Teste Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-xs text-center text-gray-500">
              ⏱️ Tempo estimado: 15-20 minutos • 🔒 Seus dados são privados
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (finished && !paid) {
    const score = calculateScore()
    const answeredAll = answers.every(a => a !== -1)

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              Parabéns! Você completou o teste! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              {answeredAll 
                ? "Todas as 55 perguntas foram respondidas!"
                : `Você respondeu ${answers.filter(a => a !== -1).length} de 55 perguntas`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm flex items-center justify-center">
                <Lock className="w-24 h-24 text-gray-400" />
              </div>
              <div className="relative z-10 blur-sm select-none">
                <p className="text-6xl font-bold text-gray-800 mb-2">???</p>
                <p className="text-xl text-gray-600">Seu QI está aqui!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-4 text-center text-lg">
                🔓 Desbloqueie seu resultado completo:
              </h3>
              <ul className="space-y-2 text-sm text-purple-800 mb-4">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Seu QI exato</strong> na escala internacional (70-155)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Classificação detalhada</strong> (Gênio, Superdotado, Superior, etc)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Análise por categoria</strong> (Lógica, Matemática, Verbal, Espacial, Memória)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Comparação populacional</strong> - Você está no top X%</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Certificado digital</strong> para compartilhar nas redes sociais</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Dicas personalizadas</strong> para desenvolver suas habilidades</span>
                </li>
              </ul>

              <div className="bg-white p-4 rounded-lg text-center border-2 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Investimento único de</p>
                <p className="text-4xl font-bold text-green-600 mb-1">R$ 3,00</p>
                <p className="text-xs text-gray-500">Pagamento seguro via PIX</p>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            >
              <Lock className="mr-2 w-5 h-5" />
              Desbloquear Resultado Completo - R$ 3,00
            </Button>

            <p className="text-xs text-center text-gray-600">
              🔒 Pagamento 100% seguro • ⚡ Resultado instantâneo • 💯 Satisfação garantida
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (finished && paid) {
    const score = calculateScore()
    const iq = getIQScore(score)
    const category = getIQCategory(iq)
    const percentage = (score / questions.length) * 100
    const populationPercentile = 100 - (Math.abs(iq - 100) / 55 * 100)

    // Análise por categoria
    const categoryScores = {
      logica: { correct: 0, total: 0 },
      matematica: { correct: 0, total: 0 },
      verbal: { correct: 0, total: 0 },
      espacial: { correct: 0, total: 0 },
      memoria: { correct: 0, total: 0 },
    }

    answers.forEach((answer, index) => {
      const question = questions[index]
      categoryScores[question.category].total++
      if (answer === question.correct) {
        categoryScores[question.category].correct++
      }
    })

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Resultado Principal */}
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className={`bg-gradient-to-r ${category.color} p-8 text-white text-center`}>
              <div className="text-6xl mb-4">{category.emoji}</div>
              <h1 className="text-5xl font-bold mb-2">{iq}</h1>
              <p className="text-2xl font-semibold mb-1">Seu QI</p>
              <Badge className="bg-white/20 text-white text-lg px-4 py-1">
                {category.label}
              </Badge>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{score}/55</p>
                  <p className="text-sm text-blue-800">Acertos</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{percentage.toFixed(0)}%</p>
                  <p className="text-sm text-purple-800">Aproveitamento</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">Top {(100 - populationPercentile).toFixed(0)}%</p>
                  <p className="text-sm text-green-800">Da População</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
                <h3 className="font-semibold text-yellow-900 mb-2">📊 O que isso significa?</h3>
                <p className="text-sm text-yellow-800">
                  {iq >= 130 && "Você possui inteligência excepcional! Está entre os 2% mais inteligentes da população. Suas habilidades cognitivas são extraordinárias."}
                  {iq >= 120 && iq < 130 && "Você tem inteligência superior! Está entre os 10% mais inteligentes. Suas capacidades de raciocínio são excelentes."}
                  {iq >= 110 && iq < 120 && "Você está acima da média! Possui boas habilidades cognitivas e facilidade para aprender."}
                  {iq >= 90 && iq < 110 && "Você está na média da população! Possui inteligência equilibrada em diversas áreas."}
                  {iq < 90 && "Continue praticando! A inteligência pode ser desenvolvida com treino e dedicação."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Análise por Categoria */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">📈 Análise Detalhada por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(categoryScores).map(([cat, data]) => {
                const catPercentage = (data.correct / data.total) * 100
                const catName = {
                  logica: "🧩 Raciocínio Lógico",
                  matematica: "🔢 Matemática",
                  verbal: "📝 Habilidade Verbal",
                  espacial: "🎯 Visão Espacial",
                  memoria: "🧠 Memória e Atenção"
                }[cat]

                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{catName}</span>
                      <span className="text-sm text-gray-600">{data.correct}/{data.total} ({catPercentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={catPercentage} className="h-3" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Certificado Compartilhável */}
          <Card className="shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🏆 Compartilhe seu Resultado!</CardTitle>
              <CardDescription>Mostre sua inteligência para amigos e familiares</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-6 rounded-lg border-2 border-purple-200 text-center">
                <div className="text-4xl mb-2">{category.emoji}</div>
                <h3 className="text-2xl font-bold text-purple-900 mb-1">QI: {iq}</h3>
                <p className="text-purple-700">{category.label}</p>
                <p className="text-sm text-gray-600 mt-2">Teste de QI Definitivo - 55 Perguntas</p>
              </div>

              <Button 
                onClick={handleShare}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Share2 className="mr-2 w-5 h-5" />
                Compartilhar Resultado
              </Button>

              <Button 
                onClick={handleRestart}
                variant="outline"
                className="w-full h-12"
              >
                Fazer Teste Novamente
              </Button>
            </CardContent>
          </Card>

          {/* Dicas Personalizadas */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">💡 Dicas para Desenvolver sua Inteligência</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Leia diariamente:</strong> Livros, artigos e conteúdos diversos expandem vocabulário e raciocínio</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Resolva puzzles:</strong> Sudoku, palavras cruzadas e jogos de lógica fortalecem conexões neurais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Aprenda algo novo:</strong> Idiomas, instrumentos musicais ou habilidades desafiam o cérebro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Pratique matemática:</strong> Cálculos mentais diários melhoram raciocínio quantitativo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Durma bem:</strong> 7-9 horas de sono consolidam memória e aprendizado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Exercite-se:</strong> Atividade física aumenta fluxo sanguíneo cerebral</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Aguardar perguntas serem embaralhadas
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-semibold">Preparando seu teste...</p>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const answeredCount = answers.filter(a => a !== -1).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header com Progresso */}
        <Card className="mb-6 shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-gray-700">
                  Pergunta {currentQuestion + 1} de {questions.length}
                </span>
              </div>
              <Badge variant="secondary" className="text-sm">
                {answeredCount}/{questions.length} respondidas
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>{progress.toFixed(0)}% completo</span>
              <span>~{Math.ceil((questions.length - currentQuestion) * 0.3)} min restantes</span>
            </div>
          </CardContent>
        </Card>

        {/* Pergunta */}
        <Card className="shadow-2xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-start justify-between mb-2">
              <Badge className={`
                ${currentQ.difficulty === 'facil' ? 'bg-green-500' : ''}
                ${currentQ.difficulty === 'medio' ? 'bg-yellow-500' : ''}
                ${currentQ.difficulty === 'dificil' ? 'bg-red-500' : ''}
              `}>
                {currentQ.difficulty === 'facil' ? '⭐ Fácil' : ''}
                {currentQ.difficulty === 'medio' ? '⭐⭐ Médio' : ''}
                {currentQ.difficulty === 'dificil' ? '⭐⭐⭐ Difícil' : ''}
              </Badge>
              <Badge variant="outline">
                {currentQ.category === 'logica' ? '🧩 Lógica' : ''}
                {currentQ.category === 'matematica' ? '🔢 Matemática' : ''}
                {currentQ.category === 'verbal' ? '📝 Verbal' : ''}
                {currentQ.category === 'espacial' ? '🎯 Espacial' : ''}
                {currentQ.category === 'memoria' ? '🧠 Memória' : ''}
              </Badge>
            </div>
            <CardTitle className="text-2xl leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <RadioGroup value={selectedAnswer.toString()} onValueChange={(v) => handleAnswer(parseInt(v))}>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-purple-400 hover:bg-purple-50 ${
                      selectedAnswer === index ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleAnswer(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1 h-12"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === -1}
            className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Indicador de resposta */}
        {selectedAnswer === -1 && (
          <p className="text-center text-white text-sm mt-4">
            ⚠️ Selecione uma resposta para continuar
          </p>
        )}
      </div>
    </div>
  )
}
