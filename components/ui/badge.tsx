import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#3b82f6] text-white',
        secondary: 'border-transparent bg-[#1f2537] text-gray-300',
        destructive: 'border-transparent bg-[#ff4444] text-white',
        outline: 'text-gray-300 border-[#1f2937]',
        success: 'border-transparent bg-[#00d395]/20 text-[#00d395] border-[#00d395]/30',
        warning: 'border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        pro: 'border-transparent bg-blue-500/20 text-blue-400 border-blue-500/30',
        premium: 'border-transparent bg-purple-500/20 text-purple-400 border-purple-500/30',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
