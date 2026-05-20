import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-sm',
        destructive: 'bg-[#ff4444] text-white hover:bg-[#cc0000]',
        outline: 'border border-[#1f2937] bg-transparent text-white hover:bg-[#1f2537]',
        secondary: 'bg-[#1a1f2e] text-white hover:bg-[#1f2537] border border-[#1f2937]',
        ghost: 'text-gray-400 hover:text-white hover:bg-[#1f2537]',
        link: 'text-[#3b82f6] underline-offset-4 hover:underline',
        success: 'bg-[#00d395] text-[#0f1117] hover:bg-[#00a872] font-semibold',
        gradient: 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
