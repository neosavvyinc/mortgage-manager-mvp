#!/bin/bash
# Shell script for controlling the node server and mongo

## arguments
OPERATION=$1
MODULE=$2

## functionality
correct_usage()
{
	echo "$0 [stop|start|restart] [app.js]"
	exit 1
}

start_module() {
	PID=`ps ax | grep "node ${MODULE}" | grep -v grep | awk '{print $1}'`
	if `test -z ${PID}`
	then
		node "${MODULE}"
	else
		echo "${MODULE} is already running: pid=${PID}"
	fi
}

stop_module() {
	for _INDEX in 0 1 2
	do
		PID=`ps ax | grep "node ${MODULE}" | grep -v grep | awk '{print $1}'`
		if `test -z ${PID}`
		then
			break
		elif `test ${_INDEX} -lt 1`
		then
			kill -15 ${PID}
			echo "Attempting to passively kill ${MODULE}: pid=${PID}"
			sleep 2
		elif `test ${_INDEX} -lt 2`
		then
			kill -9 ${PID}
			echo "Attempting to aggressively kill ${MODULE}: pid=${PID}"
			sleep 2
		else
			echo "failed to kill ${MODULE}: ${PID}"
			exit 1
		fi
	done
}

start_mongo() {
	PID=`ps ax | grep "mongod" | grep -v grep | awk '{print $1}'`
	if [[ -z ${PID} ]]
	then
		echo "starting mongod"
		mongod --quiet
		sleep 1
	else
		echo "mongod is already running: ${PID}"
	fi
}

display_info() {
	PID=`ps ax | grep "node server.js" | grep -v grep | awk '{print $1}'`
	if `test -z ${PID}`
	then
		echo "server not running"
	else
		echo "server running: PID=${PID}"
	fi

	PID=`ps ax | grep "mongod" | grep -v grep | awk '{print $1}'`
	if `test -z ${PID}`
	then
		echo "mongod not running"
	else
		echo "mongod running: PID=${PID}"
	fi
}

#action
if `test ${OPERATION} = "info"`
then
	display_info
elif `test $# -ne 2`
then
	correct_usage
elif `test ${OPERATION} = "stop"`
then
	stop_module
elif `test ${OPERATION} = "start"`
then
	if `test ${MODULE} = "mongod"`
	then
		start_mongo
	else
		start_module
	fi
elif `test ${OPERATION} = "restart"`
then
	stop_module
	start_module
else

	correct_usage
fi