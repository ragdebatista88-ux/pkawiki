# Automatización de Pruebas - Playwright

Proyecto de automatización de pruebas utilizando **Playwright** para validar las funcionalidades del sistema.

---

# Requisitos

Antes de comenzar asegúrate de tener instalado:

- Node.js 18 o superior
- npm (incluido con Node.js)
- Visual Studio Code (opcional)

Verificar instalación:

```bash
node -v
npm -v
```

---

# Instalación del proyecto

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto:

```bash
cd <NOMBRE_DEL_PROYECTO>
```

Instalar las dependencias:

```bash
npm install
```

Instalar Playwright y los navegadores:

```bash
npx playwright install
```

Si es la primera vez que se utiliza Playwright en la computadora también se recomienda ejecutar:

```bash
npx playwright install --with-deps
```

---

# Estructura del proyecto

```
tests/
│
├── 1.1/
│   ├── TC-01...
│   ├── TC-02...
│   └── ...
│
├── 1.2/
│   ├── TC-01...
│   └── ...
│
helpers/
config/
archivos/
playwright.config.js
```

Cada carpeta representa una versión o conjunto de pruebas.

---

# Ejecutar todas las pruebas

```bash
npx playwright test
```

---

# Ejecutar únicamente una carpeta

## Ejecutar pruebas de la carpeta 1.1

```bash
npx playwright test tests/1.1
```

## Ejecutar pruebas de la carpeta 1.2

```bash
npx playwright test tests/1.2
```

---

# Ejecutar una prueba específica

```bash
npx playwright test tests/1.1/TC-01_Login.spec.js
```

---

# Ejecutar con un solo Worker

Se recomienda utilizar un solo Worker para evitar conflictos entre pruebas.

```bash
npx playwright test --workers=1
```

También puede combinarse con una carpeta:

```bash
npx playwright test tests/1.1 --workers=1
```

---

# Ejecutar mostrando el navegador

```bash
npx playwright test --headed
```

También puede combinarse:

```bash
npx playwright test tests/1.1 --headed --workers=1
```

---

# Ejecutar únicamente en Chromium

```bash
npx playwright test --project=chromium
```

---

# Ejecutar una prueba por nombre

```bash
npx playwright test -g "Login"
```

---

# Generar Reporte HTML

Si el reporte ya fue generado:

```bash
npx playwright show-report
```

---

# Reportes

Después de ejecutar las pruebas se generan los siguientes archivos:

```
playwright-report/
```

Reporte HTML.

```
report.json
```

Reporte JSON.

```
test-results/
```

Capturas de pantalla, videos, traces y evidencias de las pruebas.

---

# Evidencias

Cada prueba genera evidencia automáticamente.

Las evidencias incluyen:

- Capturas de pantalla
- Video
- Trace
- Attachments de cada paso importante
- Resumen final de la prueba

Estas evidencias pueden consultarse desde el reporte HTML de Playwright.

---

# Configuración

La configuración principal se encuentra en:

```
playwright.config.js
```

En este archivo se configuran:

- Workers
- Reportes
- Navegadores
- Screenshots
- Videos
- Trace
- Timeouts

---

# Buenas prácticas

- No modificar helpers sin validar el impacto.
- Utilizar IDs cuando sea posible.
- Evitar el uso de `nth()` salvo que sea necesario.
- Mantener las evidencias mediante `evidenceStep()`.
- No eliminar los attachments del reporte.

---

# Autor

Proyecto de automatización desarrollado con Playwright.