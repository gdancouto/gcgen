#!/bin/bash

ffplay -probesize 32 -fflags nobuffer udp://192.168.1.67:4445?overrun_nonfatal=1