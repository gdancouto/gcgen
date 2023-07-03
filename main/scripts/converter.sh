#!/bin/bash

i=1;

for f in $(pwd)/../streams/source/*
do
    ffmpeg -i $f -c:v libx264 \
        -b:v 10M -minrate 10M -maxrate 10M -bufsize 5M \
        -g 1 -s 1280x720 -r 30 -pix_fmt yuv420p -crf 1\
        -tune zerolatency -movflags faststart+frag_keyframe+empty_moov \
        -y tmp.ts \

    tsp --verbose --add-input-stuffing 1/10 \
        -I file tmp.ts \
        -P pmt --service 1 --add-pid 600/0x86 \
        -O file $(pwd)/../streams/stream$i.ts

    i=$((i+1))
    rm -f tmp.ts
done