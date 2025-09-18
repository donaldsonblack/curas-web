"use client"

import { useAuth } from "react-oidc-context";
import { signoutRedirect } from "../../auth/useAuth";

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './sidebar'

export function NavUser(){
  const auth = useAuth();
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Avatar that shows in sidebar */}
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {/* Avatar image */}
                <AvatarImage src={auth.user?.profile.name} alt={auth.user?.profile.name} />
                {/* Avatar fallback */}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* Name that shows in sidebar */}
                <span className="truncate font-medium">{auth.user?.profile.given_name}</span>
                {/* Email that shows in sidebar */}
                <span className="truncate text-xs text-muted-foreground">
                 {auth.user?.profile.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* Avatar that opens in popup */}
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={auth.user?.profile.name} alt={auth.user?.profile.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                {/* Name and email that opens in popup*/}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{auth.user?.profile.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {auth.user?.profile.email}
                  </span>
                </div>

              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={signoutRedirect} >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
            

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
