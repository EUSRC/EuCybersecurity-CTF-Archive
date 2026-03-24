-- 次哩次哩 (CiliCili) CTF 数据库初始化脚本
CREATE DATABASE IF NOT EXISTS ctf_db DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ctf_db;

-- ==========================================
-- 1. 清理旧表
-- ==========================================
DROP TABLE IF EXISTS videos; -- 以前可能是 books
DROP TABLE IF EXISTS flags;
DROP TABLE IF EXISTS users;

-- ==========================================
-- 2. 用户表 (Users)
-- 注意：这里增加了 role 字段，用于 dashboard.php 判断管理员权限
-- ==========================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(100) NULL, -- 留着备用
  password VARCHAR(128) NOT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入用户数据 (适配登录页的弱口令爆破考点)
-- Admin: 密码是 2025
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@cilicili.cn', '2025', 'admin'),
('bilibili_test', 'test@cilicili.cn', 'test123456', 'user'),
('misaka_mikoto', 'railgun@academy.city', 'railgun_520', 'user'),
('kirito', 'beater@sao.net', 'starburst_stream', 'user'),
('hacker_404', 'shadow@darkweb.tor', '123456', 'user');

-- ==========================================
-- 3. Flag 表 (Flags)
-- 注意：这里只建表！数据由 config/db.php 动态插入
-- ==========================================
CREATE TABLE flags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  flag VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- (此处故意留空，不执行 INSERT)

-- ==========================================
-- 4. 视频资源表 (Videos)
-- 原 books 表，用于 search.php 的 SQL 注入
-- ==========================================
CREATE TABLE videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,   -- 视频标题
  uploader VARCHAR(255) NOT NULL -- UP主
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 填充“黑客 + 二次元”风格的脏数据
INSERT INTO videos (title, uploader) VALUES
('【4K】Cyberpunk Edgerunners: Lucy Hacking Tutorial', 'Arasaka_Security'),
('【教程】如何用 Python 编写自动攻击脚本', '极客张三'),
('Steins;Gate: 渗透 SERN 数据库的全过程实录', 'Barrel_Titor'),
('【内部会议】2025年Q4网络安全攻防演练复盘', '运维总监_老王'),
('某科学的超电磁炮：通过电磁波进行侧信道攻击', 'Misaka_10032'),
('【剧场版】刀剑神域：茅场晶彦的源代码解析', 'Argus_Dev'),
('Kali Linux 2025.1 安装与配置指南 (无后门版)', 'OffSec_Official'),
('【高燃】黑客帝国：代码雨动态壁纸 4K 60帧', 'Wallpaper_Engine'),
('Lycoris Recoil: 战术换弹与无线电劫持教学', 'Chisato'),
('【搬运】Defcon 31: Hacking Satellites', 'CTF_Archive'),
('JOJO：天堂制造的时间加速与DDOS攻击原理', 'Pucci_Father'),
('【绝密】B站后端架构源码分析 (已删除)', 'Unknown_User'),
('PHP是世界上最好的语言.mp4', 'Elephpant'),
('孤独摇滚：吉他英雄的WiFi破解小课堂', 'Guitar_Hero'),
('Docker 逃逸原理与实战演示', 'Whale_Hunter'),
('【生肉】Mr.Robot Season 5 Leaked Footage', 'FSociety'),
('EVA：MAGI超级计算机系统的防火墙漏洞', 'Ritsuko'),
('原神：启动！(通过修改内存实现无敌)', 'Traveler_Lumine'),
('SQL Map 使用教程：从入门到删库', 'Sql_Boy'),
('【存档】2024年某次大型CTF Web题解', 'Writeup_Bot');

-- ==========================================
-- 5. 数据库用户权限设置
-- ==========================================
DROP USER IF EXISTS 'ctf_user'@'localhost';

CREATE USER 'ctf_user'@'localhost' IDENTIFIED BY 'ctf_pass123';
GRANT ALL PRIVILEGES ON ctf_db.* TO 'ctf_user'@'localhost';
FLUSH PRIVILEGES;