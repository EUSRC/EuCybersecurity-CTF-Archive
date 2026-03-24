FROM python:3.10-slim

# 设置国内镜像源，提升安装速度
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip config set global.trusted-host pypi.tuna.tsinghua.edu.cn  # 信任清华源，避免证书报错

# 安装 Python 依赖（加断点续传+超时+不缓存，解决下载中断/慢）
RUN pip install --no-cache-dir \
    --resume-retries 10 \
    --timeout 300 \
    gradio torch torchvision transformers some-package flask

# 复制应用程序和脚本
COPY ./app /app
COPY ./run.sh /run.sh

# 设置脚本为可执行
RUN chmod +x /run.sh

# 设置工作目录
WORKDIR /app

# 默认运行脚本
CMD ["/run.sh"]