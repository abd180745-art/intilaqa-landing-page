import { cn } from "@/lib/utils"

interface AvatarProps {
  initials: string
  tone: string
  online?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-lg",
}

export function Avatar({ initials, tone, online, size = "md", className }: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold tracking-tight",
          sizes[size],
          tone,
        )}
        aria-hidden="true"
      >
        {initials}
      </div>
      {online && (
        <span className="absolute -bottom-0 -left-0 size-3 rounded-full border-2 border-card bg-emerald-500" />
      )}
    </div>
  )
}
