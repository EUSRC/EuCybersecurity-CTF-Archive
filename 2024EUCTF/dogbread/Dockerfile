FROM php:7.3-apache

COPY www /var/www/html

COPY flag.sh /flag.sh

RUN chmod +x /flag.sh

RUN chmod -R 755 /var/www/html && \
    chown -R root:root /var/www/html
    
EXPOSE 80
CMD /flag.sh && apache2-foreground
