#!/bin/bash

#echo Injetando e gravando

tsp --buffer-size-mb 5 --max-input-packets 7 --max-flushed-packets 7 --max-output-packets 7 --verbose \
    -I file $1 \
    -P regulate \
    -P spliceinject --service 1 --udp $3 \
    -P fork "tsp -O file $2" \
    -O ip $4

#mv $1 tmp.ts
#mv $2 $1
#mv tmp.ts $2

#-P fork "ffplay -loglevel warning -sync ext -fflags nobuffer -window_title 'Clean Feed' -" \