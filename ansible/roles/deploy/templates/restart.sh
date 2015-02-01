#!/bin/bash


kill -9 $(ps aux | grep '[j]ava' | grep shoutout | awk '{print $2}')
#nohup

echo "MAM Node Process Has Been Started"