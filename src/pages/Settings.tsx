import { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email updates
            </p>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        <Button type="button">Save settings</Button>
      </div>
    </div>
  );
}

