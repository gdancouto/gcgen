#!/bin/bash

echo Exibindo feed $1

ffplay -sync ext -fflags nobuffer udp://$1?overrun_nonfatal=1

#aditional flags nad commands for window layout