import nodemailer from "nodemailer";

// Nodemailer a besoin du runtime Node (pas edge).
export const runtime = "nodejs";

// Destinataires : par défaut les deux adresses (modifiable via CONTACT_TO).
const RECIPIENTS = (
  process.env.CONTACT_TO ||
  "matteo.ghigo@nestiveprod.com,thenestivepro@gmail.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const nom = (data.nom || "").trim();
  const email = (data.email || "").trim();
  const projet = (data.projet || "").trim();
  const date = (data.date || "").trim();
  const message = (data.message || "").trim();
  const website = (data.website || "").trim(); // pot de miel anti-bot

  // un bot remplit le champ caché → on fait comme si c'était envoyé
  if (website) return Response.json({ ok: true });

  if (!nom || !email || !message) {
    return Response.json(
      { error: "Le nom, l'email et le message sont requis." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return Response.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return Response.json(
      { error: "Le service d'envoi n'est pas configuré sur le serveur." },
      { status: 500 }
    );
  }
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  const from = process.env.CONTACT_FROM || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const rows: [string, string][] = [
    ["Nom", nom],
    ["Email", email],
    ...(projet ? ([["Type de projet", projet]] as [string, string][]) : []),
    ...(date ? ([["Date envisagée", date]] as [string, string][]) : []),
  ];
  const esc = (s: string) =>
    s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));

  const text =
    rows.map(([k, v]) => `${k} : ${v}`).join("\n") + `\n\n${message}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#141413;line-height:1.6">
      <h2 style="margin:0 0 16px">Nouveau message depuis le site</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:2px 16px 2px 0;color:#777">${k}</td><td style="padding:2px 0"><strong>${esc(
                v
              )}</strong></td></tr>`
          )
          .join("")}
      </table>
      <div style="white-space:pre-line;border-top:1px solid #eee;padding-top:16px">${esc(
        message
      )}</div>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"Site Ghigo Matteo" <${from}>`,
      to: RECIPIENTS,
      replyTo: `"${nom}" <${email}>`,
      subject: `Nouveau contact · ${nom}`,
      text,
      html,
    });
  } catch (err) {
    console.error("Envoi email échoué :", err);
    return Response.json(
      { error: "L'envoi a échoué. Réessayez ou écrivez-nous directement." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
