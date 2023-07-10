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

# Function to handle signals
handle_signal() {
  case $1 in
    INT)
      echo "Signal SIGINT caught by ethical-metrics handler."
      send_target_delete_request
      ;;
    TERM)
      echo "Signal SIGTERM caught by ethical-metrics handler."
      send_target_delete_request
      ;;
    HUP)
      echo "Signal SIGHUP caught by ethical-metrics handler."
      send_target_delete_request
      ;;
    QUIT)
      echo "Signal SIGQUIT caught by ethical-metrics handler."
      send_target_delete_request
      ;;
    KILL)
      echo "Signal SIGKILL caught by ethical-metrics handler."
      send_target_delete_request
      ;;
    *)
      echo "Unknown signal: $1"
      ;;
  esac
  # Propagate the signal to the child process
  kill -"$1" "$child_pid"
  exit 0
}

# Trap signals and call handle_signal function
trap 'handle_signal INT' SIGINT
trap 'handle_signal TERM' SIGTERM
trap 'handle_signal HUP' SIGHUP
trap 'handle_signal QUIT' SIGQUIT
trap 'handle_signal KILL' SIGKILL

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
