#!/bin/sh

# Function to send HTTP DELETE request
send_http_request() {
    INSTANCE=$(cat /var/lib/tor/hidden_service/hostname)
    request_body='[
  {
    "instance": "'$INSTANCE'",
    "email": "'$EMAIL'"
  }
]'
    echo "Sending HTTP DELETE request for instance: $INSTANCE"
    echo "Request body: $request_body"
    response=$(curl -X DELETE -H "Content-Type: application/json" -d "$request_body" -w "%{http_code}" "$REGISTER_URL")
    echo "HTTP DELETE request sent."

    if [[ $response =~ ^2 ]]; then
        echo "Deleted instance successfully."
    else
        echo "Monitor service did not return 2xx code. Something went wrong"
    fi
}

# Function to handle signals
handle_signal() {
  case $1 in
    INT)
      echo "Signal SIGINT catched by ethical-metrics handler."
      send_http_request
      ;;
    TERM)
      echo "Signal SIGTERM catched by ethical-metrics handler."
      send_http_request
      ;;
    HUP)
      echo "Signal SIGHUP catched by ethical-metrics handler."
      send_http_request
      ;;
    QUIT)
      echo "Signal SIGQUIT catched by ethical-metrics handler."
      send_http_request
      ;;
    KILL)
      echo "Signal SIGKILL catched by ethical-metrics handler."
      send_http_request
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

# Run the register script
/usr/local/bin/registerOnion.sh &

# Start the tor service
su-exec tor tor &

# Store the tor process ID
child_pid=$!

# Wait for the tor process to finish
wait "$child_pid"
