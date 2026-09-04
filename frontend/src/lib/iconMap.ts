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
export const getIconComponent = (
  name?: string | null,
): React.FC<React.SVGProps<SVGSVGElement>> => {
  if (!name) return iconMap.default;
  return iconMap[name] || iconMap.default;
};
