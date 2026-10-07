---
title: "Artificial Intelligence for Space Game"
order: 37
year: 2015
legacyPaths:
  - "/ki-for-space-game/"
demo: "/demos/ki-for-space-game/"
---

In dieser einfachen grafischen Ausgabe stellt grün die Asteroiden, blau die Ressourcenschiffe und rot die Piraten dar.

An eine künstliche Intelligenz in einem Multiplayer-Spiel werden hohe Anforderungen gestellt. Sie sollte sich moeglichst wie ein realer Mitspieler verhalten und sich der entprechenden Rolle anpassen.
Im Rahmen dieses Projektes wurden die Grundlagen für eine einfache Erweiterung der KI geschaffen. Des Weiteren wurden 2 Beispielintelligenzen entwickelt.

**Intelligenz Ressourcenschiff**

Ein Ressourcenschiff sammelt verschiedene Ressourcen auf Asteroiden und verkauft diese in einer nahen Raumstation. Mit dem verdienten Geld kann das eigene Schiff aufgerüstet werden, oder es werden Bewacher angeheuert.
Die jetzige Intelligenz wird sich einen Asteroiden suchen und mit dem Abbau von Ressourcen beginnen. Sollte ein Piratenschiff auftauchen wird jede andere Aktion Unterbrochen und die Flucht wird angetreten.

**Intelligenz Piratenschiff**

Ein Piratenschiff lauert anderen Schiffen auf und versucht diese außer Gefecht zu setzen, um dessen
Ressourcen zu stehlen. Die Schiffe von Piraten sind gewöhnlicherweise veraltet, klein und langsam. Dies
zwingt sie in Rudeln zu operieren, um stärkere Gegner außer gefecht zu setzen.
Im Rahmen dieses Projektes gehen die Piratenintelligenzen auf die Jagd nach den Ressourcenschiffen. Sie können sich dafür in Gruppen zusammenschliessen, die jeweils einen Anführer haben. Dieser Anführer, oder auch Bossintelligenz genannt, kümmert sich darum neue Gruppenmitglieder anzuheuern und die nächsten Aktionen zu bestimmen.

**Grafische Ausgabe**

Da es noch keine Grafikausgabe für dieses Spiel gibt, es aber Wünschenswert war die KI zu beobachten,
wurde eine sehr simple Grafikausgabe mit Div-Elementen realisiert. Selbst die Sterne die auf dem
Bild zu sehen sind, sind nur sehr kleine Div-Elemente. Auch hier wurde großen Wert auf spätere einfache Änderung der Grafikengine gelegt. Alle Elemente werden in der Index.html realisiert, setzt man hier stattdessen eine Grafikengine mit den richtigen Parametern ein wird die KI auch dort funktionieren.

**Klassen in Javascript**

ECMAScript 2015, auch bekannt als ES6, bietet eine Reihe neuer interessanter Funktionen, wovon dieses Projekt von der neuen Unterstützung für Klassen Gebrauch macht. Die Schreibweise ist dabei von den klassischen objektorientierten Programmiersprachen wie Java oder C# übernommen worden. Besonders nützlich waren die Klassen dabei eine sogenannte Super-KI zu erstellen die nur sehr allgemeine Methoden und Variablen enthält. Die Piraten-KI und die Ressourcen-KI können sich dann von dieser dann mit dem Extend Schlüsselwort ableiten.

**Weitere Funktionalitäten**

Um diese einfache Simulation der KIs zu ermöglichen wurden zwei weitere Hilfsklassen erstellt, die später wahrscheinlich durch Funktionalitäten der Spiele-Engine übernommen werden können. Es handelt sich dabei einmal um die Klasse Movement, die verschiedene Funktionen enthält um sich im System zu bewegen. Die zweite Klasse heisst Sensor und kümmert sich um die sichtbaren Objekte für jedes Schiff.

**Ausblick**

Viele weitere KIs sind denkbar, die sich dann auch wieder von der Super-KI ableiten und im Laufe dieses
Entwicklungsprozesses könnten dieser dann auch weitere Kernfunktionalitäten zur Verfügung gestellt werden. Als sehr wichtige nächste Rollen wären Bewacherschiffe und Händler denkbar. Es wäre dabei interessant zu sehen wie die Händlerschiffe sich mit den Funktionen des Auktionshauses integrieren lassen.

*Kai Luenstaeden 2015*
