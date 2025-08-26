"use client";

import {
  PlusCircleIcon,
} from "lucide-react";
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
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-zinc-900 text-white dark:text-white duration-600 ease-linear hover:bg-zinc-700 hover:text-white active:bg-primary/90 active:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-primary/90"
              >
                <PlusCircleIcon />
                <span className="">New Checklist</span>
              </SidebarMenuButton>
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
