import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the Weather Intelligence heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /plan smarter with live 7-day weather insights/i })).toBeInTheDocument();
  });

  it("renders the search button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /get weather/i })).toBeInTheDocument();
  });
});
