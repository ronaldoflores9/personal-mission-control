export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'Email requerido' }), { status: 400 });
  }

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321' },
  });

  if (linkError || !data?.properties?.action_link) {
    return new Response(
      JSON.stringify({ error: linkError?.message ?? 'No se pudo generar el enlace' }),
      { status: 500 }
    );
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const { error: emailError } = await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: email,
    subject: 'Tu enlace mágico — Centro de Mando ✦',
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0b1220;font-family:'Courier New',Courier,monospace;color:#c8d8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1220;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#101929;border:1px solid #1e2f4a;border-radius:8px;padding:40px 36px;">
          <tr>
            <td>
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#4a90d9;">CENTRO DE MANDO</p>
              <h1 style="margin:0 0 24px;font-size:22px;color:#e8f0fa;font-family:Georgia,serif;font-weight:700;">Tu enlace mágico ✦</h1>
              <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#8aafd4;">
                Haz clic en el botón de abajo para entrar al Centro de Mando. El enlace expira en 60 minutos.
              </p>
              <a href="${data.properties.action_link}" style="display:inline-block;background:#e05a1a;color:#fff;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:4px;">
                Entrar al Centro de Mando
              </a>
              <p style="margin:28px 0 0;font-size:11px;color:#3a5070;line-height:1.6;">
                Si no pediste este enlace puedes ignorar este correo con seguridad.<br />
                El enlace solo funciona una vez.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  if (emailError) {
    return new Response(JSON.stringify({ error: emailError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
