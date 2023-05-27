#!/bin/bash

#tsswitch --remote 2222 --fast-switch \
#-I fork "tsp --realtime -I file --infinite $(pwd)/../streams/stream1.ts -P regulate" \
#-I fork "tsp --realtime -I file --infinite $(pwd)/../streams/stream2.ts -P regulate" \
#-O fork "tsp --realtime --max-input-packets 100 --max-flushed-packets 100 -P regulate -P continuity --fix -O ip 239.1.1.1:4445"


GENOPTIONS="-re"
VIDSOURCE="$(pwd)/../streams/stream1.ts"
AUDIO_OPTS=""
VIDEO_OPTS="-vcodec copy"
OUTPUT_HLS=""
OUTPUT_PATH="$(pwd)/../graphics/public"
OUTPUT_FILE="-f mpegts udp://239.1.1.1:4445"

ffmpeg $GENOPTIONS -i $VIDSOURCE -y $AUDIO_OPTS $VIDEO_OPTS $OUTPUT_HLS $OUTPUT_FILE