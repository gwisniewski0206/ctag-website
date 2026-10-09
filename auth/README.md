# Anmeldedienst für die Redaktion

Cloudflare Worker [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) (MIT, Stand `4fd08b5`, 21.09.2026), unverändert.
Er vermittelt den Knopf **„Mit GitHub anmelden“** in `/admin`: GitHub schließt eine OAuth-Anmeldung nur mit einem
geheimen Schlüssel ab, der nicht in die öffentliche Seite gehört – hier liegt er als Secret im Worker.

- Adresse: `https://ctag-cms-auth.ctag-cms-auth.workers.dev` (Cloudflare-Konto des Nutzers, angelegt 09.10.2026)
- `ALLOWED_DOMAINS` in `wrangler.toml`: nur diese Seiten dürfen die Anmeldung nutzen → **eigene Domain ergänzen**, sobald sie aufgeschaltet ist.
- Secrets (im Cloudflare-Dashboard: Workers → ctag-cms-auth → Settings → Variables and Secrets):
  `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` aus der GitHub-OAuth-App „CTAG Redaktion“
  (Callback-URL `https://ctag-cms-auth.ctag-cms-auth.workers.dev/callback`).
- Wer sich anmelden darf, entscheidet GitHub: Mitarbeitende des Repositorys (Settings → Collaborators, Rolle *Write*).

Neu veröffentlichen: `npx wrangler deploy` in diesem Ordner (mit dem Cloudflare-Konto, dem der Worker gehört).
