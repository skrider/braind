#!/bin/bash

yarn build
time node $HOME/braind/out/out.js format /home/sk/brain3/current-year/cs189/hw/1.md
