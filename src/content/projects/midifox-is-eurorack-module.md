---
title: "MidiFox Eurorack Module"
order: 5
year: 2021
legacyPaths:
  - "/midifox-is-eurorack-module/"
---

![](/uploads/2021/01/Ebene-1.png "Ebene 1")

![](/uploads/2021/01/Ebene-2.png)

The MidiFox is a small Eurorack Module. It takes a MIDI-Signal via MicroUSB from a Computer and turns it into Eurorack usbale Note Value, MIDI Velocity and Gate CV.

### Go to GitHub

Get the full code and KiCad files at: [github.com](https://github.com/Felan7/midiFox)

### Grab the pdf

[Download the Manual](https://github.com/Felan7/midiFox/raw/master/docs/midiFox%20documentaion.pdf) to read all this documentation offline (also includes way more fun¹ colors).

# Introduction

### What is an eurorack Module anyway?

Eurorack is one standard for modular synthesizers. Modular synthesizers on the other hand are synthesizers (electronic instruments) that consist of many different modules (Things that do a small part of something).

That means that in contrast to “classic” synthesizers where the signal path is predetermined by the manufacturer, in modular synthesis you can have your own signal path by chaining together modules in any way you want.

### So whats the other stuff you talked about?

MIDI (short for: Musical Instrument Digital Interface) is a communication protocol that is used by electronic controllers (for example keyboards) to tell synthesizers what they have to synthesize. Commonly this is which note you pressed (corresponding to pitch information) how long your pressed it (corresponding to the so called gate) and how hard, or fast you pressed the key (corresponding to the MIDI Velocity.)

# Schematic

![Schematic](/uploads/2021/01/Ebene-1-1.png "Schematic")

# Bill of Materials

![Bill of Materials](/uploads/2021/01/midifox_bom2.png)

# Code Explanation

After set-up we wait in them main loop for a MIDI packet to arrive.

When one does we unpack it and put its content into three seperate bytes. One for the header, and one for each of the two data bytes. We care mainly about the MIDI Events on and off with the header 0x09 or 0x08 respectively.

![](/uploads/2021/01/1.png)

First things first we set the gate, when we get a MIDI on message. The gate pin is connected to the gate ouput and gate LED, and here we need values of 0 or 5 Volts. We do that via digitalWrite setting the pin to "HIGH". And since we are using a 5 Volt Microcontroller, that initially unspecified amount is exactly the 5 Volts we need.

![](/uploads/2021/01/2.png)

Next we want to build the first set of bytes for our DAC (Digital Analog Converter). The first set of two bytes is for the note value. To get these values right, and to acess them fast we are using a so called "look-up table". A look-up table is a table full of precalculated values where can just "look-up" the right value. We then need to seperate this value into two 8 bit long bytes, for this we use the bitshift command (>>) to "move" the relevant bits 8 "digits" over. These two 8 bit integers then get passed as a Vector2, which is just a form of passing two values at once.

![](/uploads/2021/01/4.png)

Now we send the data to our DAC. The DAC and Microcontroller comunicate via the Serial Peripheral Interface (SPI). The spefics of that standard do not concern us at this point, but the transmison works in practice like this:First we tell the Chip to pay attention, then we send our two bytes, and lastely we tell the chip that we are done.

![](/uploads/2021/01/1.png)

Now we are going to build our second set of bytes. This time this is even easier. On the incoming side we have the MIDI Velocity, which is per definition an integer value between 0 and 127. On the outgoing side we need a value between 0 and 5 Volts. But since the DAC primary function ist to convert the digital values into analog ones from 0 up to 5 Volts, we only need to push the digits we got to the front. This is because the DAC works with the most significant bit first, meaning that the most important bites are the front ones. Otherwise we would only get differences in the second or third decimal place. We then split the value into two bytes similar to before, and send them exactly as before.

![](/uploads/2021/01/5.png)

# Attributions

<table style="width:100%"><tbody><tr><td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/240px-Visual_Studio_Code_1.35_icon.svg.png" style="height: 1em"></td><td>Coded in Visual Studio Code https://code.visualstudio.com/</td></tr><tr><td><img src="https://cdn.platformio.org/images/platformio-logo.17fdc3bc.png" style="height: 1em"></td><td>Using platform.io for Arduino Codeing https://platformio.org/</td></tr><tr><td><img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Ffreesvg.org%2Fimg%2FKiCad_icon.png&amp;imgrefurl=https%3A%2F%2Ffreesvg.org%2Fkicad-icon&amp;tbnid=VhVM5f_E6NsM7M&amp;vet=12ahUKEwjX2uerzZnuAhVVO-wKHeYBBaoQMygCegUIARCbAQ..i&amp;docid=gy6s9pFOf-vAfM&amp;w=600&amp;h=600&amp;q=kicad%20icon&amp;ved=2ahUKEwjX2uerzZnuAhVVO-wKHeYBBaoQMygCegUIARCbAQ" style="height: 1em"></td><td>Schematic design in KiCad https://kicad.org/</td></tr><tr><td><img src="https://damassets.autodesk.net/content/dam/autodesk/www/products/responsive-imagery/responsive-badges-free-trial/2020/fusion-360-icon-128px-hd.png" style="height: 1em"></td><td>Frontpanel design in Fusion 360 https://www.autodesk.de/products/fusion-360/overview</td></tr><tr><td><img src="https://upload.wikimedia.org/wikipedia/commons/8/85/Scribus_logo.svg" style="height: 1em"></td><td>DTP Layout in Scribus https://www.scribus.net/</td></tr><tr><td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Calligrakrita-base.svg/240px-Calligrakrita-base.svg.png" style="height: 1em"></td><td>Drawings made in Krita https://krita.org/en/</td></tr><tr><td></td><td>Digital font http://mplus-fonts.osdn.jp/about-en.html#download-1</td></tr><tr><td></td><td>This Project can be found at https://github.com/Felan7/midiFox</td></tr></tbody></table>

¹ Funness of colors not guaranteed.
