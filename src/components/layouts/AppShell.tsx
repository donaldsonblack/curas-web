import { Outlet } from "react-router-dom"
import { AppSidebar } from "../ui/app-sidebar"
import { SiteHeader } from "../ui/site-header"
import { Toaster } from "../ui/sonner"
import {
  SidebarInset,
  SidebarProvider,
} from "../ui/sidebar"

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
      <Toaster />
    </>
  )
}