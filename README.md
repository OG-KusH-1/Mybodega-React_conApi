# Mi Bodega React (Vite)

Proyecto migrado a React + Vite. Contiene el inventario, reportes con Chart.js y persistencia en localStorage.

## Ejecutar localmente

1. `npm install`
2. `npm run dev`
3. Abrir `http://localhost:5173/`

## Notas
- Reportes en `/reportes`
- Datos guardados en localStorage (clave: 'inventario' y 'consumidos')
- Para correr tests Karma+Jasmine: `npm run karma` (requiere ChromeHeadless disponible)
