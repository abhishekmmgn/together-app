import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(layout-one)/page";

describe("Page", () => {
	it("renders a heading", () => {
		render(<Page />); // ARRANGE

		const heading = screen.getByRole("heading", { level: 1 }); // ACT

		expect(heading).toBeInTheDocument(); // ASSERT
	});
});
