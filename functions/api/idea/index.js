// Idea-box intake for saxtonshowcase.com. Serves both the front-door form
// (/api/idea: name + contact + idea) and Amy's showcase form contract
// (/api/ideas: idea + optional email + page). Every valid submission is
// mailed to Rook and Amelia through Resend - the two inboxes are where an
// owner reads it, so a 2xx goes out only after Resend accepts.
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

// Best-effort rate limit: 5 submissions per IP per hour, per isolate.
const seen = new Map();
function limited(ip) {
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter(function (t) { return now - t < 3600000; });
  if (hits.length >= 5) return true;
  hits.push(now);
  seen.set(ip, hits);
  return false;
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

  // Honeypot: both forms hide a "website" field from people; bots fill it.
  // Pretend success so they move on, but mail nothing.
  if (String(fields.website || "").trim() !== "") return json({ ok: true });

  // Two shapes: front door (name/contact/idea) and showcase contract
  // (idea/email/page). idea is the only required field.
  const name = String(fields.name || "").trim().slice(0, 100);
  const contact = String(fields.contact || fields.email || "").trim().slice(0, 200);
  const idea = String(fields.idea || "").trim();
  if (idea.length < 5 || idea.length > 2000) return json({ error: "missing_fields" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (limited(ip)) return json({ error: "rate_limited" }, 429);

  const key = context.env.RESEND_API_KEY;
  if (!key) return json({ error: "not_configured" }, 500);

  const lines = [
    "New idea from the Saxton Showcase board",
    "",
    "Name: " + (name || "(not given)"),
    "Contact: " + (contact || "(not given)"),
    fields.page ? "Page: " + String(fields.page).slice(0, 100) : "",
    "",
    idea,
    "",
    "Sent " + new Date().toISOString() + " via saxtonshowcase.com"
  ].filter(function (l) { return l !== ""; });

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
      subject: "New idea from " + (name || "a visitor") + " - Saxton Showcase",
      text: lines.join("\n")
    })
  });

  if (!res.ok) return json({ error: "send_failed" }, 502);
  return json({ ok: true });
}
