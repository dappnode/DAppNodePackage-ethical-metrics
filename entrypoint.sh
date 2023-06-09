#!/bin/sh

# Function to send HTTP POST request
send_http_request() {
    INSTANCE=$(cat /var/lib/tor/hidden_service/hostname)
    request_body='[
  {
    "instance": "'$INSTANCE'",
    "email": "'$EMAIL'"
  }
]'
  curl -X DELETE -H "Content-Type: application/json" -d "$request_body" "$REGISTER_URL"
  echo $EMAIL
  echo $request_body
}

# Function to handle signals
handle_signal() {
  case $1 in
    INT)
      echo "Received SIGINT signal. Sending HTTP request..."
      send_http_request
      echo "SIGINT signal handled."
      ;;
    TERM)
      echo "Received SIGTERM signal. Sending HTTP request..."
      send_http_request
      echo "SIGTERM signal handled."
      ;;
    *)
      echo "Unknown signal: $1"
      ;;
  esac
  # Propagate the signal to the child process
  kill -"$1" "$child_pid"
}

# Trap signals and call handle_signal function
trap 'handle_signal INT' SIGINT
trap 'handle_signal TERM' SIGTERM

# Run the register script
/usr/local/bin/registerOnion.sh &

# Start the tor service
su-exec tor tor &

# Store the tor process ID
child_pid=$!

# Wait for the tor process to finish
wait "$child_pid"
