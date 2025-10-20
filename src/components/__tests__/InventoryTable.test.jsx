import { render, screen } from "@testing-library/react";
import InventoryTable from "../InventoryTable";

describe("InventoryTable Component", () => {
  it("muestra los productos en la tabla", () => {
    const inventario = [
      { nombre: "Arroz", cantidad: 3, categoria: "Alimentos" },
      { nombre: "Cloro", cantidad: 1, categoria: "Limpieza" },
    ];

    render(<InventoryTable inventario={inventario} />);

    expect(screen.getByText("Arroz")).toBeInTheDocument();
    expect(screen.getByText("Cloro")).toBeInTheDocument();
    expect(screen.getByText("Alimentos")).toBeInTheDocument();
    expect(screen.getByText("Limpieza")).toBeInTheDocument();
  });

  it("muestra mensaje si no hay productos", () => {
    render(<InventoryTable inventario={[]} />);
    expect(screen.getByText("No hay productos en el inventario")).toBeInTheDocument();
  });
});

