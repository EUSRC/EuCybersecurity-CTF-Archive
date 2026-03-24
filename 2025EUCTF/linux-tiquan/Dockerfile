FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# 使用清华源
RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://mirrors.tuna.tsinghua.edu.cn/ubuntu/|g' /etc/apt/sources.list

# 安装必要软件
RUN apt-get update && \
    apt-get install -y openssh-server vim python3 && \
    rm -rf /var/lib/apt/lists/*

# 配置 SSH
RUN mkdir /var/run/sshd && \
    sed -i 's/#\?PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config

# 添加用户
RUN useradd -m -g users ctf && \
    echo 'ctf:123456' | chpasswd

# 设置 root 密码
RUN echo 'root:ikun666' | chpasswd

# 设置 suid 提权权限
RUN chmod 4755 /usr/bin/vim /usr/bin/python3

# 复制 flag 写入脚本
COPY flag.sh /root/flag.sh
RUN chmod +x /root/flag.sh

# 启动脚本（运行 flag.sh 后启动 sshd）
CMD /root/flag.sh && /usr/sbin/sshd -D

EXPOSE 22
