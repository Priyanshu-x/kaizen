import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-white/10 dark:bg-zinc-800/50", className)}
            {...props}
        />
    );
}
