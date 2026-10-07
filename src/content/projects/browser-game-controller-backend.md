---
title: "Browser Game Controller Backend"
summary: "A backend that turns smartphones into game controllers, using their touchscreen, accelerometer and gyroscope as input for browser games."
year: 2016
tags:
  - "Game"
  - "Web"
cover: "/uploads/2016/07/vcController.png"
links:
  - label: "Code: virtual-console"
    url: "https://github.com/ChrisHaPunkt/virtual-console"
order: 28
legacyPaths:
  - "/browser-game-controller-backend/"
---

**Idea**

Smartphones have a multitude of sensors which could be used as input in order to control video games. For example the accelerometer and gyroscope measure movements and can for example simulate a steering wheel in a racing game. The touchscreen can be used to simulate buttons and be used like a game pad. In the near future the introduction of haptic feedback will make buttons on a touchscreen indistinguishable from real buttons enabling smartphones to replace traditional gamepads with the benefit of being omnipresent, wireless and customizable for each game.

We want to create a multiplayer gaming console, that can be worn in the trouser pocket and be used with controller hardware that is already available to most people, their smartphone. It should be also run on low-cost hardware and support free html5 games within the browser.

**Scenarios and Usage**

You can use our project for setting up a spontaneous gaming session in the living room or as a multiplayer experience in public spaces. It is used like a gaming console. The software runs on a machine that is connected both to a screen and a network. Smartphones are used as controller devices and also connected to the network. In order to play browsers the machine has also internet access.

**Features**

-   Console Start
    -   Hardware Connection(HDMI)
    -   W-LAN Setup
    -   Bootup Scripts
    -   Browser Kiosk Mode
-   Client Mamangement
    -   QR Scan
    -   Landscape Mode / Fullscreen (Home Screen Shortcut)
    -   Registration
    -   Login
-   Console Dashboard
    -   Overlay Menu
    -   Edit Key Mapping
    -   Add Game
    -   Start Game
-   Game Creation
    -   API Import
    -   API Configuration
    -   Controller Templates
    -   Communication with Clients and Server
    -   File placement

**Screenshots**

![vcController](/uploads/2016/07/vcController.png)

Controller

![gameFrontend](/uploads/2016/07/gameFrontend.png)

Dashboard

**Programmers**

-   Christian Heinrichs
-   Hannes Grothkopf
-   Michael Schleiss

**More at GitHub**

-   [https://github.com/ChrisHaPunkt/virtual-console](https://github.com/ChrisHaPunkt/virtual-console "https://github.com/ChrisHaPunkt/virtual-console")
