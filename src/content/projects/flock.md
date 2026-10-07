---
title: "Bird Flocking / Artificial Intelligence"
order: 39
year: 2015
legacyPaths:
  - "/flock/"
demo: "/demos/flock/"
---

### Flocking Example

Visually enhanced flocking example from Daniel Shiffman’s [Nature of Code](http://natureofcode.com/) example.

### Instructions

Left click to add bees

Right click to add flowers

Use scroll bars to change the parameters.

**Source code:** [gitlab](https://gitlab.iue.fh-kiel.de/ctag/processingjs-ctag)

Usually Bees don’t flock like birds but this can be used to understand the agent. This visualization is based on flocking example by Daniel Shiffman. Every bee in formation flock together with three main forces effecting them Separation, Cohesion and alignment.

Bee’s steering towards a interesting point(flower or flock) is calculated using

STEER = DESIRED – VELOCITY

After filling from flower, bees are not really effected for few seconds.

### parameters

flowerDistance : Distance to attract bee

onFlowerState : Different state of bee i.e steered to Flower, onFlower, just sat.

onFlowerDuration : will sit on flower for this duration (millisec)

nextOnFlowerDuration : will not be active (attracted, aligned etc) for this duration (millisec)
