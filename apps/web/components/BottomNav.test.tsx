import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BottomNav from "./BottomNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("BottomNav", () => {
  it("renders all five primary tabs", () => {
    render(<BottomNav />);
    for (const label of ["Home", "Life Areas", "Brain Dump", "Adea", "Profile"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("marks the current route as active", () => {
    render(<BottomNav />);
    expect(screen.getByRole("link", { current: "page" })).toHaveTextContent("Home");
  });
});
