import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="print:hidden">
      <AppSidebar />
      </div>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 print:hidden">
          <SidebarTrigger className="-ml-1" />

          <Separator orientation="vertical" className="h-5" />

          <div>
            <p className="text-sm font-semibold">XONPLACE OS</p>
            <p className="text-xs text-muted-foreground">
              Centro de comando empresarial
            </p>
          </div>
        </header>

        <main className="flex-1 bg-muted/30 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}