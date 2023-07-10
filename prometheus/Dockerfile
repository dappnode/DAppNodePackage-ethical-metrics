ARG UPSTREAM_VERSION

FROM prom/prometheus:${UPSTREAM_VERSION}

COPY prometheus.yaml /etc/prometheus/prometheus.yaml

ENTRYPOINT [ "prometheus" , "--config.file=/etc/prometheus/prometheus.yaml"]
