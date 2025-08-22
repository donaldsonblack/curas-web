"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { secondaryRoutes } from "../../Routes"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './sidebar'
import { SettingsDialog } from "./settings-dialog";

export function NavSecondary(props: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>System</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {secondaryRoutes.map((route) => (
            <SidebarMenuItem key={route.path}>
              {route.label === "Settings" ? (
                <SettingsDialog>
                  <SidebarMenuButton asChild tooltip={route.label}>
                    <button className="flex items-center gap-2">
                      {route.icon}
                      <span>{route.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SettingsDialog>
              ) : (
                <SidebarMenuButton asChild tooltip={route.label}>
                  <Link to={route.path} className="flex items-center gap-2">
                    {route.icon}
                    <span>{route.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
