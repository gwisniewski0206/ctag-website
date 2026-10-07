---
title: "Sound Visualizer Mask"
summary: "An LED mask with about 420 RGB LEDs for live performances, showing visuals that react to MIDI and audio from Ableton Live in real time."
year: 2015
team:
  - "Henrik Langer"
tags:
  - "Light"
  - "Visuals"
  - "Hardware"
cover: "/uploads/2015/08/DSC2256.jpg"
order: 36
legacyPaths:
  - "/sound-visualizer-mask/"
---

**Description:**

A LED mask for live music performances, that displays custom visuals, reacting to several parameters from Ableton Live, such as MIDI signals, audio signals or own defined parameters (i.e. slider, knob, …) in real time.

**Components:**

-   RGB LED mask with ≈ 420 RGB LEDs (Adafruit Dotstar LED strip – 144 LED/m)
-   Teensy 3.1 as decoder (decodes and warps image vector to RGB LEDs)
-   Native Max for Live object “bojuinoWarper” to decode and warp quadratic Max jitter matrices to non-quadratic, uneven surfaces via image vector
-   Max for Live performance instrument with a GUI to control, mix and preview your own created visuals in real time (visuals are included as modules and have to implement a predefined interface)![led\_mask\_control\_gui](/uploads/2015/08/led_mask_control_gui.png)
-   Currently 5 OpenGL visuals for demonstration (face visual, amplitude visualizer, video player, octave visualizer, waveform)

![led\_mask](/uploads/2015/08/DSC2256.jpg)

**Features:**

-   Map any parameter of your MIDI controller or Ableton Live to any parameter of a visual (can also be automated via Ableton Live envelopes)
-   Interactive visuals via audio: Audio signal can be routed from any audio channel to Max for Live performance instrument via network (=> you can also use another computer)
-   Route any MIDI signal from your MIDI track to Max for Live instrument
-   14 video effects

**Overview diagram:**

![led\_mask\_overview\_diagram](/uploads/2015/08/overview_diagram.png)

***Amplitude visualizer demo (better teaser of performance is coming soon)***

/uploads/2015/08/led_mask_vu_visual_demo.mp4

**Sponsors:**

-   [Expand stretch covers](http://www.expand-cover.de/ "Expand stretch covers")
-   [LAWI Engineering GmbH](http://www.lawipower.com/ "LAWI Engineering GmbH")

**Links:**

-   [Ableton Live](https://www.ableton.com/ "Ableton Live") (professional digital audio workstation, especially for live performances)
-   [Cycling’74 Max](https://cycling74.com/ "Max") (visual programming platform)
-   [Teensy 3.1](https://www.pjrc.com/teensy/teensy31.html "Teensy 3.1") (microcontroller)

*Created by Henrik Langer, Stretch Material Sponsored by [Expand Covers](http://www.expand-cover.de/)*
