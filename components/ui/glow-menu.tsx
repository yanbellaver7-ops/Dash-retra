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

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: "easeInOut" as const },
      scale: { duration: 0.5, type: "spring" as const, stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" as const },
  },
}

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, activeItem }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("relative", className)}
        initial="initial"
        whileHover="hover"
      >
        <motion.div
          className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, rgba(124,58,237,0.08) 50%, transparent 100%)",
          }}
          variants={navGlowVariants}
        />
        <ul className="flex items-center gap-1 relative z-10">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.label === activeItem

            return (
              <motion.li key={item.label} className="relative">
                <Link href={item.href} className="block w-full">
                  <motion.div
                    className="block rounded-xl overflow-visible group relative"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="absolute inset-0 z-0 pointer-events-none"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{
                        background: item.gradient,
                        opacity: isActive ? 1 : 0,
                        borderRadius: "12px",
                      }}
                    />
                    {/* Front face */}
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 relative z-10 rounded-xl transition-colors",
                        isActive
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/80",
                      )}
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center bottom",
                      }}
                    >
                      <span className={cn("transition-colors duration-300", isActive ? item.iconColor : "")}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                    {/* Back face */}
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 absolute inset-0 z-10 rounded-xl transition-colors",
                        isActive ? "text-white" : "text-white/80",
                      )}
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center top",
                        rotateX: 90,
                      }}
                    >
                      <span className={item.iconColor}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </motion.div>
    )
  },
)

MenuBar.displayName = "MenuBar"
