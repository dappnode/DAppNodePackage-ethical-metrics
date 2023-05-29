#!/bin/sh

# Start the cron daemon.
crond

# Start the tor service.
exec su-exec tor tor
