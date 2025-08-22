"use client"

import * as React from "react"
import {
	MenuIcon,
	HomeIcon,
	PaletteIcon,
	MessageCircleIcon,
	GlobeIcon,
	KeyboardIcon,
	CheckIcon,
	VideoIcon,
	LinkIcon,
	LockIcon,
	SettingsIcon,
	UserIcon,
} from "lucide-react"

import {
	Dialog,
	DialogContent,
	//DialogHeader,
	//DialogTitle,
	DialogTrigger,
} from "./dialog"
import { Button } from "./button";
import { useTheme } from "../../hooks/useTheme";


const SECTIONS = [
	{ key: "profile", label: "Profile", icon: UserIcon },
	{ key: "navigation", label: "Navigation", icon: MenuIcon },
	{ key: "home", label: "Home", icon: HomeIcon },
	{ key: "appearance", label: "Appearance", icon: PaletteIcon },
	{ key: "messages", label: "Messages & media", icon: MessageCircleIcon },
	{ key: "language", label: "Language & region", icon: GlobeIcon },
	{ key: "accessibility", label: "Accessibility", icon: KeyboardIcon },
	{ key: "markasread", label: "Mark as read", icon: CheckIcon },
	{ key: "audio", label: "Audio & video", icon: VideoIcon },
	{ key: "accounts", label: "Connected accounts", icon: LinkIcon },
	{ key: "privacy", label: "Privacy & visibility", icon: LockIcon },
	{ key: "advanced", label: "Advanced", icon: SettingsIcon },
]

interface SettingsDialogProps {
	children: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
	const [selected, setSelected] = React.useState("messages")

	const { theme, toggleTheme } = useTheme();

	const selectedSection = SECTIONS.find(s => s.key === selected)

	const SECTION_CONTENT: Record<string, React.ReactNode> = {
		notifications: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		navigation: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		home: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		appearance: (
			<div className="flex flex-col gap-4 w-full">
				<p className="text-sm text-muted-foreground">Toggle between light and dark theme:</p>
				<Button variant="secondary" onClick={toggleTheme}>
					Toggle Theme
				</Button>
				<p className="text-sm text-muted-foreground">Current theme: {theme}</p>
			</div>
		),
		messages: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		language: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		accessibility: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		markasread: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		audio: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		accounts: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		privacy: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
		advanced: <div className="h-40 bg-muted rounded-xl" />, // Placeholder
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="!max-w-[90vw] !w-[90vw] !sm:max-w-none p-0 overflow-hidden rounded-2xl">
				<div className="flex h-[70vh] w-full bg-background rounded-2xl shadow-lg">
					{/* Sidebar */}
					<aside className="flex-shrink-0" style={{ width: 260 }}>
						<div className="border-r border-border bg-muted/40 py-6 px-2 flex flex-col gap-1 h-full">
							{SECTIONS.map(section => (
								<button
									key={section.key}
									className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left ${selected === section.key
										? "bg-muted text-foreground"
										: "text-muted-foreground hover:bg-muted/50"
										}`}
									onClick={() => setSelected(section.key)}
								>
									<section.icon className="w-5 h-5" />
									<span>{section.label}</span>
								</button>
							))}
						</div>
					</aside>
					{/* Main content */}
					<main className="flex-1 flex flex-col bg-background p-8" style={{ flexBasis: '82%' }}>
						<div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
							<span className="font-medium text-muted-foreground">Settings</span>
							<span className="mx-1">&gt;</span>
							<span className="text-foreground font-medium">{selectedSection?.label}</span>
						</div>
						<div className="flex-1 flex flex-col gap-6">
							{SECTION_CONTENT[selected]}
							<div className="h-40 bg-muted rounded-xl" />
						</div>
					</main>
				</div>
			</DialogContent>
		</Dialog>
	)
} 
