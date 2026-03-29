"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MenuItem {
  icon: LucideIcon | React.FC
  label: string
  href: string
  gradient: string
  iconColor: string
}

interface MenuBarProps {
  items: MenuItem[]
  activeItem?: string
  className?: string
}

const spring = { type: "spring" as const, stiffness: 100, damping: 20, duration: 0.5 }

export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, activeItem }, ref) => {
    const router = useRouter()
    const [clicking, setClicking] = useState<string | null>(null)

    function handleClick(e: React.MouseEvent, label: string, href: string) {
      if (href === '#') return
      e.preventDefault()
      setClicking(label)
      setTimeout(() => {
        router.push(href)
        setClicking(null)
      }, 320)
    }

    return (
      <div ref={ref} className={cn("relative", className)}>
        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.label === activeItem
            const isClicking = clicking === item.label
            const animState = isClicking ? "hovered" : "idle"

            return (
              <li key={item.label}>
                <a
                  href={item.href === '#' ? undefined : item.href}
                  onClick={(e) => handleClick(e, item.label, item.href)}
                  className="block cursor-pointer"
                >
                  <motion.div
                    className="relative rounded-xl overflow-visible"
                    style={{ perspective: "600px" }}
                    animate={animState}
                  >
                    {/* Glow — só no item ativo */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-xl z-0"
                      animate={isActive ? { opacity: 1, scale: 1.8 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{ background: item.gradient }}
                    />

                    {/* Front face */}
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 relative z-10 rounded-xl",
                        isActive ? "text-white" : "text-white/40",
                      )}
                      variants={{
                        idle:    { rotateX: 0,   opacity: 1 },
                        hovered: { rotateX: -90, opacity: 0 },
                      }}
                      transition={spring}
                      style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>

                    {/* Back face */}
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 absolute inset-0 z-10 rounded-xl",
                        item.iconColor,
                      )}
                      variants={{
                        idle:    { rotateX: 90, opacity: 0 },
                        hovered: { rotateX: 0,  opacity: 1 },
                      }}
                      transition={spring}
                      style={{ transformStyle: "preserve-3d", transformOrigin: "center top" }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </motion.div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  },
)

MenuBar.displayName = "MenuBar"
