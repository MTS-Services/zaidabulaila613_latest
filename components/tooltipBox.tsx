"use client"

export default function TooltipBox({ text, children }: { text: string, children: React.ReactNode }) {

    return (
        <div className="group relative inline-block w-full">
            <div className="absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                {text}
            </div>
            {children}
        </div>
    )
}
