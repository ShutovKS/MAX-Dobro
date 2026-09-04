// FILE: frontend/src/lib/iconMap.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Resolve lucide icon components from PascalCase or backend kebab names.
//   SCOPE: Shared icon registry and fallback to Star
//   DEPENDS: none
//   LINKS: M-FRONTEND-API M-FRONTEND-TYPES
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   iconMap - name-to-component registry covering mock and backend icon strings
//   getIconComponent - look up an icon by name with Star fallback
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Dog,
  Eye,
  Footprints,
  GraduationCap,
  HandHeart,
  Heart,
  Leaf,
  List,
  Medal,
  MessageSquare,
  Palette,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  Trophy,
  User as UserIcon,
  Users,
} from 'lucide-react';
import type { React } from 'react';

// Единый реестр иконок. Ключи покрывают И PascalCase (мок-данные), И
// kebab/lowercase строки, которые шлёт бэкенд (achievements/courses), плюс
// 'default'. Раньше бэкенд-строки (first-aid/leaf/pet/chat) не были в карте и
// иконки падали в заглушку.
export const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  // PascalCase (мок + наши строки)
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Dog,
  Eye,
  Footprints,
  GraduationCap,
  HandHeart,
  Heart,
  Leaf,
  List,
  Medal,
  MessageSquare,
  Palette,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  Trophy,
  User: UserIcon,
  Users,
  // kebab/lowercase (бэкенд)
  'first-aid': Stethoscope,
  'hand-heart': HandHeart,
  'graduation-cap': GraduationCap,
  leaf: Leaf,
  pet: Dog,
  dog: Dog,
  chat: MessageSquare,
  clock: Clock,
  star: Star,
  trophy: Trophy,
  palette: Palette,
  users: Users,
  list: List,
  default: Star,
};

/** Возвращает компонент иконки по имени (любой регистр/стиль), иначе Star. */
// START_CONTRACT: getIconComponent
//   PURPOSE: Return a lucide icon component for a stored icon name
//   INPUTS: { name?: string | null - PascalCase or kebab icon key }
//   OUTPUTS: { React.FC - matched icon or Star fallback }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API M-FRONTEND-TYPES
// END_CONTRACT: getIconComponent
export const getIconComponent = (
  name?: string | null,
): React.FC<React.SVGProps<SVGSVGElement>> => {
  if (!name) return iconMap.default;
  return iconMap[name] || iconMap.default;
};
