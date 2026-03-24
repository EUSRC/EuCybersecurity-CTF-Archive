FROM ctftraining/base_image_nginx_mysql_php_56

COPY src /var/www/html

COPY flag.sh /flag.sh

# RUN rm -rf /var/www/html/index.php

RUN chmod +x /flag.sh