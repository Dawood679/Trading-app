'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getDifficultyColor, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { LearnModule, QuizQuestion } from '@/types'

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const router = useRouter()
  const [module, setModule] = useState<LearnModule & { userProgress: any } | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'content' | 'quiz' | 'results'>('content')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [score, setScore] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/learn')
      .then((r) => r.json())
      .then(({ modules }) => {
        const mod = modules.find((m: any) => m.id === params.moduleId)
        if (mod) setModule(mod)
        else router.push('/learn')
      })
      .finally(() => setLoading(false))
  }, [params.moduleId, router])

  const questions: QuizQuestion[] = module?.quiz?.questions ?? []

  const handleAnswer = (qIdx: number, aIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: aIdx }))
  }

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting')
      return
    }

    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    setSubmitting(true)

    try {
      await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: params.moduleId, score: pct, completed: pct >= 60 }),
      })
    } catch {}

    setSubmitting(false)
    setView('results')
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!module) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link href="/learn" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Center
      </Link>

      {/* Module header */}
      <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-[#3b82f6]" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{module.title}</h1>
            <p className="text-gray-400 text-sm mt-1">{module.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getDifficultyColor(module.difficulty))}>
                {module.difficulty}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {module.duration} min
              </div>
              {module.userProgress?.completed && (
                <span className="flex items-center gap-1 text-xs text-[#00d395]">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed · {module.userProgress.score}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mt-5 pt-4 border-t border-[#1f2937]">
          <button
            onClick={() => setView('content')}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              view === 'content' ? 'bg-[#3b82f6] text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            Content
          </button>
          <button
            onClick={() => setView('quiz')}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              view === 'quiz' ? 'bg-[#3b82f6] text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            Quiz ({questions.length} questions)
          </button>
          {view === 'results' && (
            <button
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-[#00d395] text-[#0f1117]"
            >
              Results
            </button>
          )}
        </div>
      </div>

      {/* Content view */}
      {view === 'content' && (
        <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-6">
          <div
            className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {module.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-white mt-0 mb-4">{line.slice(2)}</h1>
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-white mt-4 mb-2">{line.slice(4)}</h3>
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-white">{line.slice(2, -2)}</p>
              if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-gray-300 list-disc">{line.slice(2)}</li>
              if (line.startsWith('```')) return <div key={i} />
              if (line === '') return <br key={i} />
              return <p key={i} className="text-gray-300">{line}</p>
            })}
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={() => setView('quiz')} className="gap-2">
              Take Quiz
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
        </div>
      )}

      {/* Quiz view */}
      {view === 'quiz' && (
        <div className="space-y-4">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
              <p className="text-sm font-semibold text-white mb-4">
                {qIdx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleAnswer(qIdx, aIdx)}
                    className={cn(
                      'w-full text-left text-sm px-4 py-3 rounded-lg border transition-all',
                      answers[qIdx] === aIdx
                        ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-white'
                        : 'border-[#1f2937] text-gray-400 hover:border-[#374151] hover:text-white'
                    )}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + aIdx)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {Object.keys(answers).length}/{questions.length} answered
            </p>
            <Button onClick={handleSubmitQuiz} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </div>
        </div>
      )}

      {/* Results view */}
      {view === 'results' && (
        <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-8 text-center">
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
            score >= 60 ? 'bg-[#00d395]/20' : 'bg-[#ff4444]/20'
          )}>
            {score >= 60 ? (
              <CheckCircle2 className="w-10 h-10 text-[#00d395]" />
            ) : (
              <XCircle className="w-10 h-10 text-[#ff4444]" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{score}%</h2>
          <p className={cn('text-lg font-medium mb-2', score >= 60 ? 'text-[#00d395]' : 'text-[#ff4444]')}>
            {score >= 80 ? 'Excellent!' : score >= 60 ? 'Passed!' : 'Try Again'}
          </p>
          <p className="text-gray-400 text-sm mb-8">
            {score >= 60
              ? `You answered ${Math.round((score / 100) * questions.length)} out of ${questions.length} questions correctly.`
              : 'You need 60% to pass. Review the content and try again.'}
          </p>

          {/* Answer review */}
          <div className="space-y-3 text-left mb-8">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer
              return (
                <div key={i} className={cn('p-4 rounded-lg border', correct ? 'border-[#00d395]/30 bg-[#00d395]/5' : 'border-[#ff4444]/30 bg-[#ff4444]/5')}>
                  <p className="text-sm font-medium text-white mb-1">{q.question}</p>
                  <p className="text-xs text-gray-400">
                    Correct: <span className="text-[#00d395] font-medium">{q.options[q.answer]}</span>
                    {!correct && <span className="text-[#ff4444]"> · Your answer: {q.options[answers[i]]}</span>}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => { setAnswers({}); setView('quiz') }}>
              Retry Quiz
            </Button>
            <Link href="/learn">
              <Button>Back to Academy</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
