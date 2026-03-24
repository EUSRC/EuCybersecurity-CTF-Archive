FROM ctftraining/base_image_nginx_mysql_php_73

WORKDIR /var/www/html

RUN mkdir -p /var/www/flagishere

RUN apk add --no-cache curl


# 拷贝题目文件
COPY index.php /var/www/html/index.php
COPY /flagishere/flag /var/www/flagishere/flag
COPY flag.sh /flag.sh





RUN chown -R 203:203 /var/www \
    && find /var/www -type d -exec chmod 755 {} + \
    && find /var/www -type f -exec chmod 644 {} + \
    && chmod +x /flag.sh # <-- 确保 flag.sh 可执行



EXPOSE 80 

# 【关键】此处无 ENTRYPOINT 指令，以继承基础镜像的自定义入口点

CMD ["nginx", "-g", "daemon off;"]
