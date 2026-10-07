---
title: "Sound Synthesis using Embedded Linux: zynaddsubfx in Eurorack"
summary: "An Odroid U3 with a real-time kernel runs the ZynAddSubFX synthesizer with under 10 ms latency – packed into a Eurorack module."
year: 2016
tags:
  - "Eurorack"
  - "Embedded"
  - "Linux"
  - "Synthesis"
cover: "/uploads/2016/10/IMG_0019.jpg"
order: 26
legacyPaths:
  - "/sound-synthesis-using-embedded-linux-zynaddsubfx-in-eurorack/"
---

I still had an old [Odroid U3](http://www.hardkernel.com/main/products/prdt_info.php?g_code=g138745696275) ARM-based credit card sized embedded PC lying around unused. A while back I was able to get a real-time kernel up and running on it and managed to reduce the on-board audio codec buffer down to a size of 32 -256 samples, resulting in an audio latency of <=10ms. This made the device responsive enough to actually be used as a platform for Linux audio plugins / programms. Back then I checked out the Linux synthesizer [zynaddsubfx](http://zynaddsubfx.sourceforge.net/) I was really impressed.

Recently I started setting up my own Eurorack modular synthesizer and when I saw this [7″ Chinese touch LCD](https://de.aliexpress.com/w/wholesale-7-zoll-Raspberry-pi-3-B-touchscreen-1024*600.html?spm=2114.010208.0.0.BpGWPy&initiative_id=SB_20161016110726&site=deu&groupsort=1&SortType=price_asc&g=y&SearchText=7+zoll+Raspberry+pi+3+B+touchscreen+1024*600), which just so fits into the Eurorack frame, I thought maybe I could bring zynaddsubfx on the Odroid to life within that setup.

It took a bit of fiddling to get the Odroid work with the display and to have the setup run stable, but eventually I even got my old [midi sport 4×4](http://m-audio.de/midisport-4x4-anniversary-edition) midi interface to run with the Odroid. So now I have a nice midi matrix hub using Jack on Linux and a great synth all within the Eurorack. zynaddsubfx is a great especially in terms of polyphonic pad sounds and efx, making it a great addition to my (still in progress) Eurorack. Even better, the synth supports multimode, so one can have several sounds running in parallel.

Had everything running today for a couple of hours and it seems pretty stable.

Also [contacted the maintainers](http://www.kvraudio.com/forum/viewtopic.php?f=47&t=268277&start=420) of zynaddsubfx which are going to [release v3.0](http://zynaddsubfx.sourceforge.net/roadmap.html), featuring a fresh GUI, shortly. They are potentially interested in making the UI more useful on small screens.

Few pictures of the still in progress “module”:

![img\_0019](/uploads/2016/10/IMG_0019.jpg)

Demo video:

https://www.youtube.com/watch?v=5S-ZhKhZemQ

*Author: R. Manzke 2016*
