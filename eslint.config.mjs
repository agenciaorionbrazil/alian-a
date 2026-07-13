import {
  BookOpen,
  CalendarHeart,
  CircleUserRound,
  HandHeart,
  HeartHandshake,
  Home,
  Library,
  MessageCircleHeart,
  PanelLeft,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp
} from "lucide-react";

export const platformNavigation = [
  { href: "/hoje", label: "Hoje", icon: Home },
  { href: "/devocional", label: "Devocional", icon: BookOpen },
  { href: "/sos", label: "SOS", icon: ShieldAlert },
  { href: "/jornada", label: "Jornada", icon: CalendarHeart },
  { href: "/conexao", label: "Conexao", icon: HeartHandshake },
  { href: "/gratidao", label: "Gratidao", icon: Sparkles },
  { href: "/oracoes", label: "Oracoes", icon: HandHeart },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/relatorio", label: "Relatorio", icon: TrendingUp },
  { href: "/perfil", label: "Perfil", icon: CircleUserRound },
  { href: "/configuracoes", label: "Ajustes", icon: Settings }
];

export const mainMobileNavigation = [
  platformNavigation[0],
  platformNavigation[1],
  platformNavigation[2],
  platformNavigation[3],
  { href: "/perfil", label: "Mais", icon: PanelLeft }
];

export const publicNavigation = [
  { href: "/entrar", label: "Entrar" },
  { href: "/cadastro", label: "Cadastro" }
];

export const messageIcon = MessageCircleHeart;
