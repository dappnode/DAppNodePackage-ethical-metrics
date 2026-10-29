FROM alpine:3.23

# Tor < 0.4.9 is rejected by the network consensus (missing Desc=3 Microdesc=3)
RUN apk update && apk add --no-cache --update \
    "tor>=0.4.9" netcat-openbsd \
    && rm -rf /var/cache/apk/* 

COPY torrc /etc/tor/torrc

EXPOSE 9050

USER tor

ENTRYPOINT ["/usr/bin/tor"]
