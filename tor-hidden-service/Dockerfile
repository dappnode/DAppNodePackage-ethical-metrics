FROM alpine:edge

RUN apk update && apk add --no-cache --update \
    tor netcat-openbsd \
    && rm -rf /var/cache/apk/* 

COPY torrc /etc/tor/torrc

EXPOSE 9050

ENTRYPOINT ["/usr/bin/tor"]
