"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  ChartNoAxesCombined,
  FileChartColumn,
  Gauge,
  Settings,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Centro de comando",
    href: "/portal/dashboard",
    icon: Gauge,
  },
  {
    title: "Assessment",
    href: "/portal/assessment",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Clientes",
    href: "/portal/clientes",
    icon: Building2,
  },
  {
    title: "Agentes IA",
    href: "/portal/agentes",
    icon: Bot,
  },
  {
    title: "Automatizaciones",
    href: "/portal/automatizaciones",
    icon: Workflow,
  },
  {
    title: "Reportes",
    href: "/portal/reportes",
    icon: FileChartColumn,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link
          href="/portal/dashboard"
          className="flex items-center gap-3 px-2 py-2"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Sparkles className="size-5" />
          </div>

          <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-bold tracking-[0.15em]">XONPLACE</span>
            <span className="text-xs text-muted-foreground">
              Intelligence Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                   <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive}
                    tooltip={item.title}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
                render={<Link href="/portal/configuracion" />}
                isActive={pathname === "/portal/configuracion"}
                tooltip="Configuración"
              >
                <Settings />
                <span>Configuración</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center gap-3 rounded-xl border bg-background p-2 group-data-[collapsible=icon]:hidden">
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            GL
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Gonzalo Llabres</p>
            <p className="truncate text-xs text-muted-foreground">
              Administrador
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
