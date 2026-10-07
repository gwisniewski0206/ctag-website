---
title: "Space-game refactoring"
summary: "Mehrere getrennte Space-Game-Projekte zusammengeführt, aktualisiert und um eine KI sowie ein Ressourcensystem erweitert."
year: 2018
tags:
  - "Game"
  - "AI"
  - "Web"
cover: "/uploads/2017/11/main_view.png"
links:
  - label: "Code: space-refactor (GitLab)"
    url: "https://gitlab.iue.fh-kiel.de/ctag/space-refactor"
order: 24
legacyPaths:
  - "/space-game-refactoring/"
---

**Ziel des Projektes**

Zu dem Web basierenden Space Game Projekt, von Creative Technologies, existieren mehrere voneinander unabhängige Projekte.  Im Rahmen einer Bachelor Thesis wurden die ausgewählten Projekte sinnvoll zusammengeführt, aktualisiert und optimiert. Anschließend wurde eine Künstliche Intelligenz sowie ein Ressourcen System erstellt.

![](/uploads/2017/11/main_view.png)

Ingame Screenshot:   at the top – Gamescore,  at the topright – AI Ship, in the middle – Player Ship & Planets & Spacstations,  at the bottom – Keylayout, at the bottom left – Playerstatus Health & Shield, on the left – Ressource System

**Existierende Projekte**

-   1\. Space Game Visualization Engine

> [Space Game Visualization Engine](/projects/space-game-visualization-engine/)

-   2\. Auction System for Space Game

> [Auction System for Space Game](/projects/auction-system-for-space-game/)

-   3\. Procedural Generation, Systemviewer

> [Procedural Generation](/projects/procedural-generation/)

-   Artificial Intelligence

> [KI for Space Game](/projects/ki-for-space-game/)

**Projektdurchführung**

Zuerst wurde ein Plan für ein bestmöglichstes Zusammenführen der Projekte erstellt. Es wird in dem neuen Gesamtprojekt *webpack* statt *require.js* verwendet, eine Umstellung aller Projekte war von Nöten. Anschließend wurden alle Bibliotheken der Projekte auf dem Stand 08/2017 aktualisiert, die Projekte vorbereitet und zusammengeführt.

Performanz Analysen, in Bezug auf JavaScript sowie direkte Vergleiche von ECMAScript 6 und ECMAScript 5, wurden in den Browsern Google Chrome, Mozilla Firefox und Microsoft Edge durchgeführt. Mittels dieser Daten wurden die Projekte nach erfolgreicher Zusammenführung optimiert.

Abschließend wurde ein Künstliche Intelligenz mit Schwerpunkt auf das Pathfinding und Decision Tree Learning für ein Regelsystem entwickelt.

Um visuell sichtbare Messdaten für die KI zu erhalten wurde ein Ressourcen System basierend auf Siegpunkten für das Spiel eingeführt.

**Projektstruktur-** basierend auf  dem Projekt: Space Game Visualization Engine

-   **/css**– style definitions
-   **/docs**– documentation
-   **/gfx**– images for menu and player hud
-   **/js**– game logic
    -   **/app**– developed game modules
        -   **/AI** – AI logic
        -   **/sp\_core** – galaxy core data
        -   **/TradeSystem** –ressource System and Gameinfo
    -   **/data**– templates for planets, solar system structure, spaceship models
    -   **/lib**– third party libraries
    -   **/shaders**– developed shaders for planets
    -   **main.js**– starting point (first file loaded to start the game)
    -   **config.js**– configuration file for require.js containing paths to modules and libraries
-   **/textures**– textures (images) used in game
-   **html**– html container for the game

**Benutzte Bibliotheken**

Three.js, Tween.js, Pathfinding.js, Bootstrap, jQuery , Webpack, Hot module Replacement

**Benutzte Models**

Spaceship, Spacestations und Asteroiden Models stehen unter der Royality Free License.

![](/uploads/2017/11/config.png)

Main Menu Settings

![](/uploads/2017/11/map.png)

Systemviewer

**Links**

[Gitlab](https://gitlab.iue.fh-kiel.de/ctag/space-refactor)

**Author**

Richard Junggebauer 2017
