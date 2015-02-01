#!/bin/bash


kill -9 $(ps aux | grep '[n]ode' | grep server | awk '{print $2}')
#nohup

echo "MAM Node Process Has Been Started"