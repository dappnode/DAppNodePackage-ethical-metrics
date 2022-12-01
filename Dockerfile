FROM prom/prometheus:latest

COPY prometheus.yaml /etc/prometheus/prometheus.yaml

ENTRYPOINT [ "prometheus" , "--config.file=/etc/prometheus/prometheus.yaml"]
