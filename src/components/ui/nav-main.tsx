"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";
import { Link } from "react-router-dom";
import { primaryRoutes } from "../../Routes";
export function NavMain() {
  const mainRoutes = primaryRoutes;

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          {/* <SearchForm className="my-2" /> */}
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            {mainRoutes.map((route) => (
              <SidebarMenuItem key={route.path}>
                <SidebarMenuButton asChild tooltip={route.label}>
                  <Link to={route.path} className="flex items-center gap-2">
                    {route.icon}
                    <span>{route.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
