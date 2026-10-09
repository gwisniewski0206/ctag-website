# Anmeldedienst für die Redaktion

Cloudflare Worker [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) (MIT, Stand `4fd08b5`, 21.09.2026), unverändert.
Er vermittelt den Knopf **„Mit GitHub anmelden“** in `/admin`: GitHub schließt eine OAuth-Anmeldung nur mit einem
geheimen Schlüssel ab, der nicht in die öffentliche Seite gehört – hier liegt er als Secret im Worker.

- Adresse: `https://ctag-cms-auth.ctag-cms-auth.workers.dev` (Cloudflare-Konto des Nutzers, angelegt 09.10.2026)
- `ALLOWED_DOMAINS` in `wrangler.toml`: nur diese Seiten dürfen die Anmeldung nutzen → **eigene Domain ergänzen**, sobald sie aufgeschaltet ist.
- Secrets (im Cloudflare-Dashboard: Workers → ctag-cms-auth → Settings → Variables and Secrets):
  `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` einer **GitHub App** (nicht OAuth-App), Callback-URL
  `https://ctag-cms-auth.ctag-cms-auth.workers.dev/callback`, „Expire user authorization tokens“ aus, kein Webhook,
  Repository permissions nur **Contents: Read and write**, installiert **nur auf `ctag-website`**.
  Grund: Ein Token einer GitHub App reicht nur so weit wie die App installiert ist – wer sich anmeldet, gibt keinen Zugriff
  auf seine übrigen Repositories oder Organisationen frei (bei einer OAuth-App wäre es „repo“ = alle Repositories).
- Wer sich anmelden darf, entscheidet GitHub: Mitarbeitende des Repositorys (Settings → Collaborators, Rolle *Write*).
- Zieht das Repository in eine Organisation um: GitHub App dort installieren (nur auf dieses Repository) bzw. in die Organisation übertragen.

Neu veröffentlichen: `npx wrangler deploy` in diesem Ordner (mit dem Cloudflare-Konto, dem der Worker gehört).
