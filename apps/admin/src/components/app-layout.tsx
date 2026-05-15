import { Outlet } from "@tanstack/react-router";
import { siGithub } from "simple-icons";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SimpleIcon } from "@/components/simple-icon";
import { AccountSwitcher } from "@/components/sidebar/account-switcher";
import { LayoutControls } from "@/components/sidebar/layout-controls";
import { SearchDialog } from "@/components/sidebar/search-dialog";
import { ThemeSwitcher } from "@/components/sidebar/theme-switcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { users } from "@/data/users";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls />
              <ThemeSwitcher />
              <Button asChild size="icon">
                <a href={APP_CONFIG.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
                </a>
              </Button>
              <AccountSwitcher users={users} />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
