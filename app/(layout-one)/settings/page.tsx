"use client";

import { Separator } from "@/components/ui/separator";
import NotificationsPrefrences from "@/components/settings/notifications-prefrences";
import ChangePassword from "@/components/settings/change-password";
import ThemeToggle from "@/components/settings/theme-toggler";
import LogoutComponent from "@/components/settings/logout";
import DeleteAccountComponent from "@/components/settings/delete-account";

export default function SettingsPage() {
  return (
    <div className="p-4 px-5 space-y-5 lg:px-0">
      <div className="flex justify-between items-center">
        <h3 className="mb-1 text-lg font-medium">Theme</h3>
        <ThemeToggle />
      </div>
      <Separator />
      <NotificationsPrefrences />
      <Separator />
      <ChangePassword />
      <Separator />
      <LogoutComponent />
      <Separator />
      <DeleteAccountComponent />
    </div>
  );
}
