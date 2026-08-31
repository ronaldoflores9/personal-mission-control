import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-sm font-mono text-xs uppercase tracking-widest transition-all disabled:pointer-events-none disabled:opacity-50 touch-manipulation',
  {
    variants: {
      variant: {
        default: 'bg-panel border border-panel-line text-ink hover:border-telemetry',
        flame: 'bg-ion border border-ion text-[#071322] font-bold hover:bg-ion-dim',
        ghost: 'bg-transparent border border-transparent text-ink-dim hover:text-ink hover:border-panel-line',
        destructive: 'border border-flame text-flame hover:bg-flame/10',
      },
      size: {
        default: 'px-4 py-2.5',
        sm: 'px-3 py-1.5 text-[0.7rem]',
        lg: 'px-6 py-3 text-sm',
        icon: 'w-11 h-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
