import { render, screen, fireEvent } from "@testing-library/react";
import ProductForm from "../ProductForm";

describe("ProductForm Component", () => {
  it("muestra el botón Agregar", () => {
    render(<ProductForm onAdd={() => {}} />);
    expect(screen.getByText("Agregar")).toBeInTheDocument();
  });

  it("lanza onAdd cuando se completa el formulario", () => {
    const mockAdd = vi.fn();

    render(<ProductForm onAdd={mockAdd} />);

    fireEvent.change(screen.getByLabelText("Producto"), { target: { value: "Arroz" } });
    fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "Alimentos" } });
    fireEvent.click(screen.getByText("Agregar"));

    expect(mockAdd).toHaveBeenCalledOnce();
  });
});
