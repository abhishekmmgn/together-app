"use client";

import { createContext, useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mediaquery";

type ResponsiveDialogContextType = {
	closeDialog: () => void;
};

const ResponsiveDialogContext = createContext<ResponsiveDialogContextType>({
	closeDialog: () => {},
});

export const useResponsiveDialog = () => useContext(ResponsiveDialogContext);

export const ResponsiveDialog = ({
	trigger,
	isTriggerChild = true,
	title,
	description,
	children,
	open,
	onOpenChange,
}: {
	trigger: React.ReactNode;
	isTriggerChild?: boolean;
	title: string;
	description?: string;
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 768px)");

	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

	const closeDialog = () => setIsOpen(false);

	if (isMobile) {
		return (
			<ResponsiveDialogContext.Provider value={{ closeDialog }}>
				<Drawer open={isOpen} onOpenChange={setIsOpen}>
					<DrawerTrigger asChild={isTriggerChild}>{trigger}</DrawerTrigger>
					<DrawerContent className="h-fit">
						<DrawerHeader>
							<DrawerTitle className="font-sans">{title}</DrawerTitle>
							{description && (
								<DrawerDescription>{description}</DrawerDescription>
							)}
						</DrawerHeader>
						<div className="mx-auto w-full max-w-lg px-4 min-[512px]:px-0">
							{children}
						</div>
						<DrawerFooter>
							<DrawerClose asChild className="mx-auto">
								<Button variant="outline" className="w-full max-w-lg">
									Cancel
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</ResponsiveDialogContext.Provider>
		);
	}

	return (
		<ResponsiveDialogContext.Provider value={{ closeDialog }}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				{isTriggerChild ? (
					<DialogTrigger render={trigger as React.ReactElement} />
				) : (
					<DialogTrigger>{trigger}</DialogTrigger>
				)}
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="font-sans">{title}</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
					{children}
				</DialogContent>
			</Dialog>
		</ResponsiveDialogContext.Provider>
	);
};
