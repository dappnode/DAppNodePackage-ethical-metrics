FROM alpine:edge

RUN apk update && apk add --no-cache --update \
    tor jq curl su-exec netcat-openbsd \
    && rm -rf /var/cache/apk/* 

COPY registerOnion.sh /usr/local/bin/registerOnion.sh
COPY torrc /etc/tor/torrc
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /usr/local/bin/registerOnion.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9050

CMD ["/entrypoint.sh"]
