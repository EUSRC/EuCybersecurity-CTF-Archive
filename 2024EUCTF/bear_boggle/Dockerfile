FROM php:7.3-apache

COPY www /var/www/html

COPY flag.sh /flag.sh
RUN chmod +x /flag.sh

# 复制 flag.txt 到容器的根目录
COPY flag.txt /flag.txt

RUN mkdir -p /var/www/html/uploads && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

EXPOSE 80

CMD /flag.sh && apache2-foreground
