---
title: "Rhythmusgenerierung mit künstlicher Intelligenz: Machbarkeit auf eingebetteten Systemen"
order: 7
year: 2021
legacyPaths:
  - "/rhythmusgenerierung-mit-kunstlicher-intelligenz-machbarkeit-auf-eingebetteten-systemen/"
---

Diese Thesis versucht die Frage zu beantworten, ob ein Eingebettetes System mit beschränkten Ressourcen in der Lage ist, Schlagzeugspuren abhängig von Nutzereingaben zu generieren. Konkret wird dies auf dem ESP32 der Firma Espressif untersucht. Dafür werden durch maschinelles Lernen verschiedene Modelle erzeugt, welche auf dem ESP32 aufgespielt und getestet werden. Letztlich gibt der Mikrocontroller eine textuelle Repräsentation der erzeugten Sektionen aus.

Umgesetzt wurde die finale Lösung mit Tensorflow für Mikrocontroller.

### Topografie des Neuralen Netzes

Die besten Resultate lieferte in den Experimenten ein sogenannter Autoencoder. Genauere Details lassen sich der unter ‘Downloads’ verlinkten Thesis entnehmen.

Die Architektur des Decoders aus dem erstellten Autoencoder ist auf der Folgenden Abbildung zu erkennen.

![](/uploads/2021/01/2D_decoder_binary_FINAL.png)

Dieser Decoder wurde letztlich auf dem ESP32 aufgespielt.

Die Eingaben für das finale Modell erfolgen in der Form zweier Floating-Point Zahlen, welche Koordinaten in einer Matrix darstellen. Daraus werden entsprechende Schlagzeugsektionen generiert.

Die Abdeckung des zweidimensionalen Raumes wurde durch Einordnen des Trainingsdatensatzes in diesen Raum mit Hilfe des Encoders visualisiert und ist auf folgender Abbildung zu sehen.

![](/uploads/2021/01/FINAL_latent_space_usage.png)

### Samples

Im Folgenden sind einige generierte Samples, welche durch den Encoder mit den zu sehenden Koordinaten erstellt worden sind, zu hören.

**450, 200**

/uploads/2021/01/450.-200..wav

**1000, 450**

/uploads/2021/01/1000.-450..wav

**1200, 1200**

/uploads/2021/01/1200.-1200..wav

**300, 1200**

/uploads/2021/01/300.-1200..wav

**450, 1200**

/uploads/2021/01/450.-1200..wav

**120, 740**

/uploads/2021/01/120.-740..wav

**150, 200**

/uploads/2021/01/150.-200..wav

### Performanz der Implementation

In allen Tests des Modells auf dem ESP32 erfolgte die Generierung von Schlagzeugsektionen zu gegebenen Koordinaten in genau 22 Ticks.

### Probleme der Lösung

Die Thesis liefert eine Antwort auf die Frage, ob eine Lösung im Sinne der eingangs gestellten Frage möglich ist und liefert ein Beispiel. Das Einteilen des genutzten Latent Space in Musikrichtungen ist mit dem aktuellen Ansatz jedoch nicht erfolgt. Auch die Qualität der Resultate kann vermutlich noch verbessert werden. Dazu könnten bereits getestete Topografien modifiziert oder neue untersucht werden.

### Downloads

Der Appendix beinhaltet den verwendeten Code zu den Experimenten sowie die erzeugten Modelle und einige Resultate. Die Thesis steht als Pdf-Datei zum Download zur Verfügung. Darin sind Details zu vorgenommenen Experimenten sowie zur finalen Lösung zu finden.

[Appendix](/uploads/2021/01/Appendix.zip)

[Thesis](/uploads/2021/01/thesis.pdf)

### Author

Roman Kravanja 2020
