#!/bin/sh

INSTANCE_FILE="/var/lib/tor/hidden_service/hostname"

# Start the tor service
su-exec tor tor &

# Wait for the file to exist
while [ ! -f "$INSTANCE_FILE" ]; do
  echo "Waiting for instance file to be generated..."
  sleep 1
done

# Read the instance from the file
INSTANCE=$(cat "$INSTANCE_FILE"):9090

# Show instance in package info
echo "Generated instance: ${INSTANCE}"
curl -X POST "http://my.dappnode/data-send?key=instance&data=${INSTANCE}"

# Run the register script
/usr/local/bin/registerOnion.sh &

# Store the tor process ID
child_pid=$!

# Wait for the tor process to finish
wait "$child_pid"
