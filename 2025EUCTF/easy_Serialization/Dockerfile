FROM php:7.3-apache

# 复制文件到容器
COPY ./php/ /var/www/html
COPY flag.txt /flag.txt
COPY flag.sh /flag.sh

# 设置文件权限
RUN chmod -R 777 /var/www/html/ && chmod +x /flag.sh

CMD /flag.sh && apache2-foreground
