---
title: "Ants Walking Path/ Artificial Intelligence"
order: 40
year: 2015
legacyPaths:
  - "/ants/"
demo: "/demos/ants/"
---

Visually enhanced from Daniel Shiffman’s [Nature of Code](http://natureofcode.com/) example.

### Instructions

Left and drag to draw the path which ants can follow. ( path is highlight in debug mode\[hit space\] )

Right click to add new ant with random max speed and force.

Hit A key to change the bug.

Hit space for debug mode.

**Source code:** [gitlab](https://gitlab.iue.fh-kiel.de/ctag/processingjs-ctag)

### parameters

some parameter explaination

AntFollowing.pde > SMOOTH\_DIST \[to skip the points that are recorded while draging, two adjacent point will have atleast SMOOTH\_DISTANCE between them in path\]

Vehicle.pde> PLOC\_FACTOR are the frame use to lookahead to accelerate towards that location on the path if ant is away from path.
