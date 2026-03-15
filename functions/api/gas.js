export async function onRequestPost(context) {
  const gasUrl = context.env.GAS_WEB_APP_URL;
  if (!gasUrl) {
    return json({ ok: false, message: 'GAS_WEB_APP_URL belum diset di Cloudflare Pages Environment Variables.' }, 500);
  }

  let body;
  try {
    body = await context.request.text();
  } catch (err) {
    return json({ ok: false, message: 'Body request tidak valid.' }, 400);
  }

  const upstream = await fetch(gasUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestGet(context) {
  return json({ ok: true, message: 'Cloudflare proxy aktif.' });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
