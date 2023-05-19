#!/bin/bash

tsswitch --remote 2222 --fast-switch \
-I fork "tsp --realtime -I file --infinite $(pwd)/../streams/stream1.ts -P regulate --bitrate 10000000" \
-I fork "tsp --realtime -I file --infinite $(pwd)/../streams/stream2.ts -P regulate --bitrate 10000000" \
-O fork "tsp --realtime -P regulate --bitrate 10653409 -P continuity --fix -O ip 224.0.0.1:4445"