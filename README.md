# Distrito PC — Web

Web moderna de Distrito PC construida con **Astro** + **Tailwind CSS** + backend en **AWS CDK** (Lambda + SES).

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | [Astro](https://astro.build) 4.x + Tailwind CSS |
| Backend | AWS Lambda (Node.js 20) + API Gateway HTTP API |
| Email | AWS SES v2 |
| Infraestructura | AWS CDK v2 (TypeScript) |

---

## Desarrollo local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con la URL de la API (ver sección de deploy del backend).
En desarrollo sin backend, deja la URL vacía — el formulario mostrará error,
pero el resto de la web funciona perfectamente.

### 3. Arrancar el servidor de desarrollo

```bash
npm run dev
# → http://localhost:4321
```

---

## Imágenes

Las imágenes del sitio están en `public/images/`. Por ahora solo hay el logo descargado del sitio original.

**Para las demás imágenes**, usa los prompts de [`IMAGE_PROMPTS.md`](IMAGE_PROMPTS.md) para generarlas con IA
(Midjourney, DALL-E 3, Adobe Firefly) o encarga fotografías profesionales.

Nombres de archivo esperados:
- `public/images/logo.jpg` — Logo (ya incluido)
- `public/images/og-image.jpg` — Imagen para redes sociales (1200×630)
- `public/images/hero.jpg` — Fondo del hero (opcional, ahora es CSS)
- `public/images/nosotros.jpg` — Foto de la tienda/equipo

---

## Deploy del backend (AWS CDK)

### Prerrequisitos

- [AWS CLI](https://aws.amazon.com/cli/) configurado con credenciales (`aws configure`)
- [Node.js 20+](https://nodejs.org)
- Cuenta de AWS con SES disponible en `eu-west-1`

### Verificar emails en SES (OBLIGATORIO antes del primer deploy)

```bash
# Verificar el email remitente
aws ses verify-email-identity \
  --email-address noreply@distritopc.com \
  --region eu-west-1

# Verificar el email receptor
aws ses verify-email-identity \
  --email-address tecnico@distritopc.com \
  --region eu-west-1
```

> ⚠️ **SES Sandbox**: en cuentas nuevas de AWS, SES está en modo sandbox y solo puede
> enviar a emails verificados. Para producción, solicita salir del sandbox en la consola
> de AWS SES.

### Instalar dependencias del CDK

```bash
cd infrastructure
npm install

# Instalar deps de la Lambda
cd lib/lambda
npm install
cd ../..
```

### Bootstrap CDK (solo la primera vez por cuenta/región)

```bash
npx cdk bootstrap aws://ACCOUNT_ID/eu-west-1
```

### Deploy

```bash
npm run deploy
```

El output mostrará la URL de la API. Algo como:

```
DistritoPC-ContactStack.ContactApiUrl = https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/contact
```

### Configurar la URL en el frontend

Copia esa URL en tu `.env`:

```
PUBLIC_CONTACT_API_URL=https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/contact
```

### Destruir el stack

```bash
npm run destroy
```

---

## Build para producción

```bash
npm run build
# Los archivos estáticos quedan en dist/
```

### Deploy estático

La web genera HTML/CSS/JS estático. Se puede alojar en:
- **Netlify** — arrastra la carpeta `dist/` o conecta el repo
- **Vercel** — importa el proyecto con preset Astro
- **AWS S3 + CloudFront** — bucket S3 con hosting estático + CDN

---

## Estructura del proyecto

```
districtpc.com/
├── src/
│   ├── components/          # Componentes Astro reutilizables
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── WhatsAppButton.astro
│   │   ├── Hero.astro
│   │   ├── ServicesSection.astro
│   │   ├── StockSection.astro
│   │   ├── BrandsSection.astro
│   │   ├── WhyUsSection.astro
│   │   ├── ContactSection.astro
│   │   └── ContactForm.astro
│   ├── layouts/
│   │   └── Layout.astro     # Layout HTML base (meta, fonts)
│   ├── pages/               # Una página por ruta
│   │   ├── index.astro
│   │   ├── informatica.astro
│   │   ├── servicio-tecnico.astro
│   │   ├── empresas.astro
│   │   ├── nosotros.astro
│   │   └── contacto.astro
│   └── styles/
│       └── global.css       # Tailwind + custom CSS
├── public/
│   └── images/              # Logo y demás imágenes
├── infrastructure/          # AWS CDK stack
│   ├── bin/app.ts           # Entrypoint CDK
│   ├── lib/
│   │   ├── contact-stack.ts # Stack: API GW + Lambda + IAM
│   │   └── lambda/
│   │       └── index.ts     # Handler Lambda (SES)
│   └── cdk.json
├── .env.example
├── astro.config.mjs
├── tailwind.config.mjs
└── IMAGE_PROMPTS.md         # Prompts para generar imágenes con IA
```

---

## Contacto / Soporte

- Tienda: C/ Juan de Ávila 4, local 2 · 45510 Fuensalida (Toledo)
- Tel: 925 73 30 19 · Móvil: 667 51 52 07
- Email: consulta@distritopc.com
