---
title: "Ravenna Audio IP Streaming"
order: 8
year: 2020
legacyPaths:
  - "/ravenna-audio-ip-streaming/"
---

## Synopsis

This thesis deals with the basics and requirements of the AES67 standard.
It also explains the basics of Linux driver development and an ALSA driver.
Based on this, a virtual ALSA driver for linux has been developed.

## AES67

AES67 is a audio over ip (aoip) standard for professional applications like broadcast.

### Keyfeatures of AES67

-   uncompressed high quality audio
-   interoperable with a lot of manufactures
-   Builds on proven protocols (RTP, PTP..)
-   Low latency < 10ms
-   All devices are synchronized with a common master clock

## ALSA audio driver

The virtual AES67 ALSA audio driver can receive and send RTP-audio packets in the local network.

### Features of the driver

-   Native virtual ALSA device driver without additional user space daemon
-   support for 44,1 kHz and 48 kHz sample rate
-   support for 16 Bit and 24 Bit sample depth
-   definable packet size
-   configurable IP-Settings
-   configuration via Sysfs

### Architecture of the driver

The driver consists of 4 parts:

![](/uploads/2020/10/Bildschirmfoto-2020-10-26-um-11.29.57.png)

1.  The general driver architecture that is necessary to load the driver etc.
2.  The sys file system to configure the settings (IP address, packet size)
3.  The ALSA architecture
4.  An asynchronous network interface for sending and receiving the RTP packets in the network

## Source Code and more information

The sources including a installation guid can be found on Github: [https://github.com/neufst/ALSA-AES67-Streaming](https://github.com/neufst/ALSA-AES67-Streaming)

The entire thesis is written in German and can be viewed here: [Implementierung eines IP-Audio-Streamingverfahrens (AoIP) auf eingebetteten Systemen](/uploads/2020/10/Thesis.pdf)

Author: Stefan Neufeldt      Email: stefan.neufeldt@gmail.com
