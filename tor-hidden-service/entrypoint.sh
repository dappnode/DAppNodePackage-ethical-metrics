#!/bin/sh

INSTANCE_FILE="/var/lib/tor/hidden_service/hostname"

# Function to send HTTP DELETE request
send_target_delete_request() {
    INSTANCE=$(cat "$INSTANCE_FILE"):9090

    delete_body='[
  {
    "instance": "'$INSTANCE'"
  }
]'
    echo "Sending HTTP DELETE request for instance: $INSTANCE"
    echo "Request body: $delete_body"
    response=$(curl --socks5-hostname localhost:9050 -X DELETE -d "$delete_body" -s -H "Content-Type: application/json" -H "Content-Length: ${#delete_body}" -w "%{http_code}" "${REGISTER_URL}?inactiveDelay=true")  
    echo "HTTP DELETE request sent."
    echo "$response"

    # Extract the status code from the response
    status_code=${response: -3}

    # Check if status code from response starts with "2"
    if [[ $status_code =~ ^2 ]]; then
        echo "Deleted instance successfully."
    else
        echo "Monitor service did not return 2xx code. Something went wrong"
    fi
}

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
