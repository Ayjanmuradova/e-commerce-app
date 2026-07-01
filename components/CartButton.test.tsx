import { render, screen } from "@testing-library/react";
import CartButton from "./CartButton";
import { useCart } from "@/context/CartContext";

jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

describe("UI Component: CartButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render 0 when the component is NOT mounted (Hydration Check)", () => {
    (useCart as jest.Mock).mockReturnValue({
      totalItems: 5,
      isMounted: false,
    });

    render(<CartButton />);

    expect(screen.getByText("(0)")).toBeInTheDocument();
  });

  it("should render the correct total items when mounted", () => {
  
    (useCart as jest.Mock).mockReturnValue({
      totalItems: 3,
      isMounted: true,
    });

    render(<CartButton />);

    expect(screen.getByText("(3)")).toBeInTheDocument();
  });

  it("should have a link pointing to the /cart route", () => {
    (useCart as jest.Mock).mockReturnValue({
      totalItems: 1,
      isMounted: true,
    });

    render(<CartButton />);

    const linkElement = screen.getByRole("link");
  
    expect(linkElement).toHaveAttribute("href", "/cart");
  });
});