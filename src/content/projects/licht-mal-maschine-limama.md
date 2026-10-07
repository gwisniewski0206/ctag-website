---
title: "Licht-Mal-Maschine (Light Painting Machine)"
summary: "Ein fahrender Roboter, der beliebige Grafiken vom PC oder Smartphone Spalte für Spalte in Langzeitbelichtungen malt."
semester: "WiSe 2019/20"
year: 2020
team:
  - "Jonas Heinzel"
  - "Philip Herrmann"
tags:
  - "Light"
  - "Robotics"
  - "Hardware"
cover: "/uploads/2020/01/2019-20-WS-CTAG-LiMaMa-Handheld-Engel.jpg"
order: 15
legacyPaths:
  - "/licht-mal-maschine-limama/"
---

### Einleitung

Im Rahmen dieses Projekts wurde ein Roboter namens LiMaMa (Licht-Mal-Maschine) entwickelt, mit dessen Hilfe beliebige Grafiken über einen PC oder ein Smartphone in Langzeitbelichtungen eines Fotoapparats einbelichtet werden können. Dies wird ermöglicht indem der Roboter während der Belichtungszeit durch das Sichtfeld der Kamera fährt und die zu projizierende Grafik spaltenweise über die vertikal am Fahrgestell montierte LED-Leiste wiedergibt. Die zugrundeliegende Technik ist auch als Lichtmalerei oder Lightpainting bekannt.

![LiMaMa Pic](/uploads/2020/01/2019-20-WS-CTAG-LiMaMa-Hardware.png)

Abb. 1) Die LiMaMa mit zugehörigem Fahrgestell

### Technische Umsetzung

Im Zentrum der Umsetzung von Hard- und Softwarekomponenten der LiMaMa befindet sich ein ESP32. Dieser Mikrocontroller besitzt eine CPU mit zwei Kernen, 16 MB Flash Speicher und 520 KB SDRAM, deren Leistung für die unterschiedlichen Aufgaben der LiMaMa ordentlich beansprucht wurde. Zu den Aufgaben der LiMaMa gehören:

-   das Auslesen einer SD Karte (in einem optionalen Micro-SD-Modul) mit der Grundkonfiguration der LiMaMa
-   die Ansteuerung der Motoren am Fahrgestell
-   die Verarbeitung von Bilddaten und das Ansprechen von 144 LEDs via RMT Modul
-   das Aufrechterhalten einer Netzwerkverbindung über den integrierten WiFi Controller
-   das Hosting eines Webservers mit einem kleinen Webinterface über welches die Konfiguration der LiMaMa vorgenommen wird
-   das Auslösen von Interrupts, um die LiMaMa während des Betriebs entweder über das Webinterface oder einen Button stoppen zu können

Neben des Fahrmodus mit dem Fahrgestell wurden in der LiMaMa auch Elemente verbaut, mit deren Hilfe sie bei Bedarf in einen “Händischen Modus” umgebaut werden kann. So sind die Platine mit dem ESP32 und entsprechender Elektronik, der Akku und der Hardwarebutton auf einer Holzplatte befestigt, welche sich über Schraubmuttern vom Fahrgestell lösen lässt und deren Form für das Halten in der Hand angepasst ist. Die Anschlüsse zu Motor und LED-Leiste können über Steckverbindungen gelöst werden und die LED-Leiste vom Fahrgestell auf die Holzplattte ummontiert werden. So kann schließlich auch per Hand Lichtmalerei betrieben und mit Hilfe des Hardwarebuttons bequem gestartet und gestoppt werden.

Das folgende Lightpainting ist an der Kieler Förde (Hörn) entstanden und zeigt, was zum Beispiel unter Einbezug von Reflexionen auf dem Wasser mit dem händischen Modus der LiMaMa möglich ist.

![](/uploads/2020/01/2019-20-WS-CTAG-LiMaMa-Handheld-Engel.jpg)

Abb. 2) LiMaMa im händischen Modus

Der Mikrocontroller der LiMaMa wurde vollständig in der Programmiersprache C mit dem Espressif IoT Development Framework (edp-idf) umgesetzt und das Webinterface mit Code der Sprachen HTML, CSS und insbesondere JavaScript geschrieben.

![WebInterface](/uploads/2020/01/2019-20-WS-CTAG-LiMaMa-Webinterface.png)

Abb. 3) Das Webinterface, erreichbar über einen beliebigen Webbrowser

Über das Webinterface kann der Benutzer mit der LiMaMa interagieren, was sonst lediglich in geringem Umfang (starten / stoppen der LiMaMa) über den Hardwarebutton an der Holzplatte möglich ist. So können hier unter anderem Bilder hochgeladen, die Fahrtgeschwindigkeit eingestellt, die Lichtintensität der LEDs (auch für die einzelnen RGB Kanäle) und eine Darstellungsverzögerung angepasst und Wiederholungen des einzublendenden Bildes eingestellt werden.

Außerdem können zahlreiche Einstellungen für die einzelnen Phasen der Fahrt der LiMaMa vorgenommen werden, welche das Resultat stark beeinflussen, so beispielsweise die Streckung oder Stauchung des Bildes über einen sogenannten Pixel delay, den Zeitpunkt während der Fahrt zu welchem das Bild eingeblendet wird, oder die Länge eines Countdowns, welcher von der LiMaMa auch visuell dargestellt wird.

### Ablaufphasen

Die Fahrt der LiMaMa ist in sechs Phasen gegliedert, deren Ziel eine reibungslose Darstellung des Bildes ist und die helfen, den Zeitpunkt der Aufnahme mit einer Kamera abzustimmen.

