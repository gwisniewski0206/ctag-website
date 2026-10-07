---
title: "Sequencer Web Frontend for Embedded System"
summary: "A web interface hosted on an ESP32 that lets anyone control an embedded step sequencer from a browser over Wi-Fi."
year: 2020
team:
  - "Roman Kravanja"
tags:
  - "Web"
  - "Embedded"
order: 11
legacyPaths:
  - "/sequencer-web-frontend/"
---

## Problem

The Project is about an ESP32 based Sequencer. The output and processing was taken care of, but a way for users to control it was missing. The solution should be easy to use and accessible. Constructing Hardware for that purpose would be too limited and not flexible enough.

## Solution

In the end a web interface hostet on the esp using its wlan-capabilities was chosen to accomplish the task. It should allow any device within the same network to access the sequencer. The following functionality is included:

-   creation, loading and editing of songs
-   creation, loading and editing of patterns
-   configuring steps and tracks in patterns
-   starting and stopping the sequencer
-   communicating to the esp via a rest-api

Previous plans to manage a api with a websocket were stopped due to the limitations of the hardware.

When opening the webapp on any client, a prompt is shown asking the user to either select a song to load or to create a new one.

![](/uploads/2020/07/load_create_song.png)

Once any option has been selected, the song (either a new, empty one or one delivered from the hardware’s storage) is loaded and can be edited.

![](/uploads/2020/07/song_loaded.png)

The top sections provides options to name, save and load songs, as well as queueing patterns into the sequence they should be played in. It can be hidden to get more screenspace for the bottom section.

![](/uploads/2020/07/focus_stepview.png)

This part allows to add, remove, rename and edit patterns, that are part of the song. On the top row, all actively loaded patterns are shown as tabs. On the left side all tracks, that are part of the currently loaded pattern, are shown. By clicking the “+” – button below them, additional tracks can be added.  All tracks can be configured or removed.

![](/uploads/2020/07/edit_track_dialog.png)

The rest of the panel is where the steps are displayed and can be activated, disabled and configured. In the center on the top is the play button to start and stop the sequencer.

![](/uploads/2020/07/edit_step_dialog.png)

## Future

The user-interface, at this point, provides all neccessary  functionality to work with. However there are still aspects that can be improved upon:

-   optimize the webapp for smaller devices and touch controls (responsive design)
-   improve the usability by working on the visuals and arrangement of elements, e.g. in the dialogs
-   performance improvements could be possible by working on serverside optimizations
    -   reading from storage in streams to avoid memory overflow
    -   sending and receiving large bodies of  data in partitions instead of all at once
-   indicators for the link-status on the website (number of current peers and activity of the service)
-   indicator for what pattern and step the sequencer is playing at the moment
-   allowing multiple clients to work on a song together at the same time
-   create a way to enter wlan ssid and password to connect to any network
-   handle cases when the wlan is disconnected or reconnected to keep the service running

## Author

Roman Kravanja 2020
