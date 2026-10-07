---
title: "Procedural Generation / Space Game"
summary: "First steps of the Space Game: the map format for solar systems and how maps are generated, stored and loaded at runtime."
year: 2015
tags:
  - "Game"
  - "Web"
order: 41
legacyPaths:
  - "/procedural-generation/"
---

These are the first impressions from the “Space game” project of the CTAG. We started off with the definition of the game map format and its handling. The game map format is defined in several different ways depending on the part of the program it is used in. There are different formats for permanent saving the maps and for storing them in memory at runtime. A game map in general represents a single solar system. In the later game a map will be loaded when the player visits the specific system.

Therefore the static map format has to be converted into a faster in-memory format. The main differences between the permanent format and the in-memory is the fast accessibility of different aspects of the map data in the in-memory one. This format consists of several different formats each one optimized for one specific purpose. Whereas the permanent map format defines one compact data structure that holds all information in a big object tree.

![system\_animated](/uploads/2015/02/system_animated.gif)

click to watch animated

Another interesting aspect is the way a map and its content is created. Instead of manually defining each system with all its different objects and their attributes by hand we decided to let the program generate them itself. We use a method called “Procedural generation” to calculate each system from a single numerical value called “seed”. Procedural generation means the calculation of various information by the help of several deterministically functions. The content is not randomly generated but calculated. This calculations can be repeated and will lead to the same result each time.

This way of generating the content has two main advantages. On the one hand this reduces the memory space that is needed to save all the map data permanently. As each map is defined just by a single seed value this seed is the only information that has to be saved. With the help of the different calculation functions it is possible to get the real map information at any time. That way the actual space needed to save and transfer the map data is greatly reduced. The other main advantage is the time and effort that has to be spend to create an undefined number of game maps. If this would be done by hand each additional map would cost the same amount of time to be modeled. By letting the program calculate the information for each system it’s only necessary to define the rules by hand. If the calculation module is fully implemented no further development time is needed to generate an extreme high number of systems only limited by the amount of different seeds.

Especially in this early stage of development a well-functioning map concept and a muchness of already existing real data means a big ease for further development. As by now this represents the current state of development and could still be changed if necessary.

![seitenzahl bild](/uploads/2015/02/seitenzahl-bild.png)

*H. Grothkopf 2015*
