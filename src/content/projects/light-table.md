---
title: "Light Table"
summary: "Ein Tisch, dessen Platte von unten mit RGB-LEDs leuchtet und zugleich per Infrarotsensoren als „Touchscreen“ funktioniert – modular aufgebaut."
year: 2021
tags:
  - "Light"
  - "Hardware"
  - "Embedded"
cover: "/uploads/2021/06/WhatsApp-Image-2021-06-01-at-21.02.12.jpeg"
order: 4
legacyPaths:
  - "/light-table/"
---

## 1 Die Idee

Die Grundidee dieses Projektes ist es, einen Tisch zu entwerfen, dessen Tischplatte mit LEDs von unten beleuchtet werden kann. Zudem soll die Tischplatte auch wie ein “Touchscreen” fungieren.

### ![](/uploads/2021/06/WhatsApp-Image-2021-06-01-at-21.02.12.jpeg)1.1 Anforderungen

-   Tisch soll mit RGB-LEDs beleuchtet werden.
-   LEDs sollen in Pixel unterteilt sein.
-   Eingabemöglichkeit über Tischplatte
-   Preisrahmen von 500 Euro sollte nicht überschritten werden.
-   Aufbau sollte modular in der Größe sein.
-   Es soll ein zentrales Steuergerät geben.
-   Projekt sollte zeiteffizient umsetzbar sein.

## 2 Von der Idee in die Entwicklung

Im ersten Schritt musste eine geeignete Hardware gefunden und der grundlegende Aufbau erdacht werden. Der Aufbau soll aus einzelnen gleichen Modulen bestehen. Diese Module sollen dann untereinander verbunden werden und somit das Modul erweitert werden können.

### 2.1 Grundlagen

Kern des Ganzen ist die Nutzung von Infrarot-LEDs. Für den optischen Sensor wird nahes Infrarotlicht verwendet, welches sich an den sichtbaren Bereich anschließt und eine Wellenlänge von 780 nm bis 1400 nm hat. Für die Sensoren werden 5mm 950nm LEDs mit genutzt. Die Sender haben hierbei einen Winkel von 45 Grad und die Empfänger haben einen Winkel von 30 Grad. Grundsätzlich unterscheidet man 2 Arten von Infrarotsensoren, die aktiven und die passiven Sensoren. Während die passiven Sensoren aus einer einzelnen Empfänger LED bestehen, die auf das Umgebungslicht, wie beispielsweise die Sonnenstrahlung, reagiert, verfügen die aktiven Sensoren über eine eignene Quelle, die infrarotes Licht emittiert. In dem verbauten Modul kommt ein aktiver Infrarotsensor zum Einsatz. Dieser enthält einen Infrarotsender und einen Infrarotempfänger. Der Sensor funktioniert so, dass der Infrarotsender Licht mit einer Wellenlänge von 950nm ausstrahlt. Wenn sich ein Objekt über dem Sensor befindet, reflektiert dieses Objekt die Strahlung des Infrarotsenders und das Licht kann von dem Infrarotempfänger empfangen werden.  Eine einfache Schaltung für einen Infrarotsensor ist in folgender Abbildung dargestellt.

![](/uploads/2021/06/led.jpeg) ![](/uploads/2021/06/irsensor.png)

Diese Schaltung kommt aus Version 0.1 der Schematik und ist ein einfacher Infrarotsensor. Die LED D1 sendet infrarotes Licht, welches die Photodiode D6 dann empfängt. Der Potentiometer dient dazu das Level der Ausgabe zu bestimmen. D6 ist in Sperrrichtung geschaltet. Der Infrarotempfänger D6 ist in Sperrrichtung geschaltet. Das liegt daran, dass es sich bei dem Empfänger des Infrarotsensors um eine Photodioden handelt. Photodioden wer-den stets in Sperrrichtung betrieben. Auf die genaue Funktionsweise wird hier nicht weiter eingegangen, für das Verständnis der Schaltung reicht es aus zu wissen, dass der Photostrom, der bei Lichteinfall entsteht, sich proportional zum Lichteinfall verhält.

## 3 Iterationen der Entwicklung

Im Laufe der Entwicklung wurde in 4 Iterationen der Entwurf des Modells weiterentwickelt, wobei unter anderem die Anzahl der Pixel als auch die Kosten eine größere Rolle spielten. Die Schaltpläne der 4 Versionen sind in der folgenden Abbildung dargestellt.

![](/uploads/2021/06/merge.jpg)
Aus Gründen der Modularität ist jedes einzelne Modul mit einem Mikrocontroller ESP32 ausgestattet. Dies ist zwar nicht die kosten-effizienteste Lösung, da aber die Modularität in diesem Projekt eine höhere Priorität hatte als die Kosteneffizienz, wurde hier von weiteren Einsparungen abgesehen.

### 3.1 Version 0.1

In der ersten Version der Einzelmodule wurden pro LED je ein Operationsverstärker und ein Potentiometer verwendet. Jedoch war diese Variante für die angestrebte Obergrenze des Budgets zu teuer. Ein Operationsverstärker (im Folgenden als OpAmp bezeichnet) wie der MCP6001 kostet bei LCSC ~0.31 US $. Bei 9 LED je Modul und 49 Modulen summiert sich das zu 9\*49\*0.31=126,71 US $ nur für die Operationsverstärker. Hinzu kommen noch die Kosten für die Potentiometer (im Folgenden als Poti bezeichnet), die sich auf 9\*49\*0,20=88,20 US $ belaufen. Des Weiteren wurde ein DIP-Switch verbaut, der dazu dienen sollte, den Modulen Adressen für Bluetooth oder auch I2C zuzuweisen. Hierdurch wäre es nicht erforderlich gewesen, eine Änderung der Adresse in der Software vorzunehmen, sondern man hätte die Adresse binär mit dem DIP-Switch eingeben können. Da die DIP-Schalter außerdem sehr viele der GPIOs des ESP32 belegten, war die Anzahl der maximal möglichen LEDs pro Modul auf 9 beschränkt.
Version 0.1 existiert somit nur als Platinenentwurf, wurde aber nicht angefertigt.

### 3.2 Version 0.2

In Version 0.2 wurden die Receiver-LEDs der Infrarotsensoren an einen Multiplexer (74HC4067) angeschlossen, der wiederum mit dem OpAmp verbunden ist. Dies brachte 2 große Vorteile mit sich: Zum einen benötigt man pro Modul statt 9 nur noch einen OpAmp. Dies geht mit erheblichen Kostenersparnissen daher. Da die Kosten für einen 74HC4067 bei ~US\\$0.54 liegen, belaufen sich die Kosten für die OpAmps sowie Mulitplexer pro Modul auf 0.54\*49+0.31\*49=41.65US $ statt auf 126,71US $.
Zum anderen werden auch weniger GPIOs des ESP32 benötigt, da zuvor jeder der OpAmps an einen eignen GPIO angeschlossen war. Zur Ansteuerung des Muliplexers werden zusätzlich 4 GPIOs benötigt, dass es sich um einen 16 Bit Multiplexer handelt.
Es wurde darauf verzichtet, die Anzahl der LEDs pro Modul zu erhöhen, da nun zwar 13 GPIOs für die Infrarotsensoren zur Verfügung standen, aber aus Gründen der Modularität nur quadratische Module gewünscht waren. Trotzdem brachte die Einsparung an GPIOs den Vorteil mit sich, dass der Entwurf der Platine um einiges vereinfacht wurde.
Im Gegensatz zu Version 0.1 wurde die Platine Version 0.2 bestellt und durch JLCPCB hergestellt. Nachdem die Platine bestückt wurde, konnte diese von mir erfolgreich getestet werden.

### 3.3 Version 0.3

In Version 0.3 wurde der Schaltplan der Module noch einmal drastisch verändert. Das liegt nicht nur an Kosteneinsparungen, sondern auch an einer veränderten Funktionalität. Während in Version 0.1 und 0.2 lediglich vorgesehen war zu unterscheiden, ob sich ein Objekt über dem Infrarotsensor befindet oder nicht, sollte nun auch die Entfernung des Objekts berücksichtigt werden. Dies ist möglich, da sich der Photostrom des Infrarotempfängers und der Lichteinfall proportional zueinander verhalten. Dieses analoge Signal wird über die beiden 8 Bit ADCs ( Analog-Digital-Konverter) des ESP32 eingelesen und dort weiterverarbeitet. Außerdem wurden die Infrarotsensoren statt an 5 V an 3,3V angeschlossen, da die ADCs des ESP32 nur für Spannungen von maximal 3,7V ausgelegt sind.
Insgesamt führten diese Veränderungen dazu, dass Multiplexer und OpAmp nicht mehr benötigt wurden.
Im Codebeispiel weiter unten wird die Information der Entfernung verwendet, um die Farbe der LEDs zu verändern, je näher sich das Objekt am Sensor befindet.\\\\
Nicht nur ein Objekt, welches das Infrarote Licht reflektiert, beeinflusst den Inhalt Infrarotempfänger, sondern auch das sichtbare Licht enthält einen Anteil infraroten Lichts. Um die Empfindlichkeit der Infrarotsensoren zu regulieren, wurden in Version 0.1 und 0.2 Potentiometer verwendet. In Version 0.3 wurde entschieden, auf diese zu verzichten und die Empfindlichkeit der Sensoren auf Softwareebene über einen Offset zu regulieren.
Dieser Offset ist derzeit noch statisch gesetzt, soll aber, wenn das Projekt weiter vorangeschritten ist, von dem I2C-Master an alle Slavemodule geschickt werden. Der Wert für den Offset soll dann mittels eines einzelnen Potis, das am Mastermodul angeschlossen sein wird, von außen einstellbar sein, um auf dynamische Lichtverhältnisse zu reagieren.
Außerdem wurde auf den DIP-Switch verzichtet, auch seine Funktionalität wurde nun auch Softwareebene umgesetzt. Insgesamt führten diese Veränderungen zu einer erheblichen Kostenersparnis. Ebenso wie Version 0.2 wurde auch die Platine Version 0.3 hergestellt und erfolgreich getestet. Die folgenden Abbildungen zeigen die bestückte Platine Version 0.3.

![](/uploads/2021/06/WhatsApp-Image-2021-06-01-at-21.03.48-1.jpeg)

### 3.4 Version 0.4

Da in Version 0.3 eine große Anzahl an Bauteilen, die an den ESP32 angeschlossen waren, entfernt wurden, standen nun auch mehr GPIOs für die Infrarotsensoren zur Verfügung. Daher wurde in Version 0.4, die als endgültige Version der Slavemodule geplant ist, die Anzahl der LEDs pro Modul von 9 auf 16 erhöht. Außerdem wurde die Größer der Platine minimal verändert von 110mm x 110mm auf 95mm x 95mm, da so bei JLCPCB die günstigsten Platinen bestellt werden kann. Die Anzahl der verwendeten Module steigt somit von 49 (7×7 Module) auf 64 (8X8 Module). Insgesamt wird die LED-Tisch-Fläche dann aus 1024 einzelnen Pixeln bestehen. Außerdem wurde die Position der Infrarotsensoren verändert.
Da es zu einer Verzögerung der Lieferung kam, wurde die Platine Version 0.4 noch nicht getestet. In den folgenden Abbildungen ist die finale Version 0.4 der Platinen abgebildet.

 ![](/uploads/2021/06/Unbenannt.jpg) ![](/uploads/2021/06/unterseite.jpg)

## 4 EinzelModul

Damit der Tisch möglichst modular aufgebaut ist, wurde er in einzelne Module unterteilt. Diese Module können alleine ohne einen Master individuell arbeiten, aber auch in einen größeren Verbund zusammen geschlossen werden. Die optimale Lösung wäre gewesen, wenn jedes Infrarot-LED Paar mit einer LED für die Ausgabe jeweils ein Modul gebildet hätten. Jedoch wären die Kosten für die Komponenten zu groß geworden. Daher ist die Lösung, mehrere Infrarotsensoren auf eine Platine zu setzen. Die ermöglicht eine gute Balance aus Kosten und Modularität. In der aktuellen Version sind 4×4 also 16 Infrarotsensoren mit LEDs für die Ausgabe in einem Modul zusammengefasst. In der bei der Präsentation vorgestellten Version waren es noch 3×3 LEDs (Version 0.3). Für die Erhöhung der Anzahl der LEDs wurde sich entschieden, da mehr Pixel eben mehr Pixel sind. Dies ermöglicht es Dinge detaillierter darzustellen.
Wie auf dem Bild zu sehen ist, sind die LEDs für den Infrarotsensor direkt neben den LEDs für die Ausgabe. In der Version, die bei der Präsentation gezeigt wurde, war der Infrarotsensor noch möglichst weit weg von der Ausgabe-LED. Dies sollte dazu dienen, dass die LEDs keinen Schatten werfen, wenn sie so nahe an der leuchtenden LED sind. Jedoch blockiert dann der Rand des 3D gedruckten Begrenzung für die Pixel das Signal und es geht sehr viel von dem Winkel der LEDs vom Infrarotsensor verloren. Dies hat zu einer schlechteren Benutzbarkeit geführt.

## 5 ModulVerbund

Auf den einzelnen Modulen befinden sich 2x 4Pin JST Stecker, diese sind mit 5V, SDA, SCL und GND belegt. Wenn kein Bluetooth verwendet wird, können so mehrere Module hintereinander gehängt werden, um so einen größeren Verbund von Modulen zu erzeugen.
