---
title: "USB Audio Class 2 / I2S Bridge"
order: 27
year: 2016
legacyPaths:
  - "/linux-based-low-latency-multichannel-audio-system-2/usb-audio-class-2-i2s-bridge/"
---

**Entwicklung einer USB<-> I²S Bridge**

von Florian Haberkorn und Thomas Pöffel

* * *

**1.0 Aufgabenstellung**

Ziel des Projekts ist es, die von Creative Technologies AG entwickelte modulare Soundkarte face 2|4 um eine Komponente zu erweitern, welche eine Verbindung zwischen PC und dem Codec des face2|4 herstellt. Die Soundkarte verfügt über insgesamt vier Stereo Ausgänge und 2 Stereo Eingänge. Der Codec wird dabei über den Audio Datenbus I²S angesteuert, während die Steuersignale über SPI übertragen werden. Das digitale I²S Signal wird mittels des Codecs und dessen 24Bit-Digital/Analog-Wandler gewandelt.

Die in diesem Projekt entwickelte USB<-> I²S Bridge ermöglicht es, die Soundkarte per USB an einen UAC2 fähigen PC anzuschließen. Die USB<-> I²S Bridge wird vom PC als Audiogerät erkannt, und lässt sich als Wiedergabegerät auswählen.

Die Schwierigkeit der Aufgabe liegt an der USB-Schnittstelle und deren zwei  Standards, mit welcher sich Audiodaten über USB übertragen lassen.  Diese Standards heißen UAC-1 (USB Audio Class 1) und UAC-2 (USB Audio Class 2). Die Standards unterscheiden sich in den damit maximal möglichen Datenraten. So sind mit UAC-1 entsprechend der USB Full Speed Norm 12Mbit/s möglich, während mit UAC-2 und USB Hi-Speed 480Mbit/s möglich sind.

Die in unserem Projekt benötigte Datenrate berechnet sich zu:

![Formel 1](/uploads/2016/08/Formel-1.jpg)

96kHz ist dabei die geforderte Abtastrate des übertragenen Audio-Signals. Da die Soundkarte 4 Stereo Kanäle und 2 Stereo Eingänge und somit 12 Mono-Kanäle besitzt, wird dies in der Rechnung berücksichtigt. Um diese Datenrate übertragen zu können, wird der USB-Standard UAC-2 (USB Audio Class 2) benötigt.

**2.0 Projektdurchführung**

**2.1 Auswahl des digitalen Signalprozessors / Mikrocontrollers**

Die USB<-> I²S Bridge soll dabei auf Basis eines digitalen Signalprozessors bzw. Mikrocontrollers realisiert werden. Damit soll es später neben der Datenwandlung möglich sein, die Audiosignale zu bearbeiten, um so die Laufzeit und den Frequenzgang mittels Equalizer zu korrigieren. Zur Auswahl des Prozessors gelten folgende Anforderungen:

Anforderungen:

-   Kostengünstig
-   USB High-Speed Schnittstelle
-   SPI Schnittstelle
-   I<sup>2</sup>S Schnittstelle
-   Handhabbare Gehäusebauform
-   Idealerweise Floating Point Unit
-   Frei nutzbare Entwicklungsumgebung
-   Frei nutzbare Librarys

Neben dem von XMOS auf Audiotechnik spezialisierten Mikrocontrollern, kamen ein Analog Devices ADSP-BF700 DSP und ein STM32F746 Mikrocontroller in die engere Auswahl. Die Entscheidung fiel dabei auf den zuletzt genannten Mikrocontroller der Marke ST. Vorteil dieses Controllers ist es, dass die Library, im Gegenteil zu der von XMOS, kostenlos nutzbar ist. Des Weiteren lassen  sich im Internet einige Beispielprojekte aus dem Audiobereich finden. Der Controller entspricht allen oben genannten Anforderungen und das Evaluationsboard ist mit einem Preis von 50€ sehr günstig. In Anbetracht der Aktualität ist der Mikrocontroller State-of-the-Art und bietet für uns eine gute Möglichkeit auf diesem Bereich Erfahrungen zu sammeln.

**2.2 Einarbeitung und Inbetriebnahme**

Da wir keine Vorerfahrungen mit Prozessoren aus der ARM-Schiene hatten, galt es in der ersten Zeit, sich mit der Hard- und Software vertraut zu machen. Wir probierten einige Entwicklungsumgebungen aus, und entschieden uns letztlich für die Keil µVision IDE, welche in einer freien Version online verfügbar ist ([http://www2.keil.com/mdk5/uvision/](http://www2.keil.com/mdk5/uvision/)).

ST bietet unter dem Namen „Cube“ ein Softwarepaket an, in welchem viele Beispielprogramme bereitgestellt werden. Dazu zählt unter anderem ein Programm, welches den Controller als Massenspeicher initialisiert und ein Programm, welches eine Audioübertragung auf UAC-1 Basis ermöglicht. Letzteres nutzen wir als Ausgangsprojekt für unsere Arbeiten.

**2.3 Verifikation der USB Übertragungsrate**

Da es sich bei den Geschwindigkeitsangaben der USB Verbindung um theoretische Werte handelt, verifizieren wir zuerst, ob der verbaute USB Controller unseren Anforderungen genügt. Dazu nutzen wir das oben genannte Massenspeicherprogramm und eine Class-10 µSD Karte. Ein erster Test zeigte ein ernüchterndes Ergebnis. Die Datenrate liegt bei 2,8 Mbit/s und ist damit weit von den benötigten 27,64Mbit/s entfernt. Wie wir herausfanden sind dabei im Quellcode einige Faktoren, welche die Übertragungsrate limitieren. Folgende drei Parameter haben wir dabei optimiert:

![Bild 2](/uploads/2016/08/Bild-2.jpg)

Durch die Maximierung des Q Wertes des PLLs ist es möglich den USB Controller mit maximalem Takt anzusteuern. Dies hat in Verbindung mit der Optimierung Heap Size und der Media Packet Größe dazu geführt, dass wir die erforderliche Datenrate erreicht haben.

![Bild 3](/uploads/2016/08/Bild-3.jpg)

![Formel 4](/uploads/2016/08/Formel-4.jpg)

**2.4 UAC-1**

**2.4.1 Funktionalitätstest**

Mit dem zur Verfügung gestellten Beispielprogramm des STM32F746, welcher eine USB Audio Class 1 Datenübertragung ermöglicht, haben wir eine erfolgreiche Testmessung gemacht.

![Bild 5](/uploads/2016/08/Bild-5.jpg)

Wir speisten über die USB Schnittstelle einen 1kHz Sinussignal ein. Am Ausgang des auf dem Board integrierten Codecs messen wir das erwartete Signal. Der Standard UAC-1 funktioniert mit dem STM32F746NG.

**2.4.2 Erstellen einer UART Debugging Umgebung**

Da es nur schwer möglich ist Audiodaten zu debuggen, erweiterten wir das Programm um eine UART Schnittstelle, mit welcher es möglich ist, die per USB übertragenen Daten wieder digital auszugeben. Die UART Schnittstelle nutzt dabei UART 6 und greift direkt auf den FIFO der USB Schnittstelle zu. Die per USB eingegebenen Daten werden somit direkt wieder ausgegeben. Damit es möglich zu überprüfen, ob die Daten richtig beim Board ankommen, also ob der UAC-1 bzw. UAC-2 Standard korrekt arbeitet. Der entsprechende Pin befindet sich auf der rechten Sockelleiste an unterster Stelle. Dieser Pin kann mittels eines FTDI-Moduls mit einem PC und entsprechender Software wie „TeraTerm“ verbunden werden.

![Bild 6](/uploads/2016/08/Bild-6.jpg)

Bei der Initialisierung des UART ist zu beachten das beim STM nur Peripherien angesprochen werden dessen Clock aktiviert ist. Anschließend müssen die Parameter der Pins RX und TX gesetzt werden. Bei jedem Byte das gesendet wird, müssen die Parameter des UART neu an die Sendefunktion übergeben werden.

![USART](/uploads/2016/08/USART.png)

Nachdem der UART erfolgreich initialisiert und getestet war, übertrugen wir erneut den 1kHz Sinus, um zu überprüfen ob sich dieser mit der UART Schnittstelle rekonstruieren lässt.

![Bild 8](/uploads/2016/08/Bild-8.jpg)

Die untere Kurve zeigt die Datenbits der UART Schnittstelle. Diese Daten greifen wir an dem Eingangs FIFO des Controllers ab. Wir nehmen diese Datenbits und wandeln sie mithilfe von MATLAB in eine Kurve um:

![Bild 9](/uploads/2016/08/Bild-9.jpg)

Die über die UART-Schnittstelle ermittelten Daten spiegeln den eingespeisten Sinus von 1kHz eindeutig wieder. Nach diesem Test können wir uns der Entwicklung der USB Audio Class 2 Schnittstelle zuwenden.

**2.5 UAC-2**

Um an die Entwicklung von USB Audio Class 2 heranzugehen, muss zuerst erläutert werden, wie eine USB Schnittstelle überhaupt Geräte erkennt.

Damit ein USB-Gerät von PC erkannt wird, müssen vom Endgerät mehrere sogenannte „Header-Felder“ oder auch Deskriptoren übertragen werden.

![Bild 10](/uploads/2016/08/Bild-10.jpg)

Quelle: [http://www.sprut.de/electronic/interfaces/usb/deskriptor.htm](http://www.sprut.de/electronic/interfaces/usb/deskriptor.htm)

-   Der „Device Deskriptor“ sagt aus, welches Gerät angeschlossen ist.

-   Der „Konfiguration Deskriptor“ sagt aus, wie das Gerät vom PC eingestellt werden kann (z.B. welches maximalen Stromverbrauch es benötigt)

-   Der „Interface Deskriptor“ sagt aus, welche Funktionen auf dem Gerät zur Verfügung stehen.

Wir haben uns dabei an dem Projekt von “[http://www.henryaudio.com/](http://www.henryaudio.com/)” orientiert, welcher seinen Quellcode offen zur Verfügung stellt ([https://github.com/borgestrand/sdr-widget/tree/audio-widget-experimental](https://github.com/borgestrand/sdr-widget/tree/audio-widget-experimental)).

Laut USB Audio Class 2 Spezifikation von der Webseite [www.USB.org](http://www.USB.org) wird ein Gerät als solches erkannt wenn folgende Parameter richtig eingestellt sind:

![Bild 11](/uploads/2016/08/Bild-11.jpg)

Aus diesem Abschnitt geht hervor, das die Variablen „bDeviceClass = 0xEF“, „bDeviceSubClass = 0x02“ und „bDeviceProtocol = 0x01“ sein müssen, damit das Gerät als UAC-2 erkannt wird. Der restliche Device Deskriptor muss dem USB 2.0. Standard entsprechen.

Mit dem Programm „Thesycon USB Descriptor Dumper“, welches wir zum Auslesen von Deskriptoren nutzen, können wir sehen, dass die von der USB Spezifikation geforderte Werte richtig übertragen werden.

![Bild 12](/uploads/2016/08/Bild-12.jpg)

 Untenstehendes Bild zeigt den „Configuaration Deskriptor“ und wie in Abbildung 4 schon erwähnt, den Stromverbrauch des DSPs der über die Schnittstelle benötigt wird.

![Bild 13](/uploads/2016/08/Bild-13.jpg)

Nachdem wir, anhand des Beispiels von Henry Audio, alle Deskriptoren eingebunden haben, nutzen wir einen Linux PC um die UAC-2 Schnittstelle zu testen. Nach dem anschließen des Controller müssen wir feststellen, dasa der Controller nicht als Audio Gerät erkannt wird. Mit dem Befehl „lsusb“ suchen wir nach möglichen Fehlerquellen.

![Bild 14](/uploads/2016/08/Bild-14.jpg)

Hinter der Variable „bDeviceSubClass“ setzt Linux ein Fragezeichen, welches auf einen Fehler hinweisen soll. Allerdings ist dieser Wert entsprechend der USB-Spezifikation richtig. Aus Zeitgründen war dies nun der Endpunkt unseres Projekts.

**3.0 Fazit**

Prinzipiell ist eine Realisierung einer UAC-2 Schnittstelle mit dem STM32F746NG möglich. Die geforderten Deskriptoren werden richtig an den PC übertragen. Lediglich deren zugewiesene Werte scheinen fehlerhaft zu sein. Der Controller genügt daher allen Hardwareanforderungen, sodass im Weiteren nur die Software auf UAC-2 angepasst werden muss. Wenn dies funktioniert, bietet der Baustein für 10€ eine sehr gute Möglichkeit die face2|4 Soundkarte zu ergänzen.

Download aktueller Entwicklungsstand: [Quellcode USB-I2S Bridge](/uploads/2016/08/Quellcode-USB-I2S-Bridge.rar)
