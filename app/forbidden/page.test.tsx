import{render, screen} from "@testing-library/react";
import ForbiddenPage from "./page";

describe("ForbiddenPage", () => {
  it("renders the 403 error message correctly", () => {
    const { container } = render(<ForbiddenPage />);
    expect(container).toMatchSnapshot();
  });
 
  it('shows access denied message and home link', () => {
    render(<ForbiddenPage />);

    expect(screen.getByText('403')).toBeInTheDocument();

    expect(screen.getByText('You don’t have access to this page.')).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /go home/i });
 
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});