#!/bin/sh

# wait a bit for tor to start
sleep 5

DEBUG="[DEBUG] [register-onion]"
INFO="[INFO] [register-onion]"
ERROR="[ERROR] [register-onion]"

INSTANCE_FILE="/var/lib/tor/hidden_service/hostname"

# This script registers a new onion address
while true
do
    if nc -zv localhost 9050 2>/dev/null; then
        echo "$INFO TOR hidden service is reachable"

        # Wait for the file to exist
        while [ ! -f "$INSTANCE_FILE" ]; do
        echo "Waiting for instance file to be generated..."
        sleep 1
        done
        
        INSTANCE=$(cat "$INSTANCE_FILE"):9090

        echo "$INFO Registering new onion instance: $INSTANCE"

        POST_BODY=$(jq -n -c --arg instance "$INSTANCE" --arg mail "$EMAIL" '$ARGS.named')
        echo "$DEBUG HTTP POST body: $POST_BODY"

        # Perform the HTTP POST request, printing the response body and retrieving the HTTP status code
        HTTP_RESPONSE_CODE=$(curl --socks5-hostname localhost:9050 -d "$POST_BODY" -H "Content-Type: application/json" -H "Content-Length: ${#POST_BODY}" -X POST "${REGISTER_URL}" -w "%{http_code}" -o /dev/null)

        if [ "$HTTP_RESPONSE_CODE" -eq 200 ]; then
            echo "$INFO Onion instance registered successfully, sleeping for a day"

            # Generate a random number between 0 and 7199 (inclusive)
            RANDOM_INTERVAL=$((RANDOM % 7200))
            # Add 82800 (23 hours in seconds) to the random interval
            TOTAL_INTERVAL=$((RANDOM_INTERVAL + 82800))

            # Sleep for the total interval duration (23 to 25 hours)
            sleep $TOTAL_INTERVAL

            # Print a message after the sleep
            echo "$INFO Script has resumed after $TOTAL_INTERVAL seconds."

        else
            echo "$ERROR Onion instance registration failed with HTTP code: $HTTP_RESPONSE_CODE, retrying in 1 minute"
            # 1 minute
            sleep 60
        fi
    else
        echo "$ERROR TOR hidden service is not reachable, retrying in 1 minute"
        # 1 minute
        sleep 60
    fi
done
