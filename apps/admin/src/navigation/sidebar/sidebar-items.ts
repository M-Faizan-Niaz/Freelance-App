import {
  KeyRound,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  Mail,
  Palette,
  Plus,
  SquarePen,
  Table2,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Todos",
        url: "/todos",
        icon: ListTodo,
      },
      {
        title: "Data Table",
        url: "/data-table",
        icon: Table2,
      },
      {
        title: "Colors",
        url: "/data-table",
        icon: Palette,
        subItems: [
          { title: "Create Color", url: "/colors/create", icon: Plus },
          { title: "Edit Color", url: "/data-table", icon: SquarePen },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Account",
    items: [
      {
        title: "Change Password",
        url: "/change-password",
        icon: KeyRound,
      },
      {
        title: "Change Email",
        url: "/change-email",
        icon: Mail,
      },
    ],
  },
];
