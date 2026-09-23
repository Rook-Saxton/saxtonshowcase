// Deck Check intake: Joe's MTG deck-builder preferences. The unlisted page
// at /deck-check/ posts here; every valid submission is mailed to Rook and
// Amelia through Resend, so a 2xx goes out only after Resend accepts.
// Same pattern as /api/idea: honeypot fakes success, per-IP rate limit,
// secret lives in the Pages project env (RESEND_API_KEY), never in the repo.

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

function one(v, max) {
  return String(v || "").trim().slice(0, max);
}

function many(fd, key, maxCount, maxLen) {
  return fd.getAll(key).map(function (v) { return one(v, maxLen); })
    .filter(function (v) { return v !== ""; }).slice(0, maxCount);
}

export async function onRequest(context) {
  const request = context.request;
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let fd;
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.indexOf("application/json") > -1) {
      const body = await request.json();
      fd = new Map(Object.entries(body));
      fd.getAll = function (k) {
        const v = this.get(k);
        return Array.isArray(v) ? v : (v === undefined ? [] : [v]);
      };
      fd.entries = Map.prototype.entries.bind(fd);
    } else {
      fd = await request.formData();
    }
  } catch (e) {
    return json({ error: "bad_request" }, 400);
  }

  // Honeypot: the page hides a "website" field from people; bots fill it.
  // Pretend success so they move on, but mail nothing.
  if (one(fd.get ? fd.get("website") : "", 200) !== "") return json({ ok: true });

  const name = one(fd.get("name"), 100);
  const contact = one(fd.get("contact"), 200);
  const format = one(fd.get("format"), 40);
  const formatOther = one(fd.get("format_other"), 100);
  const colors = many(fd, "colors", 6, 20);
  const budget = one(fd.get("budget"), 40);
  const power = one(fd.get("power"), 40);
  const win = many(fd, "win", 12, 60);
  const ramble = one(fd.get("ramble"), 4000);

  const anything = name || contact || format || formatOther || budget || power ||
    ramble || colors.length || win.length;
  if (!anything) return json({ error: "missing_fields" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (limited(ip)) return json({ error: "rate_limited" }, 429);

  const key = context.env.RESEND_API_KEY;
  if (!key) return json({ error: "not_configured" }, 500);

  const lines = [
    "Deck Check - new deck-builder preferences",
    "",
    "Name: " + (name || "(not given)"),
    "Contact: " + (contact || "(not given)"),
    "Format: " + (format === "Other" && formatOther ? "Other - " + formatOther : (format || "(not picked)")),
    "Colors: " + (colors.length ? colors.join(", ") : "(not picked)"),
    "Budget: " + (budget || "(not picked)"),
    "Power level: " + (power || "(not picked)"),
    "Likes to win: " + (win.length ? win.join(", ") : "(not picked)"),
    "",
    "Ramble:",
    ramble || "(nothing)",
    "",
    "Sent " + new Date().toISOString() + " via saxtonshowcase.com/deck-check"
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
      subject: "Deck Check: " + (name || "a brewer") + (format ? " wants a " + format + " deck" : " sent preferences"),
      text: lines.join("\n")
    })
  });

  if (!res.ok) return json({ error: "send_failed" }, 502);
  return json({ ok: true });
}
