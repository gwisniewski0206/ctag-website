---
title: "Teensy audio library extension for CTAG face 2|4 including Freeverb reverb fx"
summary: "Connects a Teensy 3.6 to the CTAG face2|4 sound card and extends the Teensy audio library, including a Freeverb reverb."
year: 2018
tags:
  - "Embedded"
  - "DSP"
links:
  - label: "Code: ctag-face-2-4"
    url: "https://github.com/ctag-fh-kiel/ctag-face-2-4"
  - label: "Code: ad1938_codec"
    url: "https://github.com/yasmeensultana/ad1938_codec"
  - label: "Code: freeverb"
    url: "https://github.com/yasmeensultana/freeverb"
  - label: "Dokument (PDF)"
    url: "/uploads/2018/01/Open-Source-Audio-Platform-for-Embedded-Systems.pdf"
order: 22
legacyPaths:
  - "/teensy-audio-library-extension-for-ctag-face-24-including-freeverb-reverb-fx/"
---

### Introduction

The first aim of this project is to develop an interface between a Teensy 3.6 board and a CTAG face 2/4 soundcard.

Using Teensy 3.6 board and CTAG Face 2/4 soundcard combination as an audio platform, extend the Teensy audio library’s  functions.  The CTAG face 2/4 board has an SPI interface for controlling the AD1938 Audio Codec and I2S port to receive and transmit audio data. The two CTAG face 2/4 sound cards are connected in daisy chain mode to extend the system audio capacity to 4 stereo channel input/8 stereo channel output. The second part of the thesis deals with adding a reverberation effect for audio received from the audio codec.

### Features

When two CTAG connected in daisy chain mode

-   4 stereo input channels and 8 stereo output channels
-   16 bits per sample for TDM 8 input channels  and 16 output channels at 48KHz
-   24 bits per sample for TDM 8 input channels and 8 output channels at 48 KHz
-   CTAG face 2/4 board can be configured either I2S master or I2S Slave
-   TDM Audio driver round trip time is 9.6 ms
-   Reverb effect using freeverb algorithm on the  stereo channel input

### Implemenation :

![](/uploads/2018/01/teensy-block-diagram.jpg "Data flow and control diagram")

Data and control flow diagram

The two CTAG board connected to the teensy 3.6 forming daisy chain mode to expand the system to 8 ADCs and 16 DACs. The Master AD1938 in the diagram provides the bit clock(BLCK) and frame sync (LRCLK)for both Teensy and slave  AD1938 codec.

The existing Teensy audio library doesn’t have support for the AD1938 control and 16 channel TDM support in the I2S slave mode. This project adds the following extension to the Teensy audio library.

1.  **SPI driver for AD1938 codec:** This driver was implemented by AudioControlAd1938  class. This  audio control class is derived from the base class of “AudioControl“ existing in Teensy audio library. This Class has SPI write and SPI read function according to AD1938 codec protocol and using these function, codec registers are configured.
2.  **I2S driver in TDM Slave mode**: This driver was implemented by I2SInputTDMSlave/I2SOutputTDMSlave   class and they are derived from AduioOuputTDM and AduioInputTDM classes respectively. In this class I2S registers and eDMA setup are configured for TDM 16 channel input and output and Teensy as I2S slave.
3.  **Freeverb Audio Effect**: Artificial Reverberation using Freeverb algorithm was implemented by AudioEffectFreeveb class. It is a popular implementation of the Schroeder reverberator program by “Jezar at Dreampoint‘’. It uses four Schroeder allpass filters in series and eight parallel Schroeder-Moorer filtered – feedback comb-filter for each audio channel.

![](/uploads/2018/01/freeverb-1.png)

[Freeverb Block diagram\[1\]](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html)

The Freeverb building blocks like **comb filters** and **all-pass filter** are implemented in fixed-point arithmetic’s to be compatible with older Teensy boards, reduce the CPU computational and increase the precision.

After the all the classes are developed they are tested using the PCM pass through application. For the PCM pass through, I2S TDM class and Freeverb classes are connected as shown in the below figure.

![](/uploads/2018/01/Teensy-gui.png)

PCM Pass through object connections

The Audio PCM is given from PC to ADC input of AD1938 codec and the out from the DAC of AD1938 is connected to Speaker.By varying the freeverb parameters the effect is heard/ recorded on the live data.

### Evaluation:

The following are the three aspects measured using oscilloscope and teensy library functions.

-   **I2S driver Latency:**

By using oscilloscope the latency can be measured. Oscilloscope captures the transmitted and received signal,  the figure below shows the delay between signals and it is around **9ms**.

![](/uploads/2018/01/round-trip-delay.png)

-   **CPU Consumption**
    -   I2S driver – 2%
    -   Freeverb Algorithm – 22%

-   **Memory foot-print**

The following table shows the measured memory details

![](/uploads/2018/01/Picture1memory-table.png)

### Source References:

1.  [https://ccrma.stanford.edu/~jos/pasp/Freeverb.html](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html)
2.  [CTAG face 2/4](https://github.com/ctag-fh-kiel/ctag-face-2-4): Soundcard based on AD1938 audio codec
3.  [Teensy Audio driver](https://github.com/yasmeensultana/ad1938_codec): Development of SPI and I2S driver in Teensy Slave mode.
4.  [Freeverb Algorithm](https://github.com/yasmeensultana/freeverb): Reverb effect using a freeverb algorithm for the teensy audio driver.

### **Full Report**

-   The full master thesis report  is available [here](/uploads/2018/01/Open-Source-Audio-Platform-for-Embedded-Systems.pdf).
