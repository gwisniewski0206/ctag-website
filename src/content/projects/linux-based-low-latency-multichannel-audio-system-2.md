---
title: "Linux-Based Low-Latency Multichannel Audio System (CTAG face2|4)"
summary: "CTAG face2|4: a low-latency multichannel audio card for the BeagleBone with up to 8 channels at 96 kHz and an open-source Linux driver."
year: 2016
team:
  - "Henrik Langer"
  - "Robert Manzke"
tags:
  - "Embedded"
  - "Hardware"
  - "Linux"
  - "Open Source"
cover: "/uploads/2016/02/IMG_02101.jpg"
links:
  - label: "Code: ctag-face-2-4"
    url: "https://github.com/ctag-fh-kiel/ctag-face-2-4"
  - label: "Code: beagle-linux"
    url: "https://github.com/henrix/beagle-linux"
  - label: "Dokument (PDF)"
    url: "/uploads/2016/02/Linuxbasiertes_Mehrkanal-Audiosystem_mit_niedriger_Latenz.pdf"
order: 31
legacyPaths:
  - "/linux-based-low-latency-multichannel-audio-system-2/"
---

-   ![](/uploads/2016/02/IMG_02101.jpg)
-   ![](/uploads/2016/02/IMG_01651.jpg)
-   ![](/uploads/2016/02/IMG_02361.jpg)
-   ![](/uploads/2016/02/IMG_01881.jpg)
-   ![](/uploads/2016/02/IMG_02021.jpg)
-   ![](/uploads/2016/02/IMG_01431.jpg)

## Features:

-   2 stereo ADCs and 4 stereo DACs
-   Up to 96 kHz sampling rate with 8 audio channels (up to 192 kHz with 4 channels)
-   24 Bit word width
-   Separate interfaces to ADCs and DACs
-   Asynchronous sampling rates for playback and capture
-   Up to 3,2 ms round-trip-time
-   Mobile usage (the BeagleBone Green and the audio card both are supplied with 5V supply voltage)

## Project Components / Source Locations:

-   [CTAG face 2|4 at Github](https://github.com/ctag-fh-kiel/ctag-face-2-4 "ctag face 2|4"), I<sup>2</sup>S sound card based on AD1938 audio codec by Analog Devices Inc. (repo contains hardware design files, help documents and device tree overlays)
-   [BeagleBoard Linux](https://github.com/beagleboard/linux), drivers (merged in official kernel) are compatible with [BeagleBone Black/Green](http://beagleboard.org/black) and [BeagleBoard-X15](http://beagleboard.org/x15)
-   [Linux driver development repository](https://github.com/henrix/beagle-linux), development of driver for daisy chained codecs and software SPI
-   Adapter card “bbg-cape” to connect the BeagleBone Black/Green with I<sup>2</sup>S sound card, see Github repo above
-   Adapter card “con-cape” with stereo jacks and headphone amplifier, not yet published due to some bugs
-   BASH script for automatic evaluation of latency, THD+N, DNR, crosstalk and frequency response using GNU Octave
-   [libdsp-x15](/projects/libdsp-x15/), DSP audio library for BeagleBoard-X15 (C66x DSPs, integrated in AM5728 SoC)
-   Surround-Delay Demo Audio Effect
-   Debian Wheezy [SD card image for BeagleBone Green](https://drive.google.com/file/d/0B2goLqs_HZ3QMFV4SFNySjJzX3M/view?usp=sharing) (evaluation script and demonstration effect is included)
-   [Documentation / Thesis (German)](/uploads/2016/02/Linuxbasiertes_Mehrkanal-Audiosystem_mit_niedriger_Latenz.pdf)

## Applications:

-   Mobile sound studio (simultaneously record several inputs with different audio effects applied and preview them on different outputs in real time)
-   Effect device for various music instruments
-   Open platform for DIY audio projects
-   DIY Eurorack modules

## Hardware:

The sound card is based on the [AD1938 audio codec](http://www.analog.com/media/en/technical-documentation/data-sheets/AD1938.pdf) with 2 stereo ADCs and 4 stereo DACs of Analog Devices Inc. and was designed by CTAG Fachhochschule Kiel.
To control and use the sound card via I<sup>2</sup>S and SPI the BeagleBone Green was used due to its Multichannel Audio Serial Port (McASP) of the [AM335X SoC](http://www.ti.com/lit/ug/spruh73m/spruh73m.pdf), which supports up to 16 audio channels on a single data line.

![face24](/uploads/2016/02/face24.jpg)

## Audio system characteristics (using TLV272 OPs):

<table style="width: 40%;"><tbody><tr><td style="text-align: left;">Total Harmonic Distortion plus Noise (THD+N)</td><td>~ -88 dB</td></tr><tr><td>Dynamic Range (DNR)</td><td>~ 110 dB</td></tr><tr><td>Crosstalk</td><td>~ -98 dB</td></tr></tbody></table>

![audiocard\_frequency\_response\_192kHz](/uploads/2016/02/audiocard_frequency_response_192kHz.png)

## Surround Delay Demo Audio Effect:

To demonstrate the possibilities of the audio system (using BeagleBone Green), a surround delay effect was created running in real-time with the open source C++ library [DSPatch](http://sourceforge.net/projects/dspatch/ "DSPatch") of Marcus Tomlinson.
The following figure gives an overview of the signal flow, using the developed audio hardware and software drivers:
![DSPatch\_Delay\_Overview\_Diagram](/uploads/2016/02/DSPatch_Delay_Overview_Diagram.png)

Every component has its own adjustable parameters, such as delay time, delay feedback, mix and so forth.
Moreover support for generic MIDI controllers was added to DSPatch to control effect parameters in real-time.
Signals are generated using a DAW (in this case [Bitwig](https://www.bitwig.com/en/home.html)) on the host PC, sent to the analog in of the audio system, processed on the BeagleBone and sent back to the host using the analog out of the system.

https://www.youtube.com/watch?v=u3A9x9bpbdo

## Ongoing:

-   Implementation of Linux USB audio gadget to use audiosystem as external soundcard on several operating systems via USB

## Project Logs:

-   Updated SD-Card image with most recent versions of [JACK](http://jackaudio.org/) and [SuperCollider](https://supercollider.github.io/)
-   Soundcard drivers were merged to upstream [BeagleBoard Linux kernel](https://github.com/beagleboard/linux)
-   Successful participation in [Google Summer of Code 2016](https://summerofcode.withgoogle.com/archive/2016/projects/5351212496977920/)
    -   CTAG face2|4 Audio Card drivers has been ported to BeagleBoard-X15 (AM5728)
    -   Library for signal operations using C66x DSPs (integrated in AM5728)

## Detailed article:

***The complete document (bachelor thesis), which covers some basic knowledge and the development and evaluation process as well, is published [here](/uploads/2016/02/Linuxbasiertes_Mehrkanal-Audiosystem_mit_niedriger_Latenz.pdf) (currently only available in German).***
*\*There’s an optimized revision of the I<sup>2</sup>S soundcard already, so the audio system characteristics in the attached document are obsolete. The correct values are mentioned above.*

*Authors: Henrik Langer, Robert Manzke
*
