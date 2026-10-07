---
title: "Synchronized real time audio streaming over ethernet (AVB on Beaglebone)"
summary: "Study, implementation and evaluation of AVB for synchronised real-time audio streaming over Ethernet on BeagleBoard hardware and Linux."
year: 2018
tags:
  - "Audio over IP"
  - "Embedded"
  - "Linux"
links:
  - label: "Code: gPTPd"
    url: "https://github.com/induarun9086/gPTPd"
  - label: "Code: beagleboard-linux"
    url: "https://github.com/induarun9086/beagleboard-linux"
  - label: "Code: avbtest"
    url: "https://github.com/induarun9086/avbtest"
  - label: "Dokument (PDF)"
    url: "/uploads/2018/01/Synchronized_real_time_audio_streaming_over_Ethernet_in_embedded_systems-33.pdf"
  - label: "Präsentation (PDF)"
    url: "/uploads/2018/01/Master-Defence-4.pdf"
order: 23
legacyPaths:
  - "/synchronized-real-time-audio-streaming-over-ethernet/"
---

#### **Description**

Study, implementation and evaluation of the AVB standard of protocols, in a open hardware (beagle board devices) and open software (Linux) for the requirement of Synchronized Real time audio streaming over Ethernet networks.

#### **Features**

-   Synchronized  real time audio streaming using the Audio Video Streaming (AVB) protocol over Ethernet networks.
-   The following protocols of the AVB (or more commonly known as Time Sensitive Networks – TSN) are implemented.
    -   *Generalised Precision Time Protocol – gPTP* implemented as a Linux daemon which runs in the background and synchronizes the Linux PTP hardware clock (/dev/ptp0) with the AVB synchronized time.
    -   *Multiple Stream Reservation Protocol – MSRP* implemented as part of the AVB virtual ALSA audio device driver software. Used to create and manage AVB media streams.
    -   AVB Device Discovery Enumeration Command and Control Protocol – AVDECC implemented as part of the AVB virtual ALSA audio device driver software. Used to manage AVB devices in the AVB network.
    -   *Audio Video Transfer Protocol – AVTP* implemented as part of the AVB virtual ALSA audio device driver software. Used to transfer audio, video data.
-   All the AVB protocol communication are carried using the Ethernet Layer 2 packets.
-   A maximum of 8 audio channels upto 192 kHz sampling rate are supported.
-   Supported on the beagle bone black and the beagle board x15 devices. Although it is theocratically possible to port to any platform where the Linux hardware time-stamping is supported for the Ethernet messages.
-   Partial support for the interoperability with Apple Mac computers which support AVB streaming.

#### **Implementation**

A general architecture for the AVB Stack implementation in Linux is as follows,

![Linux AVB Stack Architecture](/uploads/2018/03/AVBArch.png)

Linux AVB Stack Architecture

The entire stack is comprised of three set of software components.

1.  The gPTP daemon which can be built either as a daemon or as a normal user level application. Refer the [github](https://github.com/induarun9086/gPTPd) page for details of building and the execution with different command line arguments.
2.  The AVB virtual ALSA device driver which can be used as a normal ALSA device for playback and capture using the standard ALSA user level API. Can be configurable as a lodable or a static kernel module and built using the Linux kernel build process. Refer to the Linux distribution for beagle bone black [gihub page here](https://github.com/induarun9086/beagleboard-linux/blob/4.4/sound/drivers/avb.c).
3.  The user level demo/test application. The build instructions and execution details along with the command line parameters are described in the github page [here](https://github.com/induarun9086/avbtest).

Also more details regarding the demo and the general setup of the AVB protocol stack components are explained in the [wiki](https://github.com/induarun9086/avbtest/wiki) of the AVB demo application.

#### **Evaluation**

The following four aspects of the “Synchronized real time audio streaming” requirement of the AVB stack implementation are tested. At first the measured delay variance in the gPTP delay measurement is measured and  the results show that the deviation is very less and nearly 2 magnitude smaller than the measured delay value.

![gPTP Delay Variance](/uploads/2018/01/delayVariance.png)

gPTP Delay Variance

Another clock related parameter is the ability of the local clock to stay in sync with the remote clock, i.e. the rates of the both clocks should be the same. Any difference in the rates of the two clocks can be measured as the clock drift. This measurement measures the time difference accumulated between the local and remote clocks between two successive corrections. The results show that the clock drift is bounded and has a average of 28.17 us/s.

![Clock drift](/uploads/2018/01/syncAcc.png)

Clock drift

To measure the real synchronization error, a AVB demo setup is created and the audio streamed over the AVB networks are recorded and the sample error is measured. In the following case the synchronization error is 15 samples which at 48 kHz sampling rate translates to a synhcronization accuracy of 312.5 us.

![Sync error measurement](/uploads/2018/01/syncErr.png)

Sync error measurement

Finally the detection of the beagle board black device running the AVB stack, as a AVB device by a Apple MAC computer is shown below.

![MAC Detection](/uploads/2018/01/MAC.png)

MAC Detection

#### **Demo**

https://www.youtube.com/watch?v=4hchaB7sKvY

#### **Links**

-   gPTP Daemon – [https://github.com/induarun9086/gPTPd](https://github.com/induarun9086/gPTPd)
-   AVB ALSA Virtual Audio Device Driver – [https://github.com/induarun9086/beagleboard-linux/blob/4.4/sound/drivers/avb.c](https://github.com/induarun9086/beagleboard-linux/blob/4.4/sound/drivers/avb.c)
-   AVB Test/Demo Application – [https://github.com/induarun9086/avbtest](https://github.com/induarun9086/avbtest)
-   AVB protocol suite and demo wiki – [https://github.com/induarun9086/avbtest/wiki](https://github.com/induarun9086/avbtest/wiki)

#### **Full Report**

The full report (Master Thesis) is available [here](/uploads/2018/01/Synchronized_real_time_audio_streaming_over_Ethernet_in_embedded_systems-33.pdf). And a short pretension with the important topics is available [here](/uploads/2018/01/Master-Defence-4.pdf).
