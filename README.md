# EUSRC-EuCybersecurity-CTF-Archive

**溯源初心，传承技术。这里是 EUSRC 工作室 Web 组的成长足迹。**

## 📖 关于本项目
本项目是 **EuCybersecurity (EUSRC) 工作室** 历年 Web 赛题的开源归档仓库。

我们决定将这些题目公开，初衷有二：
1. **留存记忆**：记录工作室成员从“脚本小子”到“出题人”的进化过程。这里既有我们引以为傲的精巧设计，也有早期略显稚嫩的探索。
2. **扶持新人**：我们深知初创校队、安全社团在起步时“无题可练、环境难搭”的困境。因此，我们将环境全部 **Docker 化** 并适配了主流的 **GZCTF** 平台，力求让每一支新生的团队都能“一键起靶场”。

## 🛠️ 技术规格
- **平台适配**：完美适配 [GZCTF](https://github.com/GZCTFE/GZCTF) 及其他兼容 Docker 的 CTF 平台。
- **动态 Flag**：赛题基本都包含flag.sh,在docker内也做了引用。
- **一键部署**：
  
  ```bash
  docker build -t eusrc/[题目名]:latest .

如果需要相关赛题WP可以关注公众号:`EuSRC安全实验室`本仓库开源题目基本都用于EUCTF内部训练赛,在公众号内均已发布WP。

![qrcode_for_gh_c58c8b941e28_258](./images/README/qrcode_for_gh_c58c8b941e28_258.jpg)

## ⚖️ 开源协议与约束

本项目采用 **[CC BY-NC 4.0 (署名-非商业性使用)](http://creativecommons.org/licenses/by-nc/4.0/)** 许可协议。

## 🤝 鸣谢

感谢所有曾为 EUSRC 贡献代码的成员。虽然有些题目现在看来可能很繁琐，但它们曾是我们对安全热爱的证明。

------

*如果有任何环境无法启动的问题，欢迎通过 Issue 反馈，我们会尽力协助修复。*
