#!/bin/bash

GENOPTIONS="-fflags nobuffer -analyzeduration 0 -re"
#VIDSOURCE="-"
VIDSOURCE="udp://239.1.1.1:4445?overrun_nonfatal=1"
AUDIO_OPTS=""
VIDEO_OPTS="-vcodec copy"
OUTPUT_HLS="-hls_time 2 -hls_list_size 1 -start_number 1 -hls_flags delete_segments"
OUTPUT_PATH="$(pwd)/../graphics/public"
OUTPUT_FILE="$OUTPUT_PATH/browser.m3u8"

rm $OUTPUT_PATH/*.ts 
#rm $OUTPUT_FILE

#tsp --realtime \
#-I ip 239.1.1.1:4445 \
#-P splicemonitor --json-udp 127.0.0.1:4444 \
#-O fork "ffmpeg $GENOPTIONS -i $VIDSOURCE -y $AUDIO_OPTS $VIDEO_OPTS $OUTPUT_HLS $OUTPUT_FILE"

ffmpeg $GENOPTIONS -i $VIDSOURCE -y $AUDIO_OPTS $VIDEO_OPTS $OUTPUT_HLS $OUTPUT_FILE