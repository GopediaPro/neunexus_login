import { Button } from "./Button"

interface CtaButtonProps {
  text: string
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}

export function CtaButton({ text, onClick, type = "button", disabled }: CtaButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-md py-2"
    >
      {text}
    </Button>
  )
}
