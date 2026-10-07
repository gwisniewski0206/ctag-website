---
title: "Setup and evaluation of a media IP real-time system"
summary: "Setting up an audio-over-IP chain on standard Ethernet hardware and measuring how close to real time it gets."
year: 2021
team:
  - "Anton Bracke"
tags:
  - "Audio over IP"
  - "Linux"
links:
  - label: "Code: aes67-test-suite"
    url: "https://github.com/anbraten/aes67-test-suite"
  - label: "Code: beagle-bone-builder"
    url: "https://github.com/anbraten/beagle-bone-builder"
  - label: "Bericht (PDF)"
    url: "/uploads/2021/09/ThesisBracke2021.pdf"
order: 1
legacyPaths:
  - "/setup-and-evaluation-of-an-media-ip-real-time-system/"
---

## Abstract

Transmitting audio signals with close to real-time speed is one of the requirements many broadcast and recording studios have. For a long time this kind of transmissions was done by using additional proprietary hardware from different manufacturers. Digitization is one of the reason ethernet networks gained an enormous amount of prominence. Based on their ever growing bandwidths and ever decreasing latencies, they can be used to transmit audio with latencies below 10 milliseconds. By using such existing networks only little effort has to be expended to establish an audio network as most of the hardware can be kept. Normally it is sufficient to replace some network switches to support packet prioritization and to attach some new end devices which include a network card with an internal hardware clock to provide a performant basis for time synchronization. Any additional request can be realized by software and drivers which support standards like AES67. Standards similar to AES67 and the ones used by ethernet networks bring the benefit that hardware from many different suppliers can interact with each other. This paper addresses which of those components are required and should be focused on for a minimal audio over IP network.

## Evaluation

A basic AES67 network was set up for this project. To evaluate different aspects of it three tests were carried out.

One of these tests will be briefly described in this post. More information and the other two tests can be found inside the thesis which will be linked at the end.

## Test setup

The PTP-Grandmaster (ptp4l) has been installed on a BeagleBone-Black. For the audio transmission two additional BeagleBones with an OpenSource AES67 driver and a [CTAG soundcard](/projects/linux-based-low-latency-multichannel-audio-system-2/) were used. The AES67 driver is based on a Merging Ravenna driver with a daemon and web-ui developed by [Andrea Bondavalli.](https://github.com/bondagit) The source-code can be found on [Github](https://github.com/bondagit/aes67-linux-daemon). A special media network-switch from Motu has been used to prioritize audio packages. To compare the two audio signals which will be transmitted (one directly and one over ethernet) an oscilloscope has been attached to the two soundcards.

![](/uploads/2021/09/Test-4.png)

The goal of this test was to measure the latency the audio signal takes over the AES67 network compared to the same signal being played directly on a physical soundcard. To keep differences in both ways as minimal as possible almost the same setup has been used for both ways:

### ![](/uploads/2021/09/Screenshot-from-2021-09-22-21-13-15.png)

In order to be able to recognize distinctive points in both recorded graphs, a synthetic sound has been used:

### ![](/uploads/2021/09/test-sound-version2.png)

## Measurement

This measurement shows the “directly” outputted audiosignal (blue) compared to the signal which was transmitted over ethernet. As you can see both signals are quite synchron, but have a rather high delay of around 50ms. This could be coming from differences between both transmissions ways in the test setup. The tool alsaloop for example has been used to forward the signal from the AES67-soundcard to the CTAG-soundcard and could be one of the reason for this rather unexpected delay.

![](/uploads/2021/09/test1-scope-versuch2-2.png)

## Source Code and more information

You can find two more tests written in German in the Thesis [“Aufbau und Evaluation eines Media IP Echtzeitnetzwerkes”](/uploads/2021/09/ThesisBracke2021.pdf).

The test suite written in Golang can be found in this repository: [https://github.com/anbraten/aes67-test-suite](https://github.com/anbraten/aes67-test-suite)

The scripts and pipeline to create the used BeagleBone Image can be found in this repo: [https://github.com/anbraten/beagle-bone-builder](https://github.com/anbraten/beagle-bone-builder)

Project by Anton Bracke 2021
