// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import * as React from "react"

import { cn } from "@/kutuphane/yardimcilar"
//veri giriş kutusu
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number" && e.target.value) {
        const cleanValue = e.target.value.replace(/^0+(?=\d)/, '');
        e.target.value = cleanValue;
      }
      onChange?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
