#!/bin/bash

#echo Injetando sem gravar

#ffplay -sync ext -fflags nobuffer udp://$4?overrun_nonfatal=1

tsp --buffer-size-mb 5 --max-input-packets 7 --max-flushed-packets 7 --max-output-packets 7 --verbose \
    -I file --infinite $1 \
    -P regulate \
    -P spliceinject --service 1 --udp $3 \
    -O ip $4



#-P fork "ffplay -loglevel warning -sync ext -fflags nobuffer -window_title 'Clean Feed' -" \
#-O ip $4