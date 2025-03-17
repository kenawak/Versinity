import type React from "react"
import { Link } from "react-router-dom"
import { Home, Heart, Search, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

type BottomNavProps = {
  currentTab: "home" | "favorites" | "search" | "settings"
}

export default function BottomNav({ currentTab }: BottomNavProps) {
  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          <NavItem href="/" icon={<Home className="w-6 h-6" />} label="Home" isActive={currentTab === "home"} />
          <NavItem
            href="/favorites"
            icon={<Heart className="w-6 h-6" />}
            label="Favorites"
            isActive={currentTab === "favorites"}
          />
          <NavItem
            href="/search"
            icon={<Search className="w-6 h-6" />}
            label="Search"
            isActive={currentTab === "search"}
          />
          <NavItem
            href="/settings"
            icon={<Settings className="w-6 h-6" />}
            label="Settings"
            isActive={currentTab === "settings"}
          />
        </div>
      </div>
    </nav>
  )
}

type NavItemProps = {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center justify-center w-16 h-full",
        isActive
          ? "text-terracotta"
          : "text-gray-500 dark:text-gray-400 hover:text-terracotta dark:hover:text-terracotta",
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}

