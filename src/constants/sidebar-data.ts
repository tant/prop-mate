import {
  Gauge,
  Building2,
  Map as LucideMap,
  Landmark,
  FolderKanban,
  Boxes,
} from "lucide-react"

const iconMap = {
  Gauge,
  Building2,
  Map: LucideMap,
  Landmark,
  FolderKanban,
  Boxes,
} as const

const navMainRaw = [
  {
    title: "Dashboard",
    url: "/Dashboard",
    icon: "Gauge",
    isActive: true,
  },
  {
    title: "Bất động sản",
    url: "#",
    icon: "Building2",
  },
  {
    title: "Bản đồ",
    url: "#",
    icon: "Map",
  },
  {
    title: "Dự án bất động sản/chung cư",
    url: "#",
    icon: "Landmark",
  },
]

const projectsRaw = [
  {
    name: "Design Engineering",
    url: "#",
    icon: "FolderKanban",
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: "Boxes",
  },
  {
    name: "Travel",
    url: "#",
    icon: "Map",
  },
]

export const navMain = navMainRaw.map(item => ({
  ...item,
  icon: iconMap[item.icon as keyof typeof iconMap],
}))

export const projects = projectsRaw.map(item => ({
  ...item,
  icon: iconMap[item.icon as keyof typeof iconMap],
}))

export { iconMap }
