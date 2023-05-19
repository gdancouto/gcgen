#!/bin/bash

tsp --realtime \
-I ip 224.0.0.1:4445 \
-P splicemonitor --json-udp 127.0.0.1:4444 \
-O ip 192.168.1.67:4445