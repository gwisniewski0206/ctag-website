---
title: "Battery Powered Amplifier and Sound Speaker System: mimaBox"
order: 30
year: 2016
---

![Header2](/uploads/2016/02/Header2.jpg)

## Inhaltsverzeichnis

[**1\. Entstehung der Idee**](#eins)
[**2\. mimaBox**](#zwei)
     **[2.1 Komponenten](#zweieins)**
     **[2.2 Software](#zweizwei)**
[**3\. Energieversorgung**](#drei)
[**4\. Batteriemonitor**](#vier)
[**5\. Lautsprecher**](#fünf)
[**6\. Subwoofer**](#sechs)
[**7\. Fazit**](#sieben)

## 1\. Entstehung der Idee

Man stelle sich folgende Situation vor:
Strand, 32° C, 20 Uhr, die Sonne geht gerade unter. Du und deine Freunde haben am Vormittag die letzte Prüfung geschrieben. Es ist Party angesagt. Der eine Kumpel hat einen Festivalbus und ein paar Lautsprecher dabei, die über eine Rollerbatterie und einen kleinen Verstärker mit USB-Anschluss befeuert werden. Der Sound ist nicht so geil, aber egal, das Semester ist vorbei. Im Laufe des Abends wird die Musik immer wieder unterbrochen, weil irgendjemand sein Handy oder einen USB Stick an den Verstärker anschließt. Immer mal wieder kleine Rangeleien sind die Folge. Auch wirst du das Gefühl nicht los, dass dieses eine Lied immer und immer wieder läuft, egal wer gerade sein Handy dran hat. Aber noch bevor du dich näher drüber wundern kannst, kippt irgendein Idiot (wahrscheinlich aus Versehen) Bier über die Kiste mit den Rollerbatterien. Kurzschluss – die Party ist vorbei.

Diese Situation war bei uns nicht nur einmal Realität. Eine Alternative musste her. Die handelsüblichen mobilen Boxen mit Batterieversorgung fielen ziemlich schnell aus dem Rennen. – Einfach zu leise und der Bass noch schlechter als bei der aktuellen Lösung. Also war ein Eigenbau unumgänglich.

Wir wollten also ein System, das:

-   ordentlichen Sound liefert (mit Bass !!)
-   eine Art Jukebox zum Voten von Liedern zur Verfügung stellt, um ständige Titelwiederholungen und Unterbrechungen zu vermeiden
-   mit einer partyfesten Hardware ausgestattet ist (Thema Bier und Akku)
-   Akkukapazität für ein ganzes Festivalwochenende mitbringt

Viele Mittagessen in der Mensa formten dann schließlich die Idee der **m**obilen, **i**nteraktiven **M**usik**a**bspiel Box, kurz **mima**Box und eines akkubetriebenen 2.1 Systems.

## 2\. mimaBox

Die mimaBox soll ein kleiner, leichter “Kasten” sein, der alles beinhaltet, um mit einem Soundsystem und einer Energiequelle eine Party zu starten. Dazu hat sie verschiedene Anschlussmöglichkeiten, unter anderem für eine Energiequelle, einen USB – Datenträger und für das Soundsystem. Im Inneren stellt ein Raspberry Pi die Software zur Verfügung, ein kleiner Verstärker ermöglicht es, auch ohne unseren externen Subwoofer zwei einzelne Boxen zu versorgen.

**2.1 Komponenten**

Alle Komponenten sind in einem kleinen Gehäuse aus Aluminium verbaut. An der Front befindet sich der Power Schalter und der Lautstärkeregler und an der Rückseite die Anschlüsse für (v.l.) Bildschirm, Strom, Lautsprecher, einen Umschalter zwischen internen und externen Verstärker, einen Anschluss für externen Verstärker und einen für Tastatur oder Datenträger.

<table><tbody><tr><td><img decoding="async" loading="lazy" class=" wp-image-708 size-medium aligncenter" src="/uploads/2016/02/IMG_20160218_145844.jpg" alt="IMG_20160218_145844" width="300" height="225"></td><td><img decoding="async" loading="lazy" class=" wp-image-709 size-medium aligncenter" src="/uploads/2016/02/IMG_20160218_145901.jpg" alt="IMG_20160218_145901" width="300" height="225"></td><td><img decoding="async" loading="lazy" class=" wp-image-710 size-medium aligncenter" src="/uploads/2016/02/IMG_20160218_145918.jpg" alt="IMG_20160218_145918" width="300" height="225"></td></tr></tbody></table>

**Raspberry Pi 2**

Bei der Entscheidung für den richtigen Ein-Platinen-Computer sorgten Faktoren wie Energieverbrauch, Leistung und Preis für eine gute Sortierung. Der Raspberry Pi Modell B und der Raspberry Pi 2 standen durch ihren geringen Verbrauch und Preis im Finale. Jedoch hatte das Modell B zu wenig Leistung. Deswegen wurde der geringfügige Mehrverbrauch des Pi 2 im Tausch gegen mehr Leistung in Kauf genommen.

**Hifi Berry**

Da die mimaBox modular aufgebaut ist und somit jedem Audiosystem zuspielen kann, haben wir uns dazu entschieden, bestmögliche Audioperformance zu liefern. Somit musste eine externe Soundkarte integriert werden, da die interne Umsetzung im Pi mittels PWM diesem Anspruch nicht gerecht wird.

Der Platz innerhalb des Gehäuses ist allerdings begrenzt. Deshalb fiel die Wahl auf den speziell für den Raspberry Pi entwickelten HiFiBerry, da dieser platzsparend auf den GPIO der Platine aufgesteckt werden kann. Die Karte liefert eine maximale Soundqualität von 24bit Tiefe und 192kHz Abtastrate.

**Verstärker**

Um eine einfache Nutzung ohne verfügbaren Verstärker zu ermöglichen, haben wir einen kleinen Class D Verstärker integriert. Damit ist es möglich direkt über die Bananenbuchsen das Gerät mit Lautsprechern zu betreiben. Dieser Verstärker hat einen hohen Wirkungsgrad und einen breiten Spannungsbereich von 10 – 18 Volt für den Betrieb. Er ist somit gut für den mobilen Einsatz mit einem Akku geeignet.

**2.2 Software**

<table><tbody><tr><td colspan="3"><img decoding="async" loading="lazy" class="aligncenter wp-image-939 size-large" src="/uploads/2016/03/IMG_20160216_1719590.jpg" alt="IMG_20160216_1719590" width="720" height="540"></td></tr><tr><td><br><img decoding="async" loading="lazy" class="aligncenter wp-image-944 size-medium" src="/uploads/2016/03/IMG-20160329-WA0013.jpg" alt="IMG-20160329-WA0013" width="169" height="300"></td><td><br><img decoding="async" loading="lazy" class=" size-medium wp-image-947 aligncenter" src="/uploads/2016/03/IMG-20160329-WA0014.jpg" alt="IMG-20160329-WA0014" width="169" height="300"></td><td><br><img decoding="async" loading="lazy" class=" size-medium wp-image-949 aligncenter" src="/uploads/2016/03/IMG-20160329-WA0015.jpg" alt="IMG-20160329-WA0015" width="169" height="300"></td></tr></tbody></table>

**Anforderung**

Die Software soll einen Mehrbenutzerbetrieb ermöglichen. Insbesondere wird das Augenmerk auf die Möglichkeit einer Priorisierung von Liedern gelegt. Gängige Software bietet bereits die Möglichkeit, Lieder von einem Datenträger abzuspielen und eine Playlist zu verwalten. Allerdings fehlt all diesen Lösungen die Funktionalität, Lieder zu priorisieren, um das Voting zu implementieren.

**Vorgehensweise**

Durch Wahl des Raspberry Pi ist die verwendete Software auf ein Linux Betriebssystem beschränkt. Hier zeigte sich der Music Player Deamon (MPD) als Mittel der Wahl, denn dieser lässt sich über Plugins aus diversen Frameworks zu steuern.

Auf Grund von Vorkenntnissen wurde zu Anfang das Framework *Ruby on Rails* in Verbindung mit dem CSS-Framework *Twitter-Bootstrap verwendet*. Für das Backend und die Kommunikation mit dem MPD-Prozess wurde ein Open-Source Projekt (ruby-mpd) von Blaž Hrastnik verwendet. Dieses wurde erweitert, um z.B. die Voting-Funktion, also das Setzen einer Priorität für ein bestimmtes Lied zu ermöglichen.
In darauffolgenden Tests konnte festgestellt werden, dass mit *Ruby on Rails* trotz verschiedener Betriebssysteme (Archlinux, Raspbian) und der leistungsstärkeren Version 2 des Raspberry Pi, ein Seitenaufbau mit etwa 500 Songtiteln bis zu 6 Sekunden brauchte und im Mehrbenutzerbetrieb mit etwas 10 Benutzern die Seite nicht mehr erreichbar war.
Selbst die Nutzung von schnellen und leichtgewichtigen Servern wie Puma, Thin, Passenger und Nginx mit einer Vielzahl von Cache-Mechanismen half nicht dabei, die Performanz zu verbessern.

Aufgrund dieser Problematik hat sich das Projektteam entschieden, frühzeitig die Plattform für die Software zu wechseln, so dass diese auf dem RaspberryPi performant läuft, vor allem im Mehrbenutzerbetrieb.

Als alternative Plattformen hat das Team „Volumio 1 + 2“, MPDJS und YMPD herausgesucht. In Absprache mit dem Team wurde das Open-Source Projekt MPDJS von Richard Backhouse gewählt, da auch hier Vorwissen für JavaScript vorhanden ist. Volumio 1 basiert auf PHP, womit keines der Teammitglieder zuvor vertieft gearbeitet hat. Volumio 2 klingt sehr vielversprechend, befindet sich allerdings noch in der Early Beta und ist im ständigen Wandel. Letztlich bleibt noch YMPD, doch diese Implementierung in C scheint sehr unübersichtlich und nicht gut dokumentiert, außerdem lag der letzte Berührungspunkt des Programmierers mit seiner Software mehrere Monate zurück, wodurch MPDJS aktueller wirkt und deutlich besseren Support aufweist.

Die neue Zielsetzung basiert nun darauf, lediglich die in der Anforderung beschriebenen Funktionen zu implementieren und das System auf dem Raspberry Pi lauffähig und performant zu gestalten. Das Projekt beinhaltet bereits eine graphische Nutzeroberfläche für Clients, welche lediglich um die angesprochenen Komponenten erweitert werden soll.

**Funktionsweise**

![Datenfluss\_mimabox](/uploads/2016/02/Datenfluss_mimabox.png)

Zunächst wird der MPDJS über die Kommandozeile gestartet. Optional können der Applikation Parameter, wie zum Beispiel der Server-Port, MPD-Port oder ein Passwort für den MPD, übergeben werden.

Beim Start werden sämtliche Klassen für den Datenfluss initialisiert und einmalig instantiiert. Dazu gehören der ‘MPDHandler’, ‘MPDConnector’ und letztlich der eigens von uns entwickelte ‘SongHandler’. Des Weiteren wird ein NodeJS-Server mit ‘Connect’ als Middleware erzeugt und leitet die eingehenden Requests weiter.

Verbindet sich nun ein Client über den Server, so wird ein WebSocket zwischen beiden Seiten erzeugt und registriert. Über dieses werden Änderungen des MPD’s, wie zum Beispiel die aktuelle Abspielzeit des derzeitigen Titels, an den Client weitergegeben und auf der Web-Oberfläche, also dem Frontend, entsprechend dargestellt.

Erzeugt ein Nutzer (Client) nun einen Request, um z.B. die aktuelle Playlist anzuzeigen (GET ‘/#playlist), so wird dieser vom Router des Clients entgegengenommen. Der Router ist hierbei eine eigene Instanz, die jedem Client die Kommunikation mit dem Server ermöglicht.

Ist für den Request nun bereits ein Template im Router hinterlegt (z.B. ‘/#playlist’ → Playlist.html), wird dieses zurückgegeben und vom Browser dargestellt. Andernfalls muss es sich um ein Kommando handeln, also wird der Request an die ‘MPDHandler’-Instanz weitergeleitet.

Der MPDHandler hingegen untersucht den eingehenden Request zunächst auf seinen Typ. Hierbei wird zwischen den 4 Typen ‘GET’, ‘POST’, ‘PUT’ und ‘DELETE’ unterschieden. Abhängig vom Typ wird die Anfrage dann an das jeweilige Handle weitergegeben. In diesen werden dann die übergebenen Segmente der Anforderung untersucht und entsprechend dann der MPDConnector oder SongHandler aufgerufen.

Um eine Kommunikation zwischen MPD und dem SongHandler zu ermöglichen, muss mit einem sogenannten Callback gearbeitet werden. Lediglich der MPDHandler kennt die Klassen MPDConnector beziehungsweise SongHandler, entsprechend muss an dieser Stelle bereits definiert werden, was mit den einzelnen Ergebnissen geschehen soll. Sprich, es muss ausgewählt werden, ob die Ergebnisse des MPD’s noch weiter an den SongHandler geschickt oder der Client direkt angesprochen wird.

Nachdem sämtliche Daten verarbeitet wurden, wird mit Hilfe des Callbacks geregelt, wie mit den Ergebnissen verfahren werden soll. Visuelle Änderungen für den Nutzer werden über den MPDConnector und die implementierte Funktion ‘sendStatus’ beziehungsweise den eingerichteten WebSocket nach außen propagiert.

Jedes Template des MPDJS besitzt ein eigenes JavaScript-Template, welches sämtliche EventListener beinhaltet und beim ersten Laden registriert wird, sowie den Klick eines Benutzers abfängt und entsprechend die hinterlegten Funktionen aufruft.

Diese Funktionen wiederum erzeugen dann je einen AJAX-Request an den NodeJS-Server, welcher erneut über den MPDHandler verteilt und später ausgewertet wird.

**SongHandler**

Der SongHandler kümmert sich um das Setzen und Propagieren der Priorität eines Liedes, sowie das Speichern aller sich in der Playlist befindlichen Lieder und deren Priorität.

Dem Benutzer soll es ermöglicht werden, ein Lied aus der aktuellen Playlist mit nur einem Klick mit einer “+1” Bewertung zu versehen. Dieses Lied wird dann, insofern es das Lied mit der höchsten Bewertung ist, als nächstes abgespielt.

Versieht ein Benutzer also ein Lied mit “+1”, so muss die Priorität dieses Liedes erhöht werden. Dahingehend wird bei jedem Klick ein AJAX-Request an den Server erstellt, welcher vom MPDHandler erkannt und weitergeleitet wird. Damit ein Nutzer nicht unkontrolliert ein Lied mehrfach mit „+1“ versehen kann wird der Request auch mit einer User-ID (Cookie) versehen. Diese ID wird als Cookie beim Benutzer gespeichert und durch sämtliche mit JavaScript auslesbaren Informationen über einen Client generiert. So sind zum Beispiel installierte Plugins des Clients, sowie der Browser und andere Optionen, die gesetzt werden können, für die Generierung der User-ID wichtig. Für die Erstellung wird die Bibliothek ‘ClientJS’ genutzt. Es ist fast ausgeschlossen, dass eine erstellte ID mehrfach generiert wird oder sich die ID eines Benutzers während der Nutzung verändert.

![upvote\_request](/uploads/2016/02/upvote_request1.png)

Entsprechend wird zunächst überprüft, ob das erste Segment des eingegangenen Requests ‘upvote’ beinhaltet. Ist dies der Fall, wird die Funktion ‘addValue’ des SongHandler mit den notwendigen Parametern aufgerufen. Als Callback wird eine Funktion übergeben, welche die kontrollierte Kommunikation mit dem MPD gewährleistet.

![mpdhandler\_upvote](/uploads/2016/02/mpdhandler_upvote.png)

Die ‘addValue’-Funktion wiederum erstellt entweder einen neuen Eintrag des gevoteten Songs oder findet den bereits existenten Eintrag und erhöht dessen Priorität von diesem um eins. Anschließend wird das neue Ergebnis über den Callback an den MPD übergeben, der wiederum das entsprechende Lied intern mit einer höheren Priorität versieht, so dass es bevorzugt abgespielt wird.

Werden neue Lieder zur Playlist hinzugefügt, wird beim MPDHandler eingegriffen und das hinzuzufügende Lied an den SongHandler geschickt, um einen neuen Eintrag hinzuzufügen und die Informationen über die Priorität des Liedes zu speichern.

![Songhandler\_addValue](/uploads/2016/02/Songhandler_addValue.png)

Auch muss der SongHandler darüber informiert werden, wenn sich das aktuelle Lied ändert, also ein Lied zu Ende gehört oder manuell weitergeschaltet wurde. In beiden Fällen wird diese Veränderung wahrgenommen und an den SongHandler gesendet. Dieser löscht dann den entsprechenden Eintrag.

![Songhandler\_removeValue](/uploads/2016/02/Songhandler_removeValue.png)

## 3\. Energieversorgung

**Aus Alt mach Neu**

Für die Energieversorgung kamen Fahrzeugbatterien und Generatoren aus Gründen des Gewichts nicht in Frage. Lithium-Ionen-Akkus kamen sehr viel näher an das Leistungs-/Gewichts- Verhältnis, das für das Projekt erforderlich war. Fertige Akkus in der benötigten Kapazität waren in unserem Fall nicht bezahlbar. Selber bauen war also angesagt. Aber auch da machte uns der Preis einen Strich durch die Rechnung. Mit ca. 300 Zellen und 5-9€ je nach Qualität, pro Zelle, waren wir auch damit schnell bei über 1000€ angelangt. Auf eine andere Idee brachte uns das [E – Bully Projekt](http://www.electricsamba.com/) von Jehu Garcia, der mit der Gewinnung von Lithium-Ionen-Akku-Zellen aus defekten Notebook Akkus eine Energieversorgung für einen VW Bully baut.

Vom Händler unseres Vertrauens beschafften wir also defekte Notebook Akkus und fingen an, die Zellen daraus zu sammeln. Danach wurde die Spannung der einzelnen Zellen gemessen, um diese mit ungefähr gleicher Spannung zu gruppieren und auf 4,2 Volt zu laden. Anschließend wurden mit dem *Battery Capacity Tester* von Patrick Wels die Kapazität der einzelnen Zellen bestimmt und nach dieser sortiert. Nach einer weiteren Vollladung wurden die Zellen zu einem Gesamtakku konfektioniert. Dazu wurden die einzelnen Zellen mit Hilfe von Nickelband punktgeschweißt. Zum Schluss wurde die Verkabelung inkl. einer Schutzschaltung hinzugefügt und das Ganze im Subwoofer verbaut.

<table><tbody><tr><td><img decoding="async" loading="lazy" class=" wp-image-684 size-medium aligncenter" src="/uploads/2016/02/IMG_20160216_104213.jpg" alt="IMG_20160216_104213" width="300" height="225"></td><td><img decoding="async" loading="lazy" class=" wp-image-687 aligncenter" src="/uploads/2016/02/20151014_1759461.jpg" alt="20151014_175946" width="127" height="225"></td><td><img decoding="async" loading="lazy" class=" wp-image-688 size-medium aligncenter" src="/uploads/2016/02/20151014_1759461.jpg" alt="IMG_20160216_103557" width="300" height="225"></td></tr><tr><td colspan="2"><img decoding="async" loading="lazy" class=" wp-image-689 alignright" src="/uploads/2016/02/IMG-20150429-WA0004.jpeg" alt="IMG-20150429-WA0004" width="400" height="225"></td><td><img decoding="async" loading="lazy" class=" wp-image-691 alignleft" src="/uploads/2016/02/IMG_20160217_161355.jpg" alt="IMG_20160217_161355" width="169" height="225"></td></tr></tbody></table>

## 4\. Batteriemonitor

Um einen Rückschluss auf den Füllstand des Akkus zu erhalten, wurde ein Batteriemonitor zur Messung und Anzeige des ein- bzw. ausgehenden Stroms entwickelt. Dabei wird die Restspielzeit bei aktuellem Verbrauch (Lautstärke) ermittelt.

**Aufbau**

Als Grundlage dient ein Arduino Nano Rev 3 als Microcontroller mit einem Nokia 5110 Display zur Anzeige der Daten. Die Messung des Stroms wird mit dem Ina219 DC Current Sensor realisiert. Dieses Board misst den Spannungsabfall über einem Messwiderstand und enthält bereits einen 12Bit ADC zum Digitalisieren der Werte. Die Bibliothek des Boards übernimmt bereits die entsprechende Umrechnung auf die Stromstärke.

Anfangs wurde zur Strommessung ein Hall-Effekt Sensor, welcher die Stärke des Magnetfelds um den stromführenden Leiter misst, verwendet. Dieser zeigte jedoch in ersten Tests bereits starke Schwankungen. Diese waren unter anderem auf Störeinflüsse durch Magnetfelder zurückzuführen. Da der Batteriemonitor später in der Nähe des Subwoofers mit großem Magneten betrieben wird, schied dieser Sensor also schnell aus.

Die Spannungsversorgung des Batteriemonitors erfolgt mittels Spannungswandlers direkt über den Akku.

![bat\_mon\_Schaltplan](/uploads/2016/02/bat_mon_Schaltplan.png)

**Messung**

Der Ina 219 DC Current Sensor kann im Auslieferungszustand einen Strom von maximal 3,2 A messen. Da unser System in Spitzen bis zu 20 A ziehen kann, musste der Messbereich angepasst werden. Dazu wurde der Shunt-Wiederstand durch einen zehnfach Größeren ausgetauscht, wodurch sich der Messbereich entsprechend auf 32 A vergrößert. Die Messung erfolgt Interrupt gesteuert. Die Abtastung des Sensors erfolgt mit 100 Hz, wobei die Werte sekündlich gemittelt und zur Anzeige gebracht werden. Diese Vorgehensweise wurde gewählt, um die Schwankungen bei der Audiowiedergabe zu kompensieren.

Da die Spannung des Akkus zur Verarbeitung mit dem Microcontroller zu groß ist, wird der Eingang über folgenden Spannungsteiler auf 5 V herunter geteilt und programmintern auf 18 V skaliert:

![Spannungsteiler](/uploads/2016/02/Spannungsteiler.jpg)

Um die Toleranzen in den Bauteilen zu kompensieren, wurde das Programm für den Arduino um die Möglichkeit, die Spannung und den Strom zu kalibrieren, erweitert. Die bei der Kalibrierung eingemessenen Werte werden im EEPROM des Arduino gesichert und für die Berechnung der Anzeigewerte verwendet.

## 5\. Lautsprecher

Die Motivation für die Lautsprecher war *Günstig und Gut*. Ein erster Ansatz war der [Visaton BG 20](http://www.visaton.de/de/chassis_zubehoer/breitband/bg20_8.html) in einem 50 Liter Gehäuse mit Bassreflexröhre. Dieser Speaker ist günstig, hat einen Temperaturbereich von -25°C – 70°C und einen sehr hohen Wirkungsgrad mit einem mittleren Schallpegel von 92 dB (1 W/1 m) und ist damit für den Akkubetrieb sehr gut geeignet.

![IMG\_20160217\_143628](/uploads/2016/02/IMG_20160217_1436281.jpg)

Dieser Prototyp erfüllte zumindest schon den Ansatz *günstig*. Leider war die Soundqualität noch verbesserungswürdig. Da aber der Speaker Visaton BG 20 schon mal vorhanden und die Qualität als solche für das Preisleistungsverhältnis sehr gut war, überlegten wir, am Gehäuse und dem Aufbau etwas zu ändern.

Die Lösung fanden wir in der Zeitschrift Klang+Ton. Der Cheap Trick 263 versprach durch die Ergänzung des Visaton BG 20 um eine Frequenzweiche und den Hochtöner Visaton TW70 einen extremen Mehrwert. In der Zeitschrift wird dieser Aufbau als *“Selbstbauboxenszene durcheinanderwirbelnd”* bezeichnet. Vielversprechend und für uns ein guter Grund, das Ganze in Angriff zu nehmen.

Am Anfang stand die Planung. Die Zeitschrift lieferte uns die Pläne für das Gehäuse.

<table><tbody><tr><td><img decoding="async" loading="lazy" class=" wp-image-652 size-medium alignright" src="/uploads/2016/02/CT263_1.jpg" alt="CT263_1" width="300" height="190"></td><td><img decoding="async" loading="lazy" class=" wp-image-653 size-thumbnail alignleft" src="/uploads/2016/02/CT263_2.jpg" alt="CT263_2" width="150" height="150"></td></tr></tbody></table>

Wir hatten das Glück, dass die Roh-Gehäuse durch die FH Kiel interne Schreinerei gebaut wurden. Und so konnten wir schon nach nur ein paar Wochen die Rohlinge in den Händen halten. Um den Ansprüchen an eine stabile und partyfeste Box zu entsprechen, musste natürlich eine strapazierfähige Lackierung her. Die Rohlinge bekamen noch einen Feinschliff und wurden erst einmal grundiert. Danach erhielten die grundierten Gehäuse eine Beschichtung mit dem Struckturlack *WARNEX Struckturlack 1k schwarz halbmatt*. Nun waren die Rohlinge soweit vorbereitet für den Zusammenbau.

<table><tbody><tr><td><img decoding="async" loading="lazy" class=" wp-image-656 size-medium aligncenter" src="/uploads/2016/02/IMG_20160210_132215.jpg" alt="IMG_20160210_132215" width="300" height="225"></td><td><img decoding="async" loading="lazy" class=" wp-image-781 size-medium aligncenter" src="/uploads/2016/02/IMG_20160222_103417.jpg" alt="IMG_20160222_103417" width="225" height="300"></td><td><img decoding="async" loading="lazy" class=" wp-image-658 size-medium aligncenter" src="/uploads/2016/02/IMG_20160211_144116.jpg" alt="IMG_20160211_144116" width="300" height="225"></td></tr></tbody></table>

Als nächstes wurde die Frequenzweiche benötigt. Auch hier lieferte Ton+Klang die Pläne.

![Frequenzweiche](/uploads/2016/02/Frequenzweiche.jpg)

Diese wird benötigt, um das ankommende Signal jeweils in Tief- und Mittelton und in Hochton zu trennen und zu linearisieren. Die Komponenten befestigten wir möglichst platzsparend auf einem Holzbrett. Danach wurde die Frequenzweiche am Boden des Gehäuses befestigt, das Gehäuse mit Dämmwolle ausgefüllt und die Speaker montiert. Vor dem Schritt des Lackierens wurden die Speaker erst noch getestet.

<table><tbody><tr><td><img decoding="async" loading="lazy" class="aligncenter wp-image-673 size-medium" src="/uploads/2016/02/IMG_20160211_163508.jpg" alt="IMG_20160211_163508" width="300" height="225"></td><td><img decoding="async" loading="lazy" class="aligncenter wp-image-675 size-medium" src="/uploads/2016/02/IMG_20160211_152707.jpg" alt="IMG_20160211_152707" width="225" height="300"></td><td><img decoding="async" loading="lazy" class="aligncenter wp-image-720 size-medium" src="/uploads/2016/02/speaker_test.jpg" alt="speaker_test" width="188" height="300"></td></tr></tbody></table>

## 6\. Subwoofer

**Gehäuse**

Bei der Wahl des Speakers für den Subwoofer fiel unsere Entscheidung auf den [the box speaker 12-280](http://www.thomann.de/de/the_box_speaker_122808a.htm). Dieser ist nicht nur sehr günstig sondern hat auch einen guten Klang. Recherche in diversen Foren versprach, dass die erreichbare Lautstärke durch Verwendung des Basshorns MTH-30 im Vergleich zu einem herkömmlichen Bassreflex Gehäuse deutlich erhöht wird. Deshalb wird diese Kombination im Party-Anlagen (PA) Bereich häufig verwendet.

Eine Alternative für bessere Qualität war der [the box speaker 18-500](http://www.thomann.de/de/the_box_speaker_185008a.htm) in Kombination mit dem Basshorn MTH-46. Dieses Duo ist jedoch in punkto Preis und Mobilität nicht für das Projekt geeignet.

Da in das Gehäuse des Subwoofers noch der Akku, ein Verstärker und der Batteriemonitor verbaut werden sollten, mussten wir die Pläne des MTH-30, die wir im Internet fanden, erweitern. Dazu erstellten wir ein CAD mit der Software Sketchup.

![pic\_doku](/uploads/2016/02/pic_doku.jpg)

**Verstärker**

Um die Entfaltung der vollen Kraft des Subwoofers zu ermöglichen, fiel die Wahl auf die Kategorie der KFZ-Verstärker. Die große Anzahl an entsprechenden Verstärkern erschwerte die Suche nach einem passenden Modell. Nach dem Studieren einiger Rankings im Bereich der vier Kanal Geräte, zeigte sich der Magnat Edition Four als geeignetes Modell mit einer guten Platzierung bei gleichzeitig günstigem Preis und guten Kundenbewertungen.

Durch Brücken von zwei Kanälen liefert der Verstärker für den Subwoofer 150 Watt Nennleistung. Außerdem lassen sich die Frequenzen, die an den entsprechenden Kanälen ausgegeben werden, filtern. Eine weitere Frequenzweiche für den Subwoofer ist somit überflüssig.

**Bau des Prototypen**

Um zu testen, ob unser Konzept aufgeht, haben wir zu Beginn des Projektes einen Prototypen gebaut. Dieser wurde mit einem kleineren Akku und einem Autoradio zum Abspielen von Musik ausgestattet. Dies war nötig, da zum damaligen Zeitpunkt noch zu wenig verwendbare Zellen zur Verfügung standen, und die mimaBox nicht fertig war. Die Teile des Gehäuses bestehen aus 18 mm MDF, wurden miteinander verleimt und wie die Lautsprecher grundiert und mit Strukturlack beschichtet.

<table><tbody><tr><td><img decoding="async" loading="lazy" class="alignnone size-medium wp-image-791" src="/uploads/2016/02/20150415_182810.jpg" alt="20150415_182810" width="300" height="169"></td><td><img decoding="async" loading="lazy" class="alignnone size-medium wp-image-792" src="/uploads/2016/02/IMG-20150415-WA0007.jpeg" alt="IMG-20150415-WA0007" width="300" height="169"></td><td><img decoding="async" loading="lazy" class="alignnone size-medium wp-image-793" src="/uploads/2016/02/IMG_20160222_124958.jpg" alt="IMG_20160222_124958" width="225" height="300"></td><td><img decoding="async" loading="lazy" class="alignnone size-medium wp-image-794" src="/uploads/2016/02/IMG_20160222_125120.jpg" alt="IMG_20160222_125120" width="225" height="300"></td></tr></tbody></table>

**Aussicht**

Da der Prototyp seine Funktionalität auf mehreren Partys unter Beweis stellen konnte, steht dem Bau der Endversion mit einem 150Ah Akku nichts mehr im Wege. Die Endversion enthält dann auch ein Netzteil und eine Schaltung zum gleichzeitigen Laden des Akkus und Betreiben des Subwoofer über ein Stromnetz. Auch soll kein Autoradio mehr enthalten sein, da mit der fertigen mimaBox alle benötigten Funktionalitäten gegeben sind. Leider konnte die Endversion des Subwoofers im Rahmen des Projektes aus Zeitmangel nicht mehr in Angriff genommen werden. Ein Bau ist evtl. für Mitte – Ende 2016 geplant.

## 7\. Fazit

Am Anfang standen folgende Anforderungen im Raum

-   guter Sound
-   eine Art Jukebox zum Voten von Musiktiteln über das Handy
-   partyfeste Hardware
-   großzügige Energieversorgung

Mit dem Visaton BG-20, dem Visaton TW-70 und einer Frequenzweiche in einem 50L Gehäuse konnten wir eine sehr gute und energiesparende Soundqualität mit unter 150€ Materialpreis erzeugen. Der Subwoofer mit dem “the box speaker 12-280” brachte dann noch den gewünschten Bass dazu. Mit dem ersten Subwoofer – Prototypen und dem darin enthaltenen 80Ah Akku kann das System für einen 10-Stündigen Partyabend am Strand genutzt werden. Die mimaBox liefert die gewünschte Jukebox Funktionalität. Die Partygäste können sich aus einer großen Musikauswahl ihre Lieblingstitel aussuchen und dafür voten. Die Lieder, welche am häufigsten gevotet wurden, werden als erstes abgespielt. Den letzten Schliff liefert die stabile und geschlossene Bauweise, die auch auf einer sehr aktiven Party dafür sorgt, dass sich die Schäden in Grenzen halten.

Alle Wünsche wurden somit erfüllt. Aber nach oben ist noch sehr viel Luft. Wir haben im Laufe des Projektes gemerkt, dass wir mit unserer Idee einer Votingfunktion noch etwas zu früh dran sind. Im Laufe des Jahres 2016 soll die Software Volumio 2 veröffentlicht werden. Diese Software ermöglicht es, Musiktitel aus einer Datenbank abzuspielen und ist pluginbasiert und bedienfreundlicher. Für diese Software könnten wir ohne Umwege ein Votingplugin realisieren, was privat für die nächsten Jahre angedacht ist. Auch haben wir mit dem Bau des Prototyps (und vor allem bei der Verwendung) gemerkt, dass alles in einem Gehäuse zwar schön kompakt ist, aber auch sehr schwer und schlecht zu warten. Eine modulbasierte Bauweise ist bereits in Planung und verspricht einen leichteren Transport und eine gute Erweiterbarkeit.

Trotz der sehr aufwendigen Softwareerweiterung und dem zeitaufwendigen Bau der Lautsprecher ergaben sich die meisten Erkenntnisse aber im Akkubereich. Viele Komponenten und verwendeten Geräte gab es gar nicht fertig zu kaufen oder waren extrem teuer, so dass sich ein Selbstbau anbot.

Uns bleiben also noch viele offene Enden mit viel Potenzial zum Weitermachen.

*ein Projekt von Erik Falk, Rick Fastenrath, Philipp Meißner und Patrick Wels – WS 15/16*
