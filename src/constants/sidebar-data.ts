import {
  IconGauge,
  IconBuilding,
  IconMap,
  IconBuildingMonument,
  IconLayoutKanban,
  IconBox,
} from "@tabler/icons-react"

const iconMap = {
  Gauge: IconGauge,
  Building2: IconBuilding,
  Map: IconMap,
  Landmark: IconBuildingMonument,
  FolderKanban: IconLayoutKanban,
  Boxes: IconBox,
} as const

const navMainRaw = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "Gauge",
    isActive: true,
  },
  {
    title: "Bất động sản",
    url: "/properties",
    icon: "Building2",
  },
  {
    title: "Bản đồ",
    url: "/map",
    icon: "Map",
  },
  {
    title: "Dự án",
    url: "projects",
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
