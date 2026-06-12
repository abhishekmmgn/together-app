import { IoChevronForwardOutline } from "react-icons/io5";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import ResetPasswordForm from "@/app/auth/reset-password/reset-password-form";

export default function ChangePassword() {
	return (
		<>
			<ResponsiveDialog
				trigger={
					<button className="w-full flex items-center justify-between text-left outline-none cursor-pointer">
						<h3 className="text-lg font-medium">Change Password</h3>
						<IoChevronForwardOutline className="h-5 w-5" />
					</button>
				}
				title="Change Password"
			>
				<div>
					<ResetPasswordForm userId={""} />
				</div>
			</ResponsiveDialog>
		</>
	);
}
