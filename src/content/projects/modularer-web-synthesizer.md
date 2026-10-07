---
title: "Modular Web Synth"
summary: "Ein modularer Synthesizer im Browser auf Basis der Web Audio API, der externe Geräte über einen Node.js-Server per WebSocket einbindet."
year: 2013
tags:
  - "Web"
  - "Synthesis"
cover: "/uploads/2013/12/Bildschirmfoto-2013-12-09-um-03.09.32.png"
order: 42
---

Ziel des Projektes ist, die Möglichkeiten der WebAudioApi zu testen und leicht zugänglich zu machen. Dabei werden(oder sollen bald) viele verschiedene Eingabequellen für Audio und Steuersignale unterstützt werden.

Das Projekt ist komplett in Javascript geschrieben. Die Sound Erzeugung geschieht komplett im Browser. Ein NodeJS Server verbindet externe Geräte über Websockets mit dem Browser.

Aktuelle Audio Quellen:

-   Wave-Generatoren
-   Mikrophon
-   Audio Dateien(lokal oder im Web erreichbar)

Unterstützung externe Hardware

-   Leap Motion(Hand Tracking -> X, Y, Z)
-   Midi In(Noten + CC)

Sonstiges

-   Diverse Filter
-   Spektrum und Waveform Darstellung
-   Umwandlung von Ton in Kontrollwerte

Bei Fragen oder Anregungen einfach eine E-Mail an [Torben Hartmann](mailto:torben.hartmann@student.fh-kiel.de) schicken.

-   ![](/uploads/2013/12/Bildschirmfoto-2013-12-09-um-03.09.32.png)
