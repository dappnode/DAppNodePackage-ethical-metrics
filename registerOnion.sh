#!/bin/sh

# wait a bit for tor to start
sleep 5

DEBUG="[DEBUG] [register-onion]"
INFO="[INFO] [register-onion]"
ERROR="[ERROR] [register-onion]"

socks_port=$1
echo "$DEBUG SOCKS_PORT: $socks_port"
index=$(($socks_port - 9050))

# This script registers a new onion address
while true
do
    if nc -zv localhost "$socks_port" 2>/dev/null; then
        echo "$INFO TOR hidden service is reachable"

        INSTANCE=$(cat /var/lib/tor/hidden_service"$index"/hostname)
        INSTANCE="$INSTANCE:9090"
        echo "$INFO Registering new onion instance: $INSTANCE"

        POST_BODY=$(jq -n -c --arg instance "$INSTANCE" --arg mail "$EMAIL" '$ARGS.named')
        echo "$DEBUG HTTP POST body: $POST_BODY"

        # Perform the HTTP POST request, printing the response body and retrieving the HTTP status code
        HTTP_RESPONSE_CODE=$(curl --socks5-hostname localhost:"$socks_port" -d "$POST_BODY" -H "Content-Type: application/json" -H "Content-Length: ${#POST_BODY}" -X POST "${REGISTER_URL}" -w "%{http_code}" -o /dev/null)

        if [ "$HTTP_RESPONSE_CODE" -eq 200 ]; then
            echo "$INFO Onion instance registered successfully"
            # 24 hours
            sleep 86400
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
