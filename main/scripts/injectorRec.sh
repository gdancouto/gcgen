#!/bin/bash

echo Injetando e gravando

tsp \
-I file $1 \
-P regulate \
-P spliceinject --service 1 --udp $3 \
-P fork "ffplay -sync ext -fflags nobuffer -" \
-P fork "tsp -O file $2" \
-O ip $4
