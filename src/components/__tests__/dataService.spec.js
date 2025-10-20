import { vi } from 'vitest'; // Necesario para hacer mocks
import DataService from '../../services/DataService';

describe('DataService basic', () => {
  beforeEach(() => {
    // Simulamos localStorage antes de cada test
    global.localStorage = {
      clear: vi.fn(),
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    localStorage.clear(); // Ahora sí es una función mockeada
  });

  it('should add or update product', () => {
    let inv = [];
    inv = DataService.addOrUpdateProduct(inv, { nombre: 'Arroz', cantidad: 2, categoria: 'Alimentos' });
    expect(inv.length).toBe(1);
    expect(inv[0].cantidad).toBe(2);

    inv = DataService.addOrUpdateProduct(inv, { nombre: 'Arroz', cantidad: 3, categoria: 'Alimentos' });
    expect(inv.length).toBe(1);
    expect(inv[0].cantidad).toBe(5);
  });

  it('should consume product and track consumidos', () => {
    let inv = [{ nombre: 'Leche', cantidad: 2, categoria: 'Bebidas' }];
    let cons = {};
    const res = DataService.consumeProduct(inv, cons, 0);
    expect(res.inventario[0].cantidad).toBe(1);
    expect(res.consumidos['Leche']).toBe(1);
  });
});
