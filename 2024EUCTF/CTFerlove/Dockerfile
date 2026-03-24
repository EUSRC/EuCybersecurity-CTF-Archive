FROM php:7.3-apache

# 将当前目录下的www文件夹复制到容器的web根目录
COPY www /var/www/html

# 将flag.sh复制到容器的根目录
COPY flag.sh /flag.sh

# 将flag.sh脚本标记为可执行
RUN chmod +x /flag.sh

# 设置权限
RUN chmod -R 777 /var/www/html/*

# 暴露HTTP端口
EXPOSE 80

# 运行flag脚本然后启动Apache服务器
CMD /flag.sh && apache2-foreground
