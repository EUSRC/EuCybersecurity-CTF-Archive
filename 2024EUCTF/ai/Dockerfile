# FROM python:3.10-slim

# RUN pip install --upgrade pip
# RUN pip install gradio torch torchvision transformers -i https://pypi.tuna.tsinghua.edu.cn/simple some-package
# # RUN mv /app/uwsgi.ini /app/uwsgi.ini.old
# COPY ./app /app
# COPY ./run.sh /run.sh
# RUN chmod +x /run.sh
# WORKDIR /app
# CMD ["/"]

FROM python:3.10-slim

# 设置国内镜像源，提升安装速度
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 安装 Python 依赖
RUN pip install gradio torch torchvision transformers some-package

# 复制应用程序和脚本
COPY ./app /app
COPY ./run.sh /run.sh

# 设置脚本为可执行
RUN chmod +x /run.sh

# 设置工作目录
WORKDIR /app

# 默认运行脚本
CMD ["/run.sh"]
