---
title: "Online Multi-Player Puzzle Game"
summary: "A puzzle that everyone solves together on a big screen, each player joining from their smartphone's browser."
year: 2015
tags:
  - "Game"
  - "Web"
order: 35
legacyPaths:
  - "/online-multi-player-puzzle-game/"
---

/uploads/2015/09/puzzle_short.mp4


On the development of an online multi-player puzzle game [https://puzzle.iue.fh-kiel.de](https://puzzle.iue.fh-kiel.de "Puzzle Link").

Playing a multi-player game on a big screen with all players having their smartphone in hands is rarely seen today. Thus, the idea came up to create a game where all participants can puzzle one game together. There is no application is needed. Just a simple browser on a smartphone and quick join a game over QR-codes or short links. The browser is capable reading out the data of the smartphone’s gyroscope to move a tile inside a puzzle to find its target position.

After the creation of a prototype the first milestone was set and the features and ideas began to grow. The application in the first version was only a simple implementation of a client-server communication, where a single game was started and users could join. The disadvantages of this version was, that only one game with one picture could be played. Furthermore, after a game was finished the server needed a restart. These disadvantages led to the conclusion that there is a need to play more than one game with a higher diversity in tile patterns and pictures. Therefore, the concluding goal is to extend the existing work to a multi-user and multi-game application where custom images can be uploaded and a puzzle pattern can be chosen. Computing and creating a diversity of tile pattern to have different play styles also says that there is no way around for math and computational geometry. Consequently, a basis for this part of work is the reference to Berg et. al. \[1\] and their standard literature for computational geometry.

The first question which needs to be asked was ‘How can it be realized to puzzle a game without cutting it into pieces?’. The reason was if a file is cut into plenty of pieces it results in a lot more pictures but smaller ones. This would end with a lot overhead and file transfers between server and client, which was not necessarily wanted.
The next thing was the realization of running multiple games simultaneously. There was a current communication architecture, but the solution how the change has to be done to get a sufficient result was the actual problem. The outcome is a refactored socket communication to assign joining players to the intended game. Storing and handling the game sessions within the socket communication was the key to success.

The project provides now a solution which does not cut pictures into pieces. The solution benefits from the *SVG* web technique which initilizes an image and reuses it as pattern for the computed and randomized puzzle tiles. Imagine a game which has  **n** horizontal and **m** vertical tiles. So there are **n** *×* **m** sliced tiles which have to be stored where **x** games are running. So there will be **x *×* m *×* n** sliced images stored instead of **x** images like in the *SVG* solution.
Next to the classic jigsaw puzzle style a Voronoi and a hexagon playstyle has been implemented. These styles are a little more challenging and should demontrate what is possible.

The application is not yet perfect but it provides now a basis for enhancements. The modular design of the whole architecture makes the system flexible for more puzzle types or future ideas and requirements.

\[1\]  Mark de Berg et al. *Computational Geometry: Algorithms and Applications*. 3rd ed. Santa Clara, CA, USA: Springer-Verlag TELOS, 2008

*Created by Y. Ahlers, L. Karabin and C. Langmaack, 2015*
