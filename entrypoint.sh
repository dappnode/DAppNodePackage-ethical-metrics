#!/bin/sh

# Loop to start Tor instances
for i in $(seq 1 100); do
  tor -f "/etc/tor/torrc.$i" &
  sleep 1
  # Run the register script, CALL registerOnion.sh with en SOCKS_PORT env variable
  /usr/local/bin/registerOnion.sh $((9050 + i)) &
  sleep 1
done


# Store the process ID of the last Tor instance
child_pid=$!

# Wait for the Tor instances to finish
wait "$child_pid"

