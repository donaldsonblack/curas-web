import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AppShell() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Outlet /> {/* This renders the nested route components like Home or Info */}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}