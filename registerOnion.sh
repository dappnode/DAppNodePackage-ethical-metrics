#!/bin/sh

# This script registers a new onion address
echo "Registering new onion address..."
INSTANCE=$(onions | awk '{print $2}')
echo "Instance: $INSTANCE"
json=$(jq -n -c --arg instance "$INSTANCE" --arg mail "$EMAIL" '$ARGS.named')
echo "JSON: $json"
curl -d "$json" -X POST ${REGISTER_URL}
ls -lrth /var/lib/tor/hidden_service/service1