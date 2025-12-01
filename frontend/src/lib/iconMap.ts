import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Dog,
  Eye,
  GraduationCap,
  HandHeart,
  Leaf,
  List,
  Palette,
  Star,
  TrendingUp,
  Trophy,
  User as UserIcon,
  Users
} from 'lucide-react';
import type { React } from 'react';

export const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Dog,
  Eye,
  GraduationCap,
  HandHeart,
  Leaf,
  List,
  Palette,
  Star,
  TrendingUp,
  Trophy,
  User: UserIcon,
  Users,
};
