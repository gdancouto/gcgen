#!/bin/bash

tsswitch --remote 2222 --fast-switch \
-I fork "tsp --realtime -I file --infinite $(pwd)/../streams/stream1.ts -P regulate" \
-I fork "tsp --realtime -I file --infinite $(pwd)/../streams/stream2.ts -P regulate" \
-O fork "tsp --realtime -P regulate -P continuity --fix -O ip 239.1.1.1:4445"