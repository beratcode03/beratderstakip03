// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/bilesenler/arayuz/toast"
//en sevdiğim en basit toaster ya hep böyle kod yazayım
//GELİŞTİRİLECEK
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} duration={3000} {...props}>
            <div className="grid gap-1 pb-2">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
            <ToastProgressBar duration={3000} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

function ToastProgressBar({ duration }: { duration: number }) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      
      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-100 ease-linear origin-left"
        style={{ 
          width: `${progress}%`,
          transformOrigin: 'left center'
        }}
      />
    </div>
  )
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
