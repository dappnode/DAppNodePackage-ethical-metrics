#!/bin/sh

# print env NUMBER_OF_TOR_INSTANCES
echo "NUMBER_OF_TOR_INSTANCES: $NUMBER_OF_TOR_INSTANCES"

# Write the torrc files
for i in $(seq 1 $NUMBER_OF_TOR_INSTANCES); do
  echo "SOCKSPort 127.0.0.1:$((9050 + i))" > "/etc/tor/torrc.$i"
  echo "DataDirectory /var/lib/tor$i" >> "/etc/tor/torrc.$i"
  echo "HiddenServiceDir /var/lib/tor/hidden_service$i/" >> "/etc/tor/torrc.$i"
  echo "HiddenServicePort 9090 ethical-metrics.ethical-metrics.dappnode:9090" >> "/etc/tor/torrc.$i"
done