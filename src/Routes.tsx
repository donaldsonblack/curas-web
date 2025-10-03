import {
	Home,
	ClipboardList,
	Wrench,
	Building,
	Users,
	FileText,
	BarChart3,
	Settings,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Checklists from "./pages/Checklists";
import Equipment from "./pages/Equipment";
import Departments from "./pages/Departments";
import UsersPage from "./pages/Users";
import Logs from "./pages/Logs";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";

export type AppRoute = {
	path: string;
	label?: string;
	icon?: React.ReactNode;
	element?: React.ReactNode;
	requiresAdmin?: boolean;
	type?: "page" | "dialog";
};

export const primaryRoutes: AppRoute[] = [
	{
		path: "/",
		label: "Dashboard",
		icon: <Home className="w-4 h-4" />,
		element: <Dashboard />,
	},
	{
		path: "/checklists",
		label: "Checklists",
		icon: <ClipboardList className="w-4 h-4" />,
		element: <Checklists />,
	},
	{
		path: "/equipment",
		label: "Equipment",
		icon: <Wrench className="w-4 h-4" />,
		element: <Equipment />,
	},
	{
		path: "/departments",
		label: "Departments",
		icon: <Building className="w-4 h-4" />,
		element: <Departments />,
	},

];

export const secondaryRoutes: AppRoute[] = [
	{
		path: "/users",
		label: "Users",
		icon: <Users className="w-4 h-4" />,
		element: <UsersPage />,
		requiresAdmin: true,
	},
	{
		path: "/logs",
		label: "Logs",
		icon: <FileText className="w-4 h-4" />,
		element: <Logs />,
		requiresAdmin: true,
	},
	{
		path: "/reports",
		label: "Reports",
		icon: <BarChart3 className="w-4 h-4" />,
		element: <Reports />,
		requiresAdmin: true,
	},
        {
                path: "/settings",
                label: "Settings",
                icon: <Settings className="w-4 h-4" />,
                element: <SettingsPage />,
                requiresAdmin: true,
        },
];

export const hiddenRoutes: AppRoute[] = [
	{
		path: "/hidden",
		element: <>HIDDEN</>,
	}
]

