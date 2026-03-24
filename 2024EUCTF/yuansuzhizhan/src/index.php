<?php
$flag = getenv('GZCTF_FLAG'); // 获取环境变量
$is_prod = isset($_GET['prod']) && $_GET['prod'] == 1;
?>
<title>元素物质</title>
<?php if($is_prod){ ?>
    <style><?php include('temp/_.css'); ?></style>
<?php } else { ?>
    <link href="css/main.css" rel="stylesheet">
<?php } ?>
<!--==============================================================================
游戏元素
===============================================================================-->
<div class="g x1">
    <!--==============================================================================
    游戏状态
    ============================================================================-->
    <div class="s s-play">
        <!--==============================================================================
        顶部UI行
        ============================================================================-->
        <div class="row top-row">
            <div class="game-title">元素之战 <span>EUCTF-2024</span></div>
            <a class="b b-play s5"><i>&rtrif;</i>开始游戏</a>
            <a class="b b-x1 s2">1倍速</a>
            <a class="b b-x2 s2">2倍速</a>
            <a class="b b-x3 s2">3倍速</a>
        </div>
        <!--==============================================================================
        底部UI行
        ============================================================================-->
        <div class="row bot-row">
            <div class="l s1"><i>&hearts;</i></div>
            <div class="d d-lives s2"> </div>
            <div class="l s1"><i>&there4;</i></div>
            <div class="d d-fragments s2"> </div>
            <div class="l s2">波次</div>
            <div class="d d-wave s2"> </div>
            <div class="l s2">下一波</div>
            <div class="d d-next s4">
                &times;<span class="w w-e"> </span>
                &times;<span class="w w-w"> </span>
                &times;<span class="w w-a"> </span>
                &times;<span class="w w-f"> </span>
            </div>
            <a class="b b-send s4"><i>&raquo;</i>提前下一波 +<span class="send"> </span> <i>&there4;</i></a>
        </div>
        <!--==============================================================================
        炮塔选择/建造菜单
        ============================================================================-->
        <div class="build-menu-wrap">
            <div class="build-menu">
                <div class="build-buttons">
                    <a class="build-button build-d"></a>
                    <a class="build-button build-e" data-type="e"></a>
                    <a class="build-button build-w" data-type="w"></a>
                    <a class="build-button build-a" data-type="a"></a>
                    <a class="build-button build-f" data-type="f"></a>
                </div>
                <div class="build-info">
                    <div class="build-title">
                        <span class="build-cost"> </span> <i>&there4;</i>
                        <span class="build-type"> </span>
                    </div>
                    <div class="build-stat build-dmg-wrap">
                        <strong>伤害：</strong> <span class="build-mtr"><span></span><span></span><span></span></span> <span class="build-dmg"> </span>
                    </div>
                    <div class="build-stat build-rng-wrap">
                        <strong>射程：</strong> <span class="build-mtr"><span></span><span></span><span></span></span> <span class="build-rng"> </span>
                    </div>
                    <div class="build-stat build-rte-wrap">
                        <strong>速率：</strong> <span class="build-mtr"><span></span><span></span><span></span></span> <span class="build-rte"> </span>
                    </div>
                </div>
            </div>
        </div>
        <!--==============================================================================
        炮塔升级/回收菜单
        ============================================================================-->
        <div class="tower-menu-wrap">
            <div class="tower-menu">
                <div class="tower-buttons">
                    <a class="tower-button highlight anim"></a>
                    <a class="tower-button upgrade" data-action="upgrade">
                        <div class="icon">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </a>
                    <a class="tower-button reclaim" data-action="reclaim">
                        <div class="icon">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </a>
                </div>
                <div class="tower-info">
                    <div class="tower-title">
                        <span class="tower-cost"> </span> <i>&there4;</i>
                        <span class="tower-label"> </span>
                    </div>
                    <div class="tower-stat tower-dmg-wrap">
                        <strong>伤害：</strong> <span class="tower-dmg"> </span> <i>&raquo;</i> <span class="tower-dmg-next"> </span>
                    </div>
                    <div class="tower-stat tower-rng-wrap">
                        <strong>射程：</strong> <span class="tower-rng"> </span> <i>&raquo;</i> <span class="tower-rng-next"> </span>
                    </div>
                    <div class="tower-stat tower-rte-wrap">
                        <strong>速率：</strong> <span class="tower-rte"> </span> <i>&raquo;</i> <span class="tower-rte-next"> </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php if($is_prod){ ?>
    <script><?php include('temp/_.js'); ?></script>
<?php } else { ?>
    <script>
        fetch('../get_flag.php')
            .then(response => response.text())
            .then(flag => {
                console.log(flag); // 获取 flag 并处理
            });
    </script>
    <script src="js/vendor/jsfxr.js"></script>
    <script src="js/g/g.js"></script>
    <script src="js/g/audio.js"></script>
    <script src="js/g/group.js"></script>
    <script src="js/g/pool.js"></script>
    <script src="js/g/util.js"></script>
    <script src="js/data/audio.js"></script>
    <script src="js/data/map.js"></script>
    <script src="js/data/towers.js"></script>
    <script src="js/data/waves.js"></script>
    <script src="js/entities/bullet.js"></script>
    <script src="js/entities/enemy.js"></script>
    <script src="js/entities/tile.js"></script>
    <script src="js/entities/tower.js"></script>
    <script src="js/entities/wave.js"></script>
    <script src="js/states/play.js"></script>
    <script src="js/game.js"></script>
<?php } ?>
