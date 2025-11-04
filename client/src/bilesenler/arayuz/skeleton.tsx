// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { cn } from "@/kutuphane/yardimcilar"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
