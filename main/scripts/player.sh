#!/bin/bash

#echo Exibindo feed $1

ffplay -loglevel warning -sync ext -fflags nobuffer -window_title 'Clean Feed' udp://$1?overrun_nonfatal=1
