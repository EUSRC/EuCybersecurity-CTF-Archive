FROM php:7.4-apache


WORKDIR /var/www/html

# 拷贝题目文件
COPY index.php /var/www/html/index.php
COPY flag /flag
COPY flag.sh /flag.sh
COPY admin.php /var/www/html/admin.php

# 修复可能的 CRLF, 确保脚本可执行
RUN sed -i 's/\r$//' /flag.sh \
 && chmod +x /flag.sh \
 && chmod 644 /flag

# 直接在 Dockerfile 内执行启动脚本并启动 Apache
CMD ["/bin/bash", "-c", "/flag.sh; exec apache2-foreground"]

EXPOSE 80
