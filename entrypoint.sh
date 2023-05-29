#!/bin/sh

# Run the register script.
/usr/local/bin/registerOnion.sh &

# Start the tor service.
su-exec tor tor 

