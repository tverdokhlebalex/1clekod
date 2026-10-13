import {
  ArrowLeftRight,
  BadgeCheck,
  Boxes,
  Building2,
  ChartColumn,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  FileCheck2,
  Gauge,
  Globe,
  Headset,
  Link2,
  Mail,
  MessagesSquare,
  Phone,
  PlugZap,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Siren,
  Sparkles,
  Timer,
  Users,
  Warehouse,
  Workflow,
  Wrench,
  type LucideIcon
} from "lucide-react";
import type { IconName } from "@/lib/icons";

const icons: Record<IconName, LucideIcon> = {
  headset: Headset,
  wrench: Wrench,
  "arrow-left-right": ArrowLeftRight,
  plug: PlugZap,
  "clipboard-check": ClipboardCheck,
  siren: Siren,
  globe: Globe,
  warehouse: Warehouse,
  rocket: Rocket,
  messages: MessagesSquare,
  shield: ShieldCheck,
  timer: Timer,
  database: Database,
  "file-check": FileCheck2,
  workflow: Workflow,
  chart: ChartColumn,
  users: Users,
  badge: BadgeCheck,
  gauge: Gauge,
  building: Building2,
  phone: Phone,
  mail: Mail,
  spark: Sparkles,
  search: Search,
  boxes: Boxes,
  link: Link2,
  server: Server,
  "circle-dollar": CircleDollarSign
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 22, className }: IconProps) {
  const Glyph = icons[name] ?? Sparkles;
  return <Glyph aria-hidden className={className} size={size} />;
}
