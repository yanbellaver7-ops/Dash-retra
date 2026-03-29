"use client"

import * as React from "react"
import Link from "next/link"
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
    return (
      <div ref={ref} className={cn("relative", className)}>
        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.label === activeItem

            return (
              <li key={item.label} className="relative">
                <Link href={item.href} className="block">
                  <motion.div
                    className="relative rounded-xl overflow-visible"
                    style={{ perspective: "600px" }}
                    whileHover="hovered"
                    initial="idle"
                  >
                    {/* Glow — controlado separadamente via animate */}
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
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  },
)

MenuBar.displayName = "MenuBar"
