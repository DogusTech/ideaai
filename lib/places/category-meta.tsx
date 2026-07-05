import {
  BookOpen,
  Building2,
  Calendar,
  Coffee,
  GraduationCap,
  Rocket,
  TreePine,
  type LucideIcon,
} from "lucide-react"

import type { HubCategory } from "./types"

export const CATEGORY_ICONS: Record<HubCategory, LucideIcon> = {
  coworking: Building2,
  cafe: Coffee,
  park: TreePine,
  event: Calendar,
  startup_hub: Rocket,
  library: BookOpen,
  university_hub: GraduationCap,
}
