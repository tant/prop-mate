"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { navItems } from "@/constants/data";
import { useMediaQuery } from "@/hooks/use-media-query";
import { auth } from "@/lib/firebaseConfig";
import {
  IconChevronRight,
  IconChevronsDown,
  IconUserCircle,
  IconCreditCard,
  IconBell,
  IconLogout,
  IconHome,
  IconUsers,
  IconCalendar,
  IconLayoutDashboard,
  IconMap
} from "@tabler/icons-react";

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <IconLayoutDashboard className="w-5 h-5" />,
  home: <IconHome className="w-5 h-5" />,
  users: <IconUsers className="w-5 h-5" />,
  calendar: <IconCalendar className="w-5 h-5" />,
  map: <IconMap className="w-5 h-5" />
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>HTMG</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item: any) => {
              const Icon = iconMap[item.icon] || null;
              const hasChildren = item.items && item.items.length > 0;
              return (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        {Icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {hasChildren && item.items.map((child: any) => {
                    const ChildIcon = iconMap[child.icon] || null;
                    return (
                      <SidebarMenuItem key={child.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={child.title}
                          isActive={pathname === child.url}
                          className="pl-8"
                        >
                          <Link href={child.url}>
                            {ChildIcon}
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <IconChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5" />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled onClick={() => router.push("/dashboard/profile")}> <IconUserCircle className="mr-2 h-4 w-4" /> Profile </DropdownMenuItem>
                  <DropdownMenuItem disabled> <IconCreditCard className="mr-2 h-4 w-4" /> Billing </DropdownMenuItem>
                  <DropdownMenuItem disabled> <IconBell className="mr-2 h-4 w-4" /> Notifications </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await signOut(auth);
                  router.push("/login");
                }}> <IconLogout className="mr-2 h-4 w-4" /> Đăng xuất </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
