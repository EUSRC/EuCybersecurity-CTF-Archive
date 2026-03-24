#!/bin/bash
echo "[flag.sh] started" > /root/flag.log

MYSQL_USER="ctf"
MYSQL_PASS="123456"
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"

while true; do
  echo "[flag.sh] checking..." >> /root/flag.log

  id_311_exists=$(mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" -Nse \
    "SELECT EXISTS(SELECT 1 FROM alibaba.taobao WHERE id=311);")

  other_ids_count=$(mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" -Nse \
    "SELECT COUNT(*) FROM alibaba.taobao WHERE id BETWEEN 101 AND 423 AND id != 311;")

  if [ "$id_311_exists" -eq 0 ] && [ "$other_ids_count" -eq 322 ]; then
    mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" -Nse \
      "INSERT INTO alibaba.flag (id, value) VALUES (2, '$GZCTF_FLAG') ON DUPLICATE KEY UPDATE value=VALUES(value);"
  fi

  sleep 5
done
