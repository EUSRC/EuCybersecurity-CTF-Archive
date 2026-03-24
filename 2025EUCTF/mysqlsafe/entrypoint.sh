#!/bin/bash
# 启动服务
service ssh start
service mysql start

# 等待数据库完全启动
sleep 5

# 导入初始数据
mysql -uctf -p123456 < /root/db.sql

# 后台运行 flag 检测脚本
nohup /root/flag.sh &

# 防止容器退出
tail -f /dev/null