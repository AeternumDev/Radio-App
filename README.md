# Radio-App (Prototyp)

Prototypische Radio-App, entwickelt im Rahmen eines Gruppenprojekts an der **IU Internationale Hochschule**.

Die Anwendung basiert auf dem **Next.js + Tailwind CSS + Ionic Framework + Capacitor Mobile Starter** von Max Lynch:  
https://github.com/mlynch/nextjs-tailwind-ionic-capacitor-starter

## Zielsetzung und Funktionsumfang

Die Anwendung dient der prototypischen Darstellung zentraler Funktionen einer Radio-App. Implementiert sind:

- **Radiosender-Informationen** inklusive Stream- und Playlist-Anzeige
- **Bewertung der Playlist**
- **Moderator-Bewertung** inklusive Kommentar; der Moderator erhält anschließend eine **Benachrichtigung**
- **Song-Wunsch** (Song Request)
- **Recap-Funktionen**:
  - Top-Künstler
  - Hörverhalten
  - meist gehörter Sender
  - Musikprofil

## Demo-Benutzer und Persistenz

- Zwei Demo-Accounts sind in `mock/users.mock.ts` hinterlegt (Benutzer und Moderator).
- Persistenz:
  - Benutzerdaten und Einstellungen: **IndexedDB**
  - Session: **Session Storage**

## Technischer Stack

- **Next.js**
- **Tailwind CSS**
- **Ionic Framework (React)**
- **Capacitor** (native Container-App für iOS/Android; Ausführung in einer WebView)

## Plattformen

- Android
- iOS
- Web / PWA (browserbasiert)

## Voraussetzungen

- **Node.js** und **npm**
- Für Android: **Android Studio** inkl. Android SDK
- Für iOS: macOS mit **Xcode**

## Installation

````bash
npm install
````

`npm install` installiert alle in `package.json` definierten Abhängigkeiten (inklusive transitiver Abhängigkeiten) in `node_modules` und ist Voraussetzung für Build- und Laufzeitkommandos.

## Entwicklung (Browser) in Visual Studio Code

Für die lokale Entwicklung wird ein Next.js-Entwicklungsserver verwendet:

1. Projektordner in VS Code öffnen.
2. Terminal öffnen (**Terminal → Neues Terminal**).
3. Entwicklungsserver starten:

````bash
npm run dev
````

4. Browser öffnen: `http://localhost:3000`

Hinweise:
- Die Anwendung ist anschließend typischerweise unter `http://localhost:3000` erreichbar.
- Änderungen am Quellcode werden während der Entwicklung unmittelbar nach dem Speichern übernommen (Hot Reloading / Fast Refresh).
- Für native Tests ohne Live Reload sind Export- und Sync-Schritte erforderlich (siehe unten).

## Build (statischer Export)

Für iOS/Android wird ein statischer Export genutzt, sodass die Anwendung vollständig im Client (Browser/WebView) ausgeführt wird:

````bash
npm run build
````

Das Ergebnis wird in `./out/` abgelegt.

## Capacitor Sync

Nach dem Build werden die generierten statischen Dateien aus `./out/` in die nativen Plattformprojekte übernommen:

````bash
npm run sync
````

Dabei werden die Inhalte von `./out/` in die nativen Projektstrukturen von Android/iOS kopiert, sodass iOS/Android die Web-App innerhalb des nativen Containers laden können.

## Native Runs

````bash
npm run android
npm run ios
````

## Livereload / Instant Refresh (Capacitor)

Für Live Reload in der nativen App muss die WebView die Anwendung von einem laufenden Entwicklungsserver (Dev-Server) laden, statt der eingebetteten Dateien. Dies kann entweder temporär über Run-Kommandos mit Live-Reload-Optionen (z. B. `npx cap run android -l --external`) oder dauerhaft über `server.url` in `capacitor.config.*` erfolgen.

Beispiel (IP anpassen):
````json
{
  "server": {
    "url": "http://192.168.1.2:3000"
  }
}
````
Ohne Entwicklungsserver ist kein „echtes“ Live Reload in der nativen App möglich. Änderungen werden dann erst nach erneutem Sync sichtbar.

## SEO & Static Hosting

- Der statische Export enthält standardmäßig eine minimale HTML-Struktur (App-Shell) und übergibt die Darstellung an JavaScript. Die Anwendung ist daher nicht auf Suchmaschinenoptimierung ausgelegt.
- Der Output in `out/` kann auch auf einem statischen Hoster ausgeliefert werden.

## Einschränkungen

- **Server Side Rendering** ist in diesem Projektansatz nicht vorgesehen, da für die nativen Builds ein rein clientseitiger statischer Export genutzt wird.
- Die Navigation erfolgt primär über Ionic-Routing, um native Übergänge und konsistentes History-Management zu unterstützen.

## Credits

Dieses Projekt basiert auf dem Starter von Max Lynch:  
https://github.com/mlynch/nextjs-tailwind-ionic-capacitor-starter
