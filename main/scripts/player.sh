#!/bin/bash

ffplay -probesize 32 -sync ext -fflags nobuffer udp://192.168.1.20:4445?overrun_nonfatal=1