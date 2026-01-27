import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * DESIGN SYSTEM DOS BOTÕES DO PROJETO
 * Fiel ao Figma
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Botão principal (Cadastrar, Salvar, Acessar, Editar) */
        primary:
          "h-12 px-6 rounded-lg bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]",

        /** Botão Voltar / Sair */
        outline:
          "h-12 px-6 rounded-lg border-2 border-[#B2D7EC] bg-transparent text-[#0D4F97] hover:bg-[#B2D7EC]/20",

        /** Botão de ação perigosa */
        danger:
          "h-12 px-6 rounded-lg border-2 border-red-500 bg-gray-100 text-red-500 hover:bg-red-50 hover:text-[#0D4F97] hover:border-red-600",

        /** Ícones (excluir turma, fechar, etc) */
        ghost:
          "h-10 w-10 rounded-md bg-transparent text-[#0D4F97] hover:bg-[#E8F3FF]",

        /** Link visual (caso exista) */
        link:
          "h-auto px-0 text-[#0D4F97] underline-offset-4 hover:underline",
      },

      size: {
        default: "",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
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
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