1.  **Countdown** : Lichtsignal bei 2 oder 10 Sekunden, je nach Länge des Countdowns
2.  **Start** : Beschleunigungsphase zum Erreichen einer konstanten Geschwindigkeit vor der Einblendung des Bildes
3.  **Vorlauf** : Einstellbare Verzögerung für den Start der Einblendung des Bildes während der Fahrt, um Ghosts (1) zu vermeiden
4.  **Bildeinblendung** : Spaltenweise Wiedergabe des Bildes auf der LED-Leiste
5.  **Nachlauf** : Ähnlich wie beim Vorlauf zur Vermeidung von Ghosts als Sicherstellung, dass die LiMaMa nicht während der Belichtungszeit im Bild stehen bleibt
6.  **Stop** : Anhalten nach Leerlauf des Bildpuffers oder bei Betätigung des Hardwarebuttons während der Fahrt

Nur in den Phasen 1 (Countdown) und 4 (Bildeinblendung) leuchten die LEDs an der LiMaMa. In den übrigen Phasen ist das Aufleuchten der LEDs zur Vermeidung fehlerhafter Einbelichtungen nicht gewünscht und sie bleiben schwarz (“aus”).

In der Praxis wird vor einer Fahrt im Webinterface nach Hochladen eines Bildes in Abhängigkeit der kalibrierten optimalen Fahrgeschwindigkeit eine errechnete Belichtungszeit angezeigt. Diese gilt dann als Grundlage für die Belichtungszeit der Kamera, welche in der Regel geringfügig höher angesetzt wird, um keine Bildanteile während der Belichtung abzuschneiden. Anschließend wird in der Kamera ein Selbstauslöser mit einer Verzögerung von 2 oder 10 Sekunden eingestellt. Für einen Selbstauslöser von 2 Sekunden wäre ein Countdown von 4 oder mehr Sekunden passend, bei welchem dann bei 3 Sekunden Restzeit die LED-Leiste blau eufleuchtet und bei 2 Sekunden Restzeit wieder erlischt, was den Zeitpunkt zum Auslösen der Kamera markiert. Anschließend beginnt die Fahrt mit den im Webinterface vorkonfigurierten Einstellungen und die Kamera fängt das gewünschte Bild ein. Hier bietet sich die Verwendung einer Digitalkamera mit manuellem Modus (M) an, bei welchem man neben der Belichtungszeit und einem Selbstauslöser auch die Sensorempfindlichkeit (ISO) und die Blende einstellen kann. Hilfreich sind auch ein stabiles Stativ sowie ein Funkauslöser um in der kalten Jahreszeit die Kamera aus der Jackentasche heraus auslösen zu können.

### Ergebnisse & Fazit

Nach der Umsetzung aller wichtigen Hardware- und Softwarekomponenten wurden erste Grafiken erstellt, mit denen die LiMaMa an der Kieler Förde einem ersten, richtigen Praxistest unterzogen werden konnte. Schwarze Flächen sind hierbei als transparente Pixel zu interpretieren, da die LEDs an entsprechenden Stellen aus bleiben.

![LiMaMa Grafik 1 Upload](/uploads/2020/01/2019-20-WS-CTAG-LiMaMa-1.png)

Abb. 4) Upload-Grafik für den Praxistest

Nach Upload der Grafik über das Webinterface auf einem Smartphone und Einstellen der passenden Parameter für die Fahrt führte das obere Bild zu folgendem Resultat.

![LiMaMa Grafik 1 Result](/uploads/2020/01/2019-20-WS-CTAG-LiMaMa-1-result.jpg)

Abb. 5) Resultat des Praxistests

Mit der LiMaMa lassen sich somit auch fotorealistische Motive “in den Raum malen”, welche lediglich einer Limitierung durch die Länge der LED-Leiste unterliegen.

Durch den unvermeidbaren Abstand der einzelnen LEDs voneinander sind in geringem Maße, je nach Skalierung des Bildes, auch die einzelnen Zeilen erkennbar. Mit einer höheren Dichte vertikal angeordneter LEDs ließe sich dieser Effekt noch minimieren, jedoch war die erreichte Qualität der Darstellung von Bildern im Rahmen dieses Projektes und in Anbetracht der zur Verfügung stehenden mehr als zufriedenstellend und hat unsere Erwartungen an die Ergebnisse definitiv übertroffen.

Ferner hat die LiMaMa noch viel Potential für Erweiterungen und Anpassungen, die in der Zukunft in aufbauenden Projekten umgesetzt werden könnten, wie beispielsweise:

-   Verbauen besserer Motoren für eine präzisere Kontrolle über die Geschwindigkeit und das Ermöglichen von nicht-geraden Fahrstrecken, beziehungsweise Kurven
-   Verbauen größerer Räder, welche die Fahrt auf unebenem Untergrund vereinfachen und verwackelten Bildern vorbeugen
-   Verringerung des Abstandes der LEDs für einen geringeren “Streifen-Effekt” des einbelichteten Bildes im Resultat
-   Einsatz eines höheren Turmes mit mehr LEDs
-   uvm.

### Erläuterungen

(1) Ghosts

> Als Ghosts verstehen wir einen Effekt bei Langzeitbelichtungen, bei denen Objekte über einen Teil der Belichtungszeit in einer Position verharren und in einem anderen Teil entweder in Bewegung sind oder sich dem Bildfeld entziehen. Entsprechende Objekte wirken im resultierenden Bild transparent, bei Personen hat es den Anschein geisterhafter Silhouetten, wovon sich auch die Bezeichnung “Ghost” ableiten lässt.

### Autoren

Jonas Heinzel
Philip Herrmann

Creative Technologies – Wintersemester 2019/20
