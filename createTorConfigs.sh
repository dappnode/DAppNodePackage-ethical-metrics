#!/bin/sh

# Write the torrc files
for i in $(seq 1 100); do
  echo "SOCKSPort 127.0.0.1:$((9050 + i))" > "/etc/tor/torrc.$i"
  echo "DataDirectory /var/lib/tor$i" >> "/etc/tor/torrc.$i"
  echo "HiddenServiceDir /var/lib/tor/hidden_service$i/" >> "/etc/tor/torrc.$i"
  echo "HiddenServicePort 9090 ethical-metrics.ethical-metrics.dappnode:9090" >> "/etc/tor/torrc.$i"
done