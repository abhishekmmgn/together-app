import ResetPasswordForm from "@/app/auth/reset-password/reset-password-form";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { IoChevronForwardOutline } from "react-icons/io5";

export default function ChangePassword({ userId }: { userId: string }) {
	return (
		<ResponsiveDialog
			trigger={
				<button className="w-full flex items-center justify-between text-left outline-none cursor-pointer p-4 hover:bg-muted/50 transition-colors">
					<div className="space-y-0.5">
						<div className="text-base font-medium">Change Password</div>
						<div className="text-sm text-muted-foreground">
							Update your account password
						</div>
					</div>
					<IoChevronForwardOutline className="h-5 w-5 text-muted-foreground/80" />
				</button>
			}
			title="Change Password"
		>
			<div>
				<ResetPasswordForm userId={userId} />
			</div>
		</ResponsiveDialog>
	);
}
