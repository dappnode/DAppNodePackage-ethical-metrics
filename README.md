# ETHICAL METRICS

This repository contains the Ethical Metrics package, which is responsible for registering the user in the monitor-proxy and exposing some of it's dappnode metrics to a monitor-service instance. It achieves this through the setup of two dappnode services: *tor-hidden-service* and *ethical-metrics*.

## tor-hidden-service
The tor-hidden-service attempts to register the user by periodically sending an HTTP POST request (endpoint */targets*) to the monitor proxy. If the request is successful and returns a status code of 200, it waits 1 day before making the request again. In case of failure, it waits for 1 minute before retrying.

Additionally, when this service restarts or shuts down (in response to signals INT, TERM, HUP, KILL, or QUIT), it sends an HTTP DELETE request (endpoint: */targets*) to the monitor proxy and propagates the signal to the tor process.

## ethical-metrics
The ethical-metrics service starts a Prometheus federated server. This Prometheus server scrapes a set of filtered metrics from the DMS Prometheus server located at *prometheus.dms.dappnode:9090*. The metrics collected by this server are then ready to be scraped by a monitor-service instance.