#!/bin/bash

mysql -uroot -p123456 -e "USE eu2024; INSERT INTO users (id, username, password) VALUES (2, 'eu', '$GZCTF_FLAG');"