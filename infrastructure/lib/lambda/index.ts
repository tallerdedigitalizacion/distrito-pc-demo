import {
  SESv2Client,
  SendEmailCommand,
  type SendEmailCommandInput,
} from '@aws-sdk/client-sesv2';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

const ses    = new SESv2Client({ region: process.env.REGION ?? 'eu-west-1' });
const FROM   = process.env.FROM_EMAIL  ?? 'noreply@distritopc.com';
const TO     = process.env.TO_EMAIL    ?? 'tecnico@distritopc.com';
const ORIGIN = process.env.CORS_ORIGIN ?? 'https://www.distritopc.com';

const CORS = {
  'Access-Control-Allow-Origin':  ORIGIN,
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function respond(status: number, body: Record<string, unknown>): APIGatewayProxyResultV2 {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...CORS },
    body: JSON.stringify(body),
  };
}

function sanitize(s: unknown): string {
  if (typeof s !== 'string') return '';
  // Strip HTML tags and limit length
  return s.replace(/<[^>]*>/g, '').trim().slice(0, 2000);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {

  if (event.requestContext.http.method === 'OPTIONS') {
    return respond(200, { ok: true });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return respond(400, { message: 'Cuerpo de la solicitud inválido.' });
  }

  // Honeypot: if "website" field is populated, silently discard
  if (body.website) {
    return respond(200, { ok: true });
  }

  const nombre    = sanitize(body.nombre);
  const apellidos = sanitize(body.apellidos);
  const email     = sanitize(body.email);
  const telefono  = sanitize(body.telefono);
  const asunto    = sanitize(body.asunto);
  const mensaje   = sanitize(body.mensaje);

  // Validation
  if (!nombre || !apellidos || !email || !asunto || !mensaje) {
    return respond(400, { message: 'Faltan campos obligatorios.' });
  }

  if (!isValidEmail(email)) {
    return respond(400, { message: 'La dirección de correo electrónico no es válida.' });
  }

  const fullName = `${nombre} ${apellidos}`;
  const now = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

  // ── Email to the store ──────────────────────────────────────
  const storeEmailParams: SendEmailCommandInput = {
    FromEmailAddress: `Distrito PC Web <${FROM}>`,
    Destination: {
      ToAddresses: [TO],
    },
    ReplyToAddresses: [`${fullName} <${email}>`],
    Content: {
      Simple: {
        Subject: {
          Data: `[Web] ${asunto} — ${fullName}`,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { background: #fff; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 32px; border-top: 4px solid #ff5200; }
  .label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .value { color: #111; font-size: 15px; margin-bottom: 16px; }
  .msg { background: #f9f9f9; border-left: 3px solid #ff5200; padding: 16px; border-radius: 4px; white-space: pre-wrap; color: #333; }
  .footer { margin-top: 24px; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 16px; }
</style></head>
<body>
<div class="card">
  <h2 style="color:#ff5200;margin-top:0;">Nuevo mensaje desde la web</h2>
  <div class="label">Nombre</div><div class="value">${fullName}</div>
  <div class="label">Correo electrónico</div><div class="value"><a href="mailto:${email}">${email}</a></div>
  ${telefono ? `<div class="label">Teléfono</div><div class="value">${telefono}</div>` : ''}
  <div class="label">Asunto</div><div class="value">${asunto}</div>
  <div class="label">Mensaje</div>
  <div class="msg">${mensaje}</div>
  <div class="footer">Recibido el ${now} · Formulario de contacto de distritopc.com</div>
</div>
</body>
</html>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: [
              'Nuevo mensaje desde la web de Distrito PC',
              '─'.repeat(40),
              `Nombre:   ${fullName}`,
              `Email:    ${email}`,
              telefono ? `Teléfono: ${telefono}` : '',
              `Asunto:   ${asunto}`,
              '',
              'Mensaje:',
              mensaje,
              '',
              `Recibido: ${now}`,
            ].filter(Boolean).join('\n'),
          },
        },
      },
    },
  };

  // ── Confirmation email to the user ──────────────────────────
  const confirmationParams: SendEmailCommandInput = {
    FromEmailAddress: `Distrito PC <${FROM}>`,
    Destination: {
      ToAddresses: [`${fullName} <${email}>`],
    },
    Content: {
      Simple: {
        Subject: {
          Data: 'Hemos recibido tu mensaje — Distrito PC',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { background: #1e1e2a; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 32px; }
  h2 { color: #ff5200; margin-top: 0; }
  p { color: #c0c0d0; line-height: 1.7; }
  .highlight { color: #f0f0f5; }
  .info { background: #16161e; border-radius: 6px; padding: 16px; margin: 20px 0; }
  .info p { margin: 4px 0; font-size: 14px; }
  a { color: #ff7733; }
  .footer { margin-top: 28px; font-size: 12px; color: #555; border-top: 1px solid #28283c; padding-top: 16px; }
</style></head>
<body>
<div class="card">
  <h2>¡Hemos recibido tu mensaje!</h2>
  <p>Hola <span class="highlight">${nombre}</span>,</p>
  <p>Gracias por contactar con <strong style="color:#ff7733;">Distrito PC</strong>. Hemos recibido tu consulta y te responderemos lo antes posible, normalmente el mismo día.</p>

  <div class="info">
    <p style="color:#7878a0;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Resumen de tu consulta</p>
    <p><strong class="highlight">Asunto:</strong> ${asunto}</p>
    <p><strong class="highlight">Recibido:</strong> ${now}</p>
  </div>

  <p>Si necesitas una respuesta urgente, no dudes en llamarnos:</p>
  <p style="font-size:18px;color:#f0f0f5;"><strong>925 73 30 19</strong> · <strong>667 51 52 07</strong></p>

  <div class="footer">
    <p>Distrito PC · C/ Juan de Ávila 4, local 2 · 45510 Fuensalida (Toledo)</p>
    <p><a href="https://www.distritopc.com">www.distritopc.com</a></p>
    <p>Este mensaje se ha generado automáticamente. No respondas a este correo.</p>
  </div>
</div>
</body>
</html>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: [
              'Hemos recibido tu mensaje — Distrito PC',
              '',
              `Hola ${nombre},`,
              '',
              'Gracias por contactar con Distrito PC. Hemos recibido tu consulta y te responderemos lo antes posible.',
              '',
              `Asunto: ${asunto}`,
              `Recibido: ${now}`,
              '',
              'Si necesitas respuesta urgente: 925 73 30 19 · 667 51 52 07',
              '',
              'Distrito PC · C/ Juan de Ávila 4, local 2 · 45510 Fuensalida (Toledo)',
              'www.distritopc.com',
            ].join('\n'),
          },
        },
      },
    },
  };

  try {
    await Promise.all([
      ses.send(new SendEmailCommand(storeEmailParams)),
      ses.send(new SendEmailCommand(confirmationParams)),
    ]);

    return respond(200, { ok: true, message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('SES send error:', err);
    return respond(500, { message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.' });
  }
}
