#!/bin/sh

# iterate over the number of tor instances
for i in $(seq 1 $NUMBER_OF_TOR_INSTANCES); do
  echo "Starting tor instance $i"
  # Run the register script
  /usr/local/bin/registerOnion.sh $((9050 + i)) &

  # Start the tor service
  tor -f "/etc/tor/torrc.$i" &

  sleep 1
done

# Store the tor process ID
child_pid=$!

# Wait for the tor process to finish
wait "$child_pid"
