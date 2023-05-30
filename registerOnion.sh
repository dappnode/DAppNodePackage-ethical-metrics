#!/bin/sh

# wait a bit for tor to start
sleep 5

# This script registers a new onion address
while true
do
    echo "Checking if 127.0.0.1:9050 is reachable..."
    if nc -zv 127.0.0.1 9050 2>/dev/null; then
        echo "Registering new onion address..."
        INSTANCE=$(cat /var/lib/tor/hidden_service/hostname)
        # Add port 9090 to the onion address
        INSTANCE="$INSTANCE:9090"
        echo "Instance: $INSTANCE"
        json=$(jq -n -c --arg instance "$INSTANCE" --arg mail "$EMAIL" '$ARGS.named')
        echo "JSON: $json"
        curl --socks5-hostname 127.0.0.1:9050 -d "$json" -X POST ${REGISTER_URL}
        ls -lrth /var/lib/tor/hidden_service/
        # Sleep for 24 hours
        sleep 86400
    else
        echo "127.0.0.1:9050 is not reachable, retrying in 1 minute"
        # Sleep for 1 minute
        sleep 60
    fi
done
