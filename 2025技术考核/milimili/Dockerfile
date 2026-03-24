FROM ctftraining/base_image_nginx_mysql_php_73

WORKDIR /var/www/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

COPY milimili/ /var/www/html/

COPY flag.sh /flag.sh
RUN chmod +x /flag.sh

RUN chown -R www-data:www-data /var/www/html/ && \
    find /var/www/html/ -type d -exec chmod 755 {} + && \
    find /var/www/html/ -type f -exec chmod 644 {} + && \
    chmod -R 777 /var/www/html/uploads

RUN find /usr/local/etc -name www.conf -exec sed -i 's/;security.limit_extensions = .php .php3 .php4 .php5 .php7/security.limit_extensions = .php .php3 .php4 .php5 .php7 .phtml/g' {} + || true

EXPOSE 80