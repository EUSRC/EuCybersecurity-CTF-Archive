# 注入 flag，其他题目只修改这里，上面不变
sed -i "s/flag{testflag}/$GZCTF_FLAG/" /var/www/html/config/db.php