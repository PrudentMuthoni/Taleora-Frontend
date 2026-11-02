import { Clapperboard, FolderOpen, House, Images, UserRound, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Home", icon: House },
  { href: "/create", label: "Create", icon: Clapperboard },
  { href: "/library", label: "Library", icon: Images },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/account", label: "Account", icon: UserRound },
];

// Planned features that have no backend yet.
export const SOON_ITEMS = ["Templates", "Editor"];
