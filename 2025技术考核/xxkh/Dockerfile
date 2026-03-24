FROM ctftraining/base_image_nginx_mysql_php_73

WORKDIR /var/www/html

# 使用国内源加速

# 复制应用程序文件
COPY www/ /var/www/html/
COPY /flag  /
# 复制flag.sh
COPY flag.sh /flag.sh
RUN chmod +x /flag.sh

# 设置文件权限
RUN chown -R www-data:www-data /var/www/html/ && \
    find /var/www/html/ -type d -exec chmod 755 {} + && \
    find /var/www/html/ -type f -exec chmod 644 {} +

EXPOSE 80
