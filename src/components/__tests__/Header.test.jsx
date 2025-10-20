import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";


describe("Header Component", () => {
  it("muestra el título Mi Bodega", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("📦 Mi Bodega")).toBeInTheDocument();
  });

  it("contiene los enlaces de navegación", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Inventario")).toBeInTheDocument();
    expect(screen.getByText("Reportes")).toBeInTheDocument();
  });
});
