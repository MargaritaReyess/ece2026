# ECE 2026 · Métricas multiobjetivo

Sitio estático para el taller **“Métricas para evaluar el desempeño de un algoritmo multiobjetivo”**.

## Estructura

- `docs/index.html` — página principal
- `docs/styles.css` — estilos
- `docs/app.js` — interactividad y gráficas SVG

## Publicación recomendada en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo:
   `ece2026-metricas-multiobjetivo`
2. Sube todos los archivos de este proyecto respetando la carpeta `docs/`.
3. En el repositorio abre:
   `Settings → Pages`
4. En **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`
5. Guarda.
6. GitHub Pages publicará el sitio y mostrará la URL en esa misma sección.

## Actualizaciones

Cada vez que edites un archivo dentro de `docs/` y hagas commit/push a `main`,
GitHub Pages volverá a publicar el sitio.

## Desarrollo local

Puedes abrir `docs/index.html` directamente en el navegador.
Para una prueba más fiel, desde la carpeta del proyecto puedes ejecutar:

```bash
python -m http.server 8000 --directory docs
```

y abrir `http://localhost:8000`.

## Estado

- Bloque 1: implementado
- Bloques 2–8: placeholders para construirlos progresivamente
