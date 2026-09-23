// Idea-box intake for saxtonshowcase.com. POSTs from the front-door form
// land here; we mail them to Rook and Amelia through Resend.
// Secret lives in the Pages project env (RESEND_API_KEY), never in the repo -
// same pattern as MUSE_CONNECTOR_TOKEN in /api/shop-inventory.

const TO = ["rook@mail.instinct.com", "asaxton1010@gmail.com"];
const FROM = "Saxton Showcase <ideas@saxtonshowcase.com>";

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" }
  });
}

export async function onRequest(context) {
  const request = context.request;
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let fields;
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.indexOf("application/json") > -1) {
      fields = await request.json();
    } else {
      const fd = await request.formData();
      fields = Object.fromEntries(fd.entries());
    }
  } catch (e) {
    return json({ error: "bad_request" }, 400);
  }

  // Honeypot: the form hides a "website" field from people; bots fill it.
  // Pretend success so they move on, but mail nothing.
  if (String(fields.website || "").trim() !== "") return json({ ok: true });

  const name = String(fields.name || "").trim().slice(0, 100);
  const contact = String(fields.contact || "").trim().slice(0, 200);
  const idea = String(fields.idea || "").trim().slice(0, 4000);
  if (!name || !contact || idea.length < 10) return json({ error: "missing_fields" }, 400);

  const key = context.env.RESEND_API_KEY;
  if (!key) return json({ error: "not_configured" }, 500);

  const lines = [
    "New idea from the Saxton Showcase board",
    "",
    "Name: " + name,
    "Contact: " + contact,
    "",
    idea,
    "",
    "Sent " + new Date().toISOString() + " via saxtonshowcase.com"
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: "Bearer " + key,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: contact.indexOf("@") > -1 ? contact : undefined,
      subject: "New idea from " + name + " - Saxton Showcase",
      text: lines.join("\n")
    })
  });

  if (!res.ok) return json({ error: "send_failed" }, 502);
  return json({ ok: true });
}
