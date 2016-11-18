#! /bin/bash

# http://superuser.com/questions/226192/openssl-without-prompt
openssl req \
  -new \
  -newkey rsa:4096 \
  -days 9999 \
  -nodes \
  -x509 \
  -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=local.dev" \
  -keyout ./self-signed.dev.key \
  -out ./self-signed.dev.cert
