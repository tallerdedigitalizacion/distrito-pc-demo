# Prompts para generación de imágenes — Distrito PC

Usa estos prompts en **Midjourney**, **DALL-E 3**, **Stable Diffusion** o **Adobe Firefly**.
Dimensiones recomendadas por sección.

---

## 1. Imagen hero / portada principal
**Uso:** Fondo o imagen principal del hero de la homepage
**Dimensiones:** 1920×1080 px (16:9) o 2560×1440 px

**Prompt (inglés para mejores resultados):**
```
High-tech PC repair workshop interior, dramatic dark lighting with orange and red
accent lighting. Workbench with disassembled computer components — motherboards,
RAM sticks, CPU coolers, graphics cards. Tools neatly arranged. Shallow depth of
field. Professional photography style. Dark background #0e0e13, orange glow
accent lights. No people. Cinematic composition. 8k, ultra sharp.
```

**Alternativa (más local/cálida):**
```
Small computer repair shop in a Spanish town, warm professional atmosphere.
Glass front, organized shelves with tech products, modern interior with dark
tones and orange accent lighting. No people. Professional architectural photography.
```

---

## 2. Sección "Sobre nosotros" / Nosotros
**Uso:** Foto de la tienda o del equipo
**Dimensiones:** 800×600 px o 1200×800 px

**Prompt:**
```
Friendly Spanish computer technician in a small tech shop, working on a PC.
Casual professional attire. Warm, approachable expression. Dark modern shop interior
with organized shelves of computer parts behind them. Natural lighting mixed with
warm artificial light. Professional portrait photography, Canon 85mm lens.
```

---

## 3. Servicio técnico (reparación)
**Uso:** Sección de servicios de reparación
**Dimensiones:** 800×600 px

**Prompt:**
```
Close-up of skilled hands repairing a laptop motherboard with precision tools.
Anti-static mat on a clean workbench. Electronic components in focus. Soft dark
background with warm workshop lighting. Professional macro photography. No faces.
Sharp focus on soldering or component detail.
```

---

## 4. Soluciones para empresas
**Uso:** Página de empresas / banner
**Dimensiones:** 1200×600 px

**Prompt:**
```
Modern small business office with professional network setup: server rack, clean
cable management, dual monitors, networking equipment. Dark professional aesthetic
with blue and orange accent lighting. No people. Technology and productivity.
Wide angle architecture photography.
```

---

## 5. Equipos reacondicionados / stock
**Uso:** Sección de stock / productos
**Dimensiones:** 800×600 px

**Prompt:**
```
Neatly arranged refurbished desktop computers on clean white/dark shelves in a
tech store. HP and Lenovo small form factor PCs lined up with price tags.
Professional product photography. Neutral background. Sharp and clean.
```

---

## 6. Logo SVG (si se quiere rehacer)
El logo actual es un JPG con fondo oscuro. Para tener una versión SVG limpia:

- Fondo: `#1c1c1c` (rectángulo redondeado)
- "D" en gris: `#888`
- "istrito": degradado de `#cc2200` a `#ff6600`
- "PC": blanco `#f0f0f0` con ligero tono naranja
- Icono power en la "o": `#ff5500`
- URL: `#ff6600` en fuente monoespaciada pequeña

**Para generar con IA:**
```
Minimalist tech company logo for "Distrito PC". Dark charcoal background (#1c1c1c),
the word "Distrito" in bold sans-serif with a fire orange-red gradient, "PC" in
clean white. Small power button icon integrated into the letter "o". Below, small
URL text in orange. Professional, modern, tech aesthetic. Vector style, clean edges.
```

---

## 7. Imagen OG (Open Graph / redes sociales)
**Uso:** `public/images/og-image.jpg` para compartir en redes
**Dimensiones:** 1200×630 px

**Prompt:**
```
Social media card for "Distrito PC" tech store. Dark background (#0e0e13), bold
orange logo centered, tagline "Expertos en tecnología, cerca de ti" in white text.
Location "Fuensalida, Toledo" in smaller text. Clean professional design.
Tech/circuit board subtle pattern background texture. Orange gradient accents.
```

---

## Herramientas recomendadas

| Herramienta | Acceso | Puntos fuertes |
|---|---|---|
| **Midjourney** | Discord / web | Mejor calidad fotográfica |
| **DALL-E 3** | ChatGPT Plus / API | Fácil de iterar con texto |
| **Adobe Firefly** | adobe.com | Seguro para uso comercial |
| **Stable Diffusion** (Automatic1111) | Local/gratis | Control total, sin coste |
| **Ideogram** | ideogram.ai | Bueno con texto en imagen |

**Nota:** Descarga siempre en la mayor resolución disponible y guarda en
`public/images/` con nombres descriptivos (ej. `hero-taller.jpg`, `nosotros-tienda.jpg`).
