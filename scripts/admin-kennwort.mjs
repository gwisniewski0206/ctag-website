#!/usr/bin/env node
// Richtet das Master-Kennwort für die Redaktion (/admin) ein.
// Ein GitHub-Token mit Schreibrecht auf dieses Repository wird mit dem Kennwort verschlüsselt
// (PBKDF2-SHA256, 600 000 Runden → AES-256-GCM) und als public/admin/vault.json gespeichert.
// Die Datei ist öffentlich; ohne Kennwort ist der Token darin nicht lesbar. Deshalb: lange Passphrase.
//
// Aufruf im eigenen Terminal (nicht in Chats/Logs):   npm run admin:kennwort
// Danach public/admin/vault.json committen und pushen.
// Kennwort ändern oder Token tauschen: Skript erneut ausführen. Zugang sperren: Token auf GitHub löschen.
import { readFile, writeFile } from 'node:fs/promises';
import { webcrypto as crypto } from 'node:crypto';
import readline from 'node:readline';

const ITERATIONS = 600_000;
const MIN_LENGTH = 16;

// Eingabe ohne Anzeige
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer.trim()); });
  });
}

const config = await readFile('public/admin/config.yml', 'utf8');
const repo = config.match(/^\s*repo:\s*(\S+)/m)?.[1];
if (!repo) throw new Error('repo in public/admin/config.yml nicht gefunden');

console.log(`Master-Kennwort für die Redaktion von ${repo}\n`);
console.log('1. GitHub-Token mit Schreibrecht nur auf dieses Repository:');
console.log('   github.com → Settings → Developer settings → Fine-grained tokens → Generate new token');
console.log(`   Repository access: nur ${repo} · Permissions → Contents: Read and write · Ablauf z. B. 1 Jahr\n`);

const token = await askHidden('Token: ');
const res = await fetch(`https://api.github.com/repos/${repo}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } });
if (!res.ok) throw new Error(`GitHub lehnt den Token ab (HTTP ${res.status}).`);
// Schreibrecht des Tokens selbst prüfen (repo.permissions zeigt nur die Rechte des Kontos, nicht die des Tokens):
// ein Git-Blob ohne Verweis anlegen – braucht "Contents: Read and write", ändert nichts am Repository und wird von GitHub aufgeräumt.
const probe = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  body: JSON.stringify({ content: 'ctag-admin-kennwort-pruefung', encoding: 'utf-8' }),
});
if (probe.status !== 201) {
  throw new Error(`Der Token darf nicht schreiben (HTTP ${probe.status}). Auf GitHub beim Token unter Permissions → „Add permissions“ → Contents: Read and write setzen.`);
}
console.log('   ✓ Token gültig, Schreibrecht vorhanden.\n');

console.log(`2. Master-Kennwort – mindestens ${MIN_LENGTH} Zeichen, am besten 4–5 zufällige Wörter.`);
const password = await askHidden('Kennwort: ');
if (password.length < MIN_LENGTH) throw new Error(`Zu kurz (mindestens ${MIN_LENGTH} Zeichen).`);
if ((await askHidden('Kennwort wiederholen: ')) !== password) throw new Error('Die Eingaben stimmen nicht überein.');

const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify({ token, repo })));
const b64 = (u8) => Buffer.from(u8).toString('base64');

await writeFile('public/admin/vault.json', JSON.stringify({
  v: 1, kdf: 'PBKDF2-SHA256', iterations: ITERATIONS, cipher: 'AES-256-GCM',
  salt: b64(salt), iv: b64(iv), data: b64(new Uint8Array(data)), created: new Date().toISOString().slice(0, 10),
}, null, 2) + '\n');
console.log('\n✓ public/admin/vault.json geschrieben. Jetzt committen und pushen – danach fragt /admin nach dem Kennwort.');
