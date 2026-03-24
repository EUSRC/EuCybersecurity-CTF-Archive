FROM ctftraining/base_image_nginx_mysql_php_73

WORKDIR /var/www/html

# 使用国内源加速
#RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    #apk update && \
    #apk add --no-cache curl && \
    #rm -rf /var/cache/apk/*

# 复制应用程序文件
COPY src/ /var/www/html/

# 复制flag.sh
COPY flag.sh /flag.sh
RUN chmod +x /flag.sh

# 设置文件权限
RUN chown -R www-data:www-data /var/www/html/ && \

    find /var/www/html/ -type d -exec chmod 755 {} + && \
    find /var/www/html/ -type f -exec chmod 644 {} +

EXPOSE 80

# 最佳解决方案：先执行flag.sh，然后启动supervisord（管理Nginx、PHP-FPM等）
#CMD ["sh", "-c", "/flag.sh && exec /usr/bin/supervisord -n -c /etc/supervisord.conf"]