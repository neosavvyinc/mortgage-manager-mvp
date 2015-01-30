#!/bin/bash


kill -9 $(ps aux | grep '[j]ava' | grep shoutout | awk '{print $2}')
#nohup

echo "Shoutout Process Has Been Started"