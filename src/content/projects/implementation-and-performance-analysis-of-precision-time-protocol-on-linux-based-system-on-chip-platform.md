---
title: "Implementation and Performance Analysis of Precision Time Protocol on Linux based System-On-Chip Platform"
summary: "Implementation of the Precision Time Protocol (IEEE 1588) on a Linux system-on-chip and analysis of the synchronisation accuracy it reaches."
year: 2018
tags:
  - "Audio over IP"
  - "Embedded"
  - "Linux"
links:
  - label: "Bericht (PDF)"
    url: "/uploads/2018/05/Master_Project__PTP_1588.pdf"
  - label: "Präsentation (PDF)"
    url: "/uploads/2018/05/Presentation_MasterProject_FH_Kiel.pdf"
order: 21
legacyPaths:
  - "/implementation-and-performance-analysis-of-precision-time-protocol-on-linux-based-system-on-chip-platform/"
---

##### What is Precision Time Protocol?

The Precision Time Protocol (PTP) specified in IEEE 1588-2008 standard is a self-organizing and optionally hardware supported time synchronization protocol, the protocol operates on master/slave hierarchy on local area networked devices and provides the opportunity to achieve the sub-microsecond level accuracy.

##### Why Time Synchronization?

The time is a measurable period in which a particular event, process or action may occur. In the domain of distributed systems, it can be used to draw a conclusion on the rate of change, event ordering, an interval between different process and exact time of particular action. A clock is used to measure the specific spot in the time or a whole interval of time. In an embedded system, the clock is driven by an internal oscillator, which generates the signals with a precise frequency. In a networked system, where different nodes having different type of clocks, which are powered by non-identical oscillators. These oscillators are running at different frequencies and having inconsistent behavior in different conditions (Temperature, Voltage), which results in a timing error. So, there is a need for time synchronization to correct the drifting clocks from the reference time.

# **1\. Introduction**

The project aimed to implement and analyze the PTP protocol on hardware-assisted IEEE 1588 clock based system-on-chip platform (Beaglebone Black) by using an opensource (LinuxPTP) solution. The document of project summarizes PTP protocol and PTP infrastructure in Linux, and it represents the comparison between software and hardware assist PTP implementation. In order to analyze the performance and behavior of established PTP network, multiple tools are used to simulate the load scenarios in different dimensions (CPU, I/O and network).

### Research Objectives and Goals

-   Enabling Hardware timestamping capabilities of BeagleBone Black.
-   Analyzing the behavior of PTP implementation, with simulated load.
-   Analysis of precision uncertainty.
-   Maximum attainable accuracy.

### Tools and Technologies

![](/uploads/2018/05/phc2systemClock.png)

LinuxPTP based Time Synconization

#### LinuxPTP:

The LinuxPTP project yields multiple executable files (ptp4l, phy2sys and pmc) in order to establish the whole two-step synchronization mechanism .

##### ptp4l:

The ptp4l tool synchronizes (by default) PHC (PTP hardware clock)  with master clock in network. If the system does not have PHC then it synchronizes the system clock with a master clock using software timestamping, in this case, there is no need of phy2sys tool.

##### phy2sys:

The phc2sys tool synchronizes Linux system clock to the PHC. In whole process the the phc2sys is synchronized with ptp4l, where system clock act as slave and PHC plays a role of master clock.

![](/uploads/2018/05/beagleboneblack-topweb.png)

Beaglebone Black (Master/Slave Clock)

![](/uploads/2018/05/Test_Env.png)

Test Environment

# **2\. Methodology**

In order to achieve research objectives and to implement IEEE 1588 protocol, linuxPTP (Opensource PTP implementation) application is used on SoC devices (Beaglebone Black) in a Linux environment. The protocol hierarchy is established in different test case scenarios (Hardware assisted and Software based tests ). The log data generated in a specific scenario is prepared and imported to MATLAB workspace, where comparison of results in different scenarios are compiled in graphical form.

###  Data Collections and Presentation

![](/uploads/2018/05/log-1.png)

Log Data

![](/uploads/2018/05/workspace-1.png)

Matlab Workspace

![](/uploads/2018/05/allinoneGraphw-1.png)

Graphs

### **3\. Results**

### Software Timestamping based Time Synchronization

![](/uploads/2018/05/PureSwMulti-complete-histo-V1s.png)

Precision of Software based PTP Implementations

![](/uploads/2018/05/PureSwMulti-complete-graph-zoom-V1.png)

Software Timestamping based Time Synchronisation

### Hardware Timestamping based Time Synchronization

![](/uploads/2018/05/PureHwMulti-complete-histo-V1.png)

Precision of Hardware based PTP Implementation

![](/uploads/2018/05/PureHwMulti-complete-graph-first4rect-V1.png)

Hardware Timestamping based Time Synchronization

### Comparison of Hardware and Software based Time Synchronization

![](/uploads/2018/05/SwHwComapin-complete-graph-V1.png)

Comparison of Software and Hardware based Synchronization

![](/uploads/2018/05/PureHwMulti-complete-graph-second1rect.png)

Hardware Timestamping based Time Synchronization (Single Slave)

### Hardware Assisted Time Synchronization under Network Load

![](/uploads/2018/05/11-1-1MbVs5Mb-Histo-V1.png)

Precision of Hardware Assisted Time Synchronisation under Network Load

![](/uploads/2018/05/11-1-9-0MbVs1MbVs5Mb-V1.png)

Hardware Assisted Time Synchronization under Network Load (Low)

![](/uploads/2018/05/11-2-10MbVs20MbVs50Mb-Histo-V1.png)

Precision of Hardware Assisted Time Synchronization under Network Load

![](/uploads/2018/05/11.2-10MbVs20MbVs50Mb-V1.png)

Hardware Assisted Time Synchronization under Network Load (High)

## **Download Links and Contact Details**

Project Documentation:

Report: [Master\_Project\_\_PTP\_1588](/uploads/2018/05/Master_Project__PTP_1588.pdf)

Presentation: [Presentation\_MasterProject\_FH\_Kiel](/uploads/2018/05/Presentation_MasterProject_FH_Kiel.pdf)

*Mudassar Ahmed*

*mudassar.ahm@hotmail.com*
