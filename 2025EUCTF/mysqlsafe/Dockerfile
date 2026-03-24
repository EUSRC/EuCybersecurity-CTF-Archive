# 使用Ubuntu 20.04作为基础镜像
FROM ubuntu:20.04

# 设置环境变量，确保apt不会提示交互
ENV DEBIAN_FRONTEND noninteractive

# 更新apt源为清华大学镜像源
RUN sed -i 's/http:\/\/archive.ubuntu.com\/ubuntu\//http:\/\/mirrors.tuna.tsinghua.edu.cn\/ubuntu\//g' /etc/apt/sources.list

# 更新软件包列表并安装软件
RUN apt-get update && \
    apt-get install -y openssh-server vim mysql-server apache2 && \
    rm -rf /var/lib/apt/lists/*

# 配置 SSH
RUN sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config

# 添加新用户ctf并设置密码为123456
RUN useradd -g www-data ctf -m && \
    echo "ctf:123456" | chpasswd

# 重置root密码为ikun666
RUN echo "root:ikun666" | chpasswd

# 更改/var/www/html目录及其内容的所有权为www-data用户和组，并设置权限
RUN chown -R ctf:www-data /var/www/html && \
    chmod 755 /var/www/html/*

# 设置MySQL用户权限
RUN service mysql start && \
    mysql -uroot -proot -e "CREATE USER 'ctf'@'%' IDENTIFIED BY '123456';" && \
    mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON *.* TO 'ctf'@'%' WITH GRANT OPTION;" && \
    mysql -uroot -proot -e "FLUSH PRIVILEGES;"

RUN sed -i 's/^bind-address/#bind-address/' /etc/mysql/my.cnf

# 拷贝脚本
COPY flag.sh /root/flag.sh
COPY db.sql /root/db.sql
COPY entrypoint.sh /root/entrypoint.sh
COPY my.cnf /etc/mysql/conf.d/charset.cnf
RUN chmod +x /root/flag.sh /root/entrypoint.sh

# 暴露端口，SSH默认22，MySQL默认3306，Apache默认80
EXPOSE 22

# 没有下面这行mysql报错，很诡异
RUN mkdir /nonexistent

# 启动脚本
CMD ["/root/entrypoint.sh"]