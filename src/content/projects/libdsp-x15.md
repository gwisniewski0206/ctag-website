---
title: "libdsp-x15 – C66x DSP library for BeagleBoard-X15 focusing on audio applications"
order: 25
year: 2017
legacyPaths:
  - "/libdsp-x15/"
---

# Introduction

The BeagleBoard-X15 is single board computer (SBC) based on AM5728 SoC by Texas Instruments.
AM5728 offers two integrated C66x DSPs, which can be used for real-time signal processing in asymmetric multiprocessor configurations.
Moreover the digital audio interface (DAI) of AM5728 is compatible with BeagleBone Black/Green.
An audio system consisting of our multi-channel audio card CTAG face2|4 and an easy to use DSP library would offer a powerful platform for real-time, low-latency audio processing and synthesis.
The whole project was part of my [Google Summer of Code 2016 participation](https://summerofcode.withgoogle.com/archive/2016/projects/5351212496977920/) for the BeagleBoard.org organization and is separated in the following project parts.

1.  Create library to make use of C66x DSPs
2.  Porting the CTAG face2|4 Audio Card drivers to AM5728 SoC (see [project page](/projects/linux-based-low-latency-multichannel-audio-system-2/) or [hackaday project](https://hackaday.io/project/9634-linux-based-low-latency-multichannel-audio-system))

# Features

The DSP library *libdsp-x15* focuses on audio processing and offers the following signal operations.

| Operation | Description |
| --- | --- |
| Fast Fourier transform (FFT) | Operation which transforms signal from time domain to frequency domain (spectrum). Often used for signal analysis and further processing in frequency domain (e.g. audio coding). |
| Inverse fast Fourier transform (IFFT) | Inverse operation of FFT which transforms signal from frequency domain back to time domain. Often used for additive synthesis. |
| Biquad filter | Two pole and two zero infinite impulse response (IIR) filter. Biquad filters are often used in audio applications due to its stability. To achieve a higher filter slope, biquad filters can be serially cascaded instead of using higher order IIR filters (can be highly sensitive to quantization errors of their coefficients => unstable). |

# Examples

## FFT / IFFT Test

A small program for FFT and IFFT testing is located in code/test-fft-ifft/. At first a 1 kHz sine with a sample rate of 48 kHz (default for CTAG face2|4) is generated. The block size of FFT (N) is set to 512 samples (single precision floating point). After the generated sine samples have been copied to the FFT input buffer and saved in the text file test/data/sine.txt, the FFT operation is started asynchronously. When the DSP operation has been completed, the callback function is called with the complex FFT result data, from which the absolute value is calculated and persisted in test/data/fft\_sine.txt. Furthermore the complex result data is copied to IFFT input buffer. After execution, the IFFT result data is persisted in test/data/ifft\_sine\_spectrum.txt. The GNU Octave script test/FFT\_Plot.m creates a plot of the generated sine, its spectrum and the reconstructed sine, and saves it in test/fft\_test\_sine.pdf.

http://docs.google.com/gview?url=https://github.com/henrix/libdsp-x15/raw/master/test/fft_test_sine.pdf&embedded=true

## Biquad Filter Test

The biquad filter test is located in code/test-filter-biquad/. The filter is configured as Notch with 10 kHz cutoff frequency, 48 kHz sample rate and a quality factor of 1.0. As test data a 1 kHz sine and 10 kHz has been generated. At first the 1 kHz sine data is copied to the DSP input buffer. After execution, the filtered sine is persisted in test/data/filtered\_sine\_1kHz.txt and the 10 kHz sine is copied to DSP input buffer. After the second DSP execution, the filtered 10 kHz sine is persisted in test/data/filtered\_sine\_10kHz.txt, as well. A GNU Octave script, which plots the transfer function, the test and result data is located in test/FILTER\_BIQUAD\_Plot.m (a PDF is created in test/filter\_biquad\_test.pdf).

http://docs.google.com/gview?url=https://github.com/henrix/libdsp-x15/raw/master/test/filter_biquad_test.pdf&embedded=true

## Realtime Spectrum

The Realtime Spectrum Demo uses the FFT operation with N = 512. For real-time audio input, a JACK (Jack Audio Connection Kit) client has been created.
The Demo is based on QT and uses QCustomPlot for plotting.
When the JACK callback is called with new audio data, the data is copied to the DSP input buffer and the FFT operation is executed.
After the DSP callback has been called, the magnitude is calculated from the complex result data and displayed in the main window.

https://www.youtube.com/watch?v=hUJIS0wPzFk

## Realtime Filter

The Realtime Filter Demo uses the biquad filter operation with a filter length of 512 samples.
The normalized filter coefficients (a0,a1,a2,b1,b2) can be calculated from the user defined parameters filter type, cutoff frequency (Fc), sampling frequency (Fs), quality factor (Q) and gain. libdsp-x15 offers the static method API::calcBiquadCoefficients for this purpose.
The filter parameters can be changed during runtime. The transfer function is plotted via QCustomPlot.

https://www.youtube.com/watch?v=w60w4aawvDU

# Build Process

## libdsp-x15

libdsp-x15 can be easily built using CMake. CMake is available in the official repos and can be installed with the command:
`sudo apt-get install cmake -y`
After successful installation, switch to the directory code/libdsp-x15, generate a Makefile with CMake and compile the Makefile:
`cmake .`
`make`
After compilation, the shared library object libdsp-x15 has to be copied to /usr/lib/. To cache the exported symbols of the library, execute the command:
`sudo ldconfig`

## Tests

For the FFT/IFFT and filter test compilation, a Makefile is provided. Simple switch to test directory and execute the command:
`make`

## Demos

The demos were created with QTCreator, thus can be easily compiled with qmake.
Before compilation, you have to download [QCustomPlot](http://qcustomplot.com/) and extract the archive in code/.
Switch in the corresponding demo directory and type in the commands:
`qmake QT_PROJECT_FILE.pro`
`make`

# Sources

-   [GitHub Repository](https://github.com/henrix/libdsp-x15)
-   [Wiki on GitHub](https://github.com/henrix/libdsp-x15/wiki)

*Author: Henrik Langer*
