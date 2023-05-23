#!/bin/bash

tsswitch --remote 2222 --fast-switch \
-I fork "tsp --realtime --max-input-packets 100 --max-flushed-packets 100-I file --infinite $(pwd)/../streams/stream1.ts -P regulate" \
-I fork "tsp --realtime --max-input-packets 100 --max-flushed-packets 100 -I file --infinite $(pwd)/../streams/stream2.ts -P regulate" \
-O fork "tsp --realtime --max-input-packets 100 --max-flushed-packets 100 -P regulate -P continuity --fix -O ip 239.1.1.1:4445"