import type { FontKey } from "@/lib/fonts/registry";

import type { SidebarCollapsible, SidebarVariant } from "./layout";

export function applyContentLayout(value: "centered" | "full-width") {
  const root = document.documentElement;
  root.setAttribute("data-content-layout", value);
}

export function applyNavbarStyle(value: "sticky" | "scroll") {
  const root = document.documentElement;
  root.setAttribute("data-navbar-style", value);
}

export function applySidebarVariant(value: SidebarVariant) {
  const root = document.documentElement;
  root.setAttribute("data-sidebar-variant", value);
}

export function applySidebarCollapsible(value: SidebarCollapsible) {
  const root = document.documentElement;
  root.setAttribute("data-sidebar-collapsible", value);
}

export function applyFont(value: FontKey) {
  const root = document.documentElement;
  root.setAttribute("data-font", value);
}
