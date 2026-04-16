import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bolt,
  Brain,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  CircleUserRound,
  Download,
  EllipsisVertical,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Users,
  X,
} from 'lucide-react';

const iconMap = {
  account_circle: CircleUserRound,
  add: Plus,
  analytics: BarChart3,
  arrow_forward: ArrowRight,
  auto_awesome: Sparkles,
  bolt: Bolt,
  category: GraduationCap,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  close: X,
  csv: FileSpreadsheet,
  delete: Trash2,
  description: FileText,
  domain: Building2,
  download: Download,
  expand_more: ChevronDown,
  filter_list: Filter,
  grid_view: LayoutDashboard,
  group: Users,
  horizontal_rule: Minus,
  info: CircleAlert,
  insights: Brain,
  mail: Mail,
  menu: Menu,
  more_vert: EllipsisVertical,
  notifications: Bell,
  online_prediction: Brain,
  picture_as_pdf: FileText,
  priority_high: TriangleAlert,
  refresh: RefreshCw,
  report: TriangleAlert,
  search: Search,
  settings: Settings,
  trending_down: TrendingDown,
  trending_up: TrendingUp,
  verified: Check,
  warning: CircleAlert,
};

const AppIcon = ({ icon, className = '', strokeWidth = 2, ...props }) => {
  const IconComponent = iconMap[icon] || CircleHelp;

  return (
    <IconComponent
      aria-hidden="true"
      className={`inline-block shrink-0 align-middle ${className}`.trim()}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
};

export default AppIcon;
