#!/bin/bash

echo Injetando sem gravar

tsp --buffer-size-mb 16 --max-input-packets 7 --max-flushed-packets 7 --max-output-packets 7 \
-I file --infinite $1 \
-P regulate \
-O ip $4

#-P spliceinject --service 1 --udp $3 \
#-P fork "ffplay -sync ext -fflags nobuffer -window_title 'Clean Feed' -" \
# Force a bitrate (TS bitrate)