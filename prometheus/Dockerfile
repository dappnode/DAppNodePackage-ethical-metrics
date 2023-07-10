FROM prom/prometheus:v2.45.0

COPY prometheus.yaml /etc/prometheus/prometheus.yaml

ENTRYPOINT [ "prometheus" , "--config.file=/etc/prometheus/prometheus.yaml"]
