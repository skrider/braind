#!/bin/bash

yarn build
time node $HOME/braind/out/out.js format -w /home/sk/braind/test.md
