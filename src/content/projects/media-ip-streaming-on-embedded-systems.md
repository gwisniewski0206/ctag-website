---
title: "Media IP Streaming on Embedded Systems"
order: 9
year: 2020
legacyPaths:
  - "/media-ip-streaming-on-embedded-systems/"
---

This project is based on [Synchronized real time audio streaming over ethernet](/projects/synchronized-real-time-audio-streaming-over-ethernet/) by Indumathi Duraipandian. It implements parts of the AVB protocol for both, the Beaglebone AI and Beaglebone Black to equip both devices with realtime audio streaming capabilities via ethernet connections.

The [project](https://summerofcode.withgoogle.com/archive/2020/projects/6143660611076096/) was conducted in context of Google Summer of Code 2020 for [BeagleBoard.org](https://beagleboard.org/). Further technical information can be found on the official project [documentation page](https://niklaswan.github.io/GSoC-Overview/).

### Project Description

The BeagleBone AI is equipped with a high amount of processing power due to the Dual Core ARM Cortex-A15 chip as a main computing unit and its accompanying co-processors. This makes the AI a perfect fit for highly demanding applications regarding CPU consumption, like media applications which have extremely strong realtime constraints. Professional audio/video studios have to guarantee for small latencies when transmitting media signals between different devices. Different media channels in a transmitted stream need to be carefully synchronized to guarantee for e.g. lip synchronicity. To use the AI in such a scenario, the AVB protocol stack should be implemented in the Beagleboard Linux Kernel, which allows for synchronization of media streams within a local area network. Furthermore the CTAG Face audio drivers should be ported from BeagleBoard-X15 and HDMI audio out capabilities should be deployed, to allow the in- and output of audio data.

### Project Goals

-   Port CTAG Face drivers implemented by Henrik Langer for GSoC 2016 to Linux kernel 4.19-rt for BeagleBone AI
-   Port AVB driver stack implemented by Indumathi Durainpandian for GSoC 2017 to Linux kernel 4.19-rt for BeagleBone AI
-   Refactor and modularize present AVB driver architecture
-   Implement AVDECC protocol part of AVB to allow for device enumeration and control

### Introduction

https://www.youtube.com/watch?v=xitPFuZUG0k

### Project Outcome

During the project I successfully ported the CTAG Face drivers by Henrik Langer from kernel version 4.4 to 4.19-rt and started porting to 5.4-rt for both BBB and BBAI. The port to 5.4-rt however still needs some adjustments, look [here](https://niklaswan.github.io/GSoC-Overview/face-driver/#Drivers%20for%205.4-rt) to see a description.

The second part of the project was to port the virtual ALSA driver of Indumathi Duraipandian from kernel 4.4 to 4.19-rt. During the course of the project I however realized, that 4.19-rt is running quite unstable on BBAI. Because of that I changed to kernel 5.4-rt for the implementation. The driver code was modularized and refactored and the AVDECC protocol part which indu allready implemented was also ported. However the implementation is still not working correctly with third party devices, like the proprietary Apple Mac implementation. All further limitations of the AVB implementation can be found [here](https://niklaswan.github.io/GSoC-Overview/avb-alsa/#Limitations).

### Demonstration

https://www.youtube.com/watch?v=ogb4QcemvFQ

### Downloads:

#### Source Code:

[GitHub](https://github.com/NiklasWan/linux)

#### Technical Documentation:

[Technical Documentation](/uploads/2020/10/Wantrupp_928817_PROMIE.pdf)

### Author

*Niklas Wantrupp* 2020
