import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563EB] text-[#FFFFFF] border border-transparent shadow-2xs hover:bg-[#1677FF] active:scale-[0.98]",
        accent:
          "bg-[#2563EB] text-[#FFFFFF] border border-transparent shadow-2xs hover:bg-[#1677FF] active:scale-[0.98]",
        outline:
          "border border-[#E2E7EF] bg-[#FFFFFF] text-[#0B1220] hover:bg-[#F8FAFF] hover:border-[#BFDBFE] hover:text-[#1677FF] active:scale-[0.98] shadow-2xs",
        secondary:
          "border border-[#E2E7EF] bg-[#FFFFFF] text-[#0B1220] hover:bg-[#F8FAFF] hover:border-[#BFDBFE] hover:text-[#1677FF] active:scale-[0.98]",
        ghost:
          "text-[#2B384E] hover:bg-[#F0F5FF] hover:text-[#1677FF]",
        link:
          "text-[#0B1220] underline-offset-4 hover:text-[#1677FF] hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8.5 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-sm font-semibold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
