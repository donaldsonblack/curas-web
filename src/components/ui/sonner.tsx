import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      <style>{`
        [data-sonner-toast] {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          color: #1f2937 !important;
        }
        [data-sonner-toast] [data-title] {
          color: #1f2937 !important;
          font-weight: 600 !important;
        }
        [data-sonner-toast] [data-description] {
          color: #4b5563 !important;
        }
        [data-sonner-toast][data-type="success"] {
          background: #f0fdf4 !important;
          border-color: #22c55e !important;
        }
        [data-sonner-toast][data-type="info"] {
          background: #eff6ff !important;
          border-color: #3b82f6 !important;
        }
        [data-sonner-toast][data-type="warning"] {
          background: #fffbeb !important;
          border-color: #f59e0b !important;
        }
      `}</style>
      <Sonner
        theme="system"
        className="toaster group"
        {...props}
      />
    </>
  )
}

export { Toaster }
