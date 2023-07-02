#!/bin/bash

#echo Splice monitoring $1 $2, sending to $5

tsswitch --remote $3 --fast-switch --buffer-packets 14 --max-input-packets 7 --max-output-packets 7 --verbose \
-I ip $1 \
-I ip $2 \
-O fork "tsp --verbose --realtime \
        -P splicemonitor --json-udp $4 \
        -O ip $5"


#-I ip $1 --source 192.168.1.10 \
#-I ip $2 --source 192.168.1.20 \
#-P continuity --fix \
#tsswitch --remote $3 --fast-switch --buffer-packets 14 --max-input-packets 7 --max-output-packets 7 --verbose \
#-O fork "tsp --verbose --realtime --max-input-packets 7 --max-flushed-packets 7 --max-output-packets 7 -P continuity --fix -P splicemonitor --json-udp $4 -O play"
#-O fork "tsp --realtime --max-input-packets 7 --max-flushed-packets 7 --max-output-packets 7 -P regulate -P continuity --fix -P splicemonitor --verbose --json-udp $4 -O ip $5"

