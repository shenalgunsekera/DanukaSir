import { initials, cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = 48,
  className,
  ring,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-elevated text-sage-300",
        ring && "ring-2 ring-sage-500/40 ring-offset-2 ring-offset-base",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span
          className="font-display font-semibold"
          style={{ fontSize: size * 0.36 }}
        >
          {initials(name)}
        </span>
      )}
    </div>
  );
}
