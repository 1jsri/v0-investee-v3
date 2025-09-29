import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-white hover:bg-slate-800 border-2 border-slate-900 shadow-sm transition-all duration-200 hover:shadow-lg',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow-sm transition-all duration-200 hover:shadow-lg',
        secondary:
          'bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 shadow-sm transition-all duration-200',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900 transition-all duration-200',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2 text-base font-semibold rounded-lg has-[>svg]:px-5',
        sm: 'h-9 px-4 py-2 text-sm font-medium rounded-md gap-1.5 has-[>svg]:px-3',
        lg: 'h-12 px-8 py-3 text-lg font-bold rounded-xl has-[>svg]:px-6',
        icon: 'size-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
