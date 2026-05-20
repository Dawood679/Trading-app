'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, CheckCircle2, Lock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getDifficultyColor, cn } from '@/lib/utils'
import type { LearnModule } from '@/types'

export default function LearnPage() {
  const [modules, setModules] = useState<(LearnModule & { userProgress: any })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/learn')
      .then((r) => r.json())
      .then(({ modules }) => setModules(modules))
      .finally(() => setIsLoading(false))
  }, [])

  const completedCount = modules.filter((m) => m.userProgress?.completed).length

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trading Academy</h1>
          <p className="text-gray-400 text-sm mt-1">
            Master technical analysis with structured courses and interactive quizzes.
          </p>
        </div>
        {modules.length > 0 && (
          <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-bold text-white">{completedCount}/{modules.length}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {modules.length > 0 && (
        <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white">Overall Progress</span>
            <span className="text-sm text-gray-400">{Math.round((completedCount / modules.length) * 100)}%</span>
          </div>
          <Progress value={(completedCount / modules.length) * 100} indicatorColor="#00d395" className="h-3" />
        </div>
      )}

      {/* Module grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-2 w-full mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          modules.map((module) => {
            const isCompleted = module.userProgress?.completed
            const score = module.userProgress?.score

            return (
              <Link key={module.id} href={`/learn/${module.id}`} className="block group">
                <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5 hover:border-[#374151] hover:bg-[#1f2537] transition-all h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        isCompleted ? 'bg-[#00d395]/20' : 'bg-[#1f2537]'
                      )}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#00d395]" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm leading-tight">{module.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{module.duration} min</span>
                        </div>
                      </div>
                    </div>
                    {score !== null && score !== undefined && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#00d395]">{score}%</p>
                        <p className="text-[10px] text-gray-500">Score</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-4">{module.description}</p>

                  {/* Progress bar */}
                  <Progress
                    value={isCompleted ? 100 : 0}
                    indicatorColor="#00d395"
                    className="mb-4"
                  />

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getDifficultyColor(module.difficulty))}>
                      {module.difficulty}
                    </span>
                    <Badge
                      variant={module.requiredPlan === 'FREE' ? 'outline' : module.requiredPlan === 'PRO' ? 'pro' : 'premium'}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {module.requiredPlan}
                    </Badge>
                    {isCompleted && (
                      <Badge variant="success" className="text-[10px] px-1.5 py-0">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
