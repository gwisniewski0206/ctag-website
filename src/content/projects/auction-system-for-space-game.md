---
title: "Auction System for Space Game"
order: 38
year: 2015
legacyPaths:
  - "/auction-system-for-space-game/"
---

Der Handel ist von Anbeginn der Zeit eine Methode zum Austausch von Waren. Ab Ende des 20. Jahrhunderts wurde das Handeln zum großen und stetig wachsenden Teil übers Internet vollzogen. Um dies einfach und sicher vollziehen zu können, wurden Auktionssysteme entwickelt. Mittels dieser Auktionssysteme ist die Abwicklung des Warenaustauschs von der realen Welt in die virtuelle Welt transferiert worden. Ab er nicht nur im echten Leben werden Waren gehandelt sondern auch oftmals in Computerspielen, wo es möglich sein soll Items zu verkaufen. Im Rahmen dieser Bachelorarb eit wird ein Auktionssystem entworfen in Form einer Webanwendung mittels einer Elasticsearch Datenbank und einem Node.js Server. Das Auktionssystem dient zum Handeln und Transferieren von Items, die ein Benutzer in einem Browserspiel zur Verfügung stehen. Mittels moderner JavaScript Bibliotheken wird ein interaktives und benutzerfreundliches Online-Auktionssystem geschaffen, das es ermöglicht Transaktionen im Browser mit anderen Benutzern zu vollziehen.

**Funktionen des Auktionssystems**

* * *

*Suche nach Auktionen*
Dem Benutzer soll es möglich sein, mit Hilfe der Volltextsuche Auktionen nach Begriffen zu durchsuchen. Zusatzfunktionen, um die Preisspanne der Auktionen zu bestimmen, sollten gegeben sein. Ebenso sollte es möglich sein, nur nach Auktionen zu suchen, die einen Sofortkaufpreis anbieten. Dem Benutzer soll es auch möglich sein, Auktionen nach Kategorien zu suchen. Treffer, die den gesuchten Begriff im Titel oder in der Beschreibung enthalten, sollen anschließend ausgegeben werden.

*Bieten*
Jedem Benutzer soll es möglich sein, jederzeit auf Auktionen zu bieten sofern das Guthaben ausreichend ist. Das Gebot muss höher sein als das Aktuelle bzw. höher als das vom selben Benutzer bereits abgegebene Gebot. Wenn die Auktion ausgelaufen ist, soll das Item der Auktion dem Benutzer zügig gutgeschrieben werden.

*Sofortkauf*
Der Benutzer soll in der Lage sein, jede Auktion, die einen Sofortkauf anbietet, per Sofortkauf sofort zu beenden und anschließen das Item direkt auf sein Konto gutgeschrieben bekommen. Das soll nur möglich sein, wenn das Guthaben ausreichend ist.

*Versteigern*
Jeder Benutzer des Auktionssystem soll seine Items versteigern können. Angaben zu der Versteigerung eines Items sollen sich auf folgende Daten beschränken: Anzahl, Startpreis, Sofortkaufpreis und Auktionslänge. Die Anzahl der zu versteigernden Items darf nicht größer sein als die Anzahl der Items, die sich im Inventar befindet. Ebenso macht es keinen Sinn, einen höheren Startpreis als den Sofortkaufpreis einstellen zu können. Die Auktionslänge sollte begrenzt sein, damit es keine *ewigen* Auktionen gibt.

*Profil einsehen*
Der Benutzer soll stets über den aktuellen Stand seines Guthabens Bescheid wissen. Zudem soll es Ihm möglich sein, einen Überblick über folgende Auktionen zu haben:
*•* Auktionen, wo der Benutzer mit geboten hat.
*•* Auktionen, wo der Benutzer zurzeit Höchstbietender ist.
*•* Auktionen, die der Benutzer selbst erstellt hat.
*•* Auktionen, die der Benutzer ersteigert hat.

**Realisierung**

* * *

Die Webapplikation, das Auktionssystem, wurde in die 3 Bereiche Client, Server und Datenhaltung unterteilt. Diese Aufteilung ermöglicht die strikte Trennung von dem User Interface, der Datenverarbeitung und der Datenverwaltung bzw. Datenhaltung. Der Client ist das User Interface, das üb er den Browser dargestellt wird. Das UI wird üb er HTML, CSS und JavaScript und mit deren Bibliotheken jQuery, jQuery UI und Bootstrap gebildet. Benutzereingaben werden per Ajax an die RESTful API des Servers gesendet.  Der Node.js Server wurde mit dem Express.js und Elasticsearch.js Modulen ausgestattet. Mittels Express wird ein HTTP Server erstellt, der verschiedene Routes hat und Anfragen entgegennehmen kann. Ebenfalls im Server enthalten ist die Viewengine, wo alle Views gerendert werden, je nachdem welche Route aufgerufen wurde. Insgesamt existieren 15 verschiedene Views, die das User Interface darstellen. Die Views beinhalten zum größten Teil nur einzelne Parts des Auktionssystems, die je nach Benutzereingaben gerendert und anschließend an den Client zurück gesendet werden.  Die Datenhaltung wird mit Elasticsearch realisiert. Hier befinden sich alle Dokumente, die das Auktionssystem benötigt. Der Node.js Server kommuniziert mit Elasticsearch über die RESTful API, wo der Austausch von den Daten immer im JSON Format erfolgt.

![architekture](/uploads/2015/09/architekture.png)

**Auctionssystem
**

Der Prototyp ist in der Lage neue Benutzer zu registrieren, die zugleich mit einigen Test-Items ausgestattet werden, um das Auktionssystem testen zu können. Registrierte Benutzer können sich über das Loginfenster ins System einloggen und solange die Session ID erhalten bleibt, hat der Benutzer konstant Zugriff auf das Auktionssystem. Alle Benutzer sind nun in der Lage, mit ihren Items und ihrem Geld auf Auktionen zu bieten oder selbst Auktionen zu erstellen. Alle Auktionen sind gleich gewichtet, so dass keine Auktionen anderen Auktionen vorgezogen werden können. Die Auswahl und Sortierung wird von Elasticsearch übernommen, worauf kein Benutzer Einfluss haben kann. Das Auktionssystem ist in 4 Bereiche aufgeteilt. Im linken Bereich befindet sich die
Sidebar mit dem darüber liegendem Usercontent. Im rechten Bereich befindet sich im oberen Bereich die Navigation mit 4 Menüpunkten *Home – Items Kaufen – Items Verkaufen – Meine Transaktionen*. Darunter befindet sich der Maincontent, der  mit einer Willkommens-nachricht den Benutzer nach dem Einloggen begrüßt. Abgesehen von dem Loginfenster und dem Registrierungsfenster, ist das Auktionssystem immer in dieselben 4 Bereichen Usercontent, Navigation, Sidebar und Maincontent aufgeteilt.

![s3](/uploads/2015/09/s3.png)

![s6](/uploads/2015/09/s6.png)

![s0](/uploads/2015/09/s0.png)

![s4](/uploads/2015/09/s4.png)

![s2](/uploads/2015/09/s2.png)

![s1](/uploads/2015/09/s1.png)

![s5](/uploads/2015/09/s5.png)

*Author: Leon Borlinghaus, BSc FH-Kiel 2015*
