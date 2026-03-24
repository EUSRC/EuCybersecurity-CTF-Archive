FROM php:7.3-apache

# 复制文件到容器中
COPY ./php/ /var/www/html
COPY flag.txt /flag.txt
COPY flag.sh /flag.sh

# 修改权限
RUN chmod -R 777 /var/www/html/ \
    && chmod +x /flag.sh

# 设置容器启动命令
CMD /flag.sh && apache2-foreground
