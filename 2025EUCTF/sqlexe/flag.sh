#!/bin/bash

# 创建数据库并插入数据
mysql -uroot -proot -e "USE euctf; CREATE TABLE flag (name VARCHAR(255), phone VARCHAR(255)); INSERT INTO flag (name, phone) VALUES ('$GZCTF_FLAG', '110');"