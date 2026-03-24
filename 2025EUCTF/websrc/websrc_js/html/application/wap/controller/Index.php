<?php
/**
 * Index.php
 * Niushop商城系统 - 团队十年电商经验汇集巨献!
 * =========================================================
 * Copy right 2015-2025 山西牛酷信息科技有限公司, 保留所有权利。
 * ----------------------------------------------
 * 官方网址: http://www.niushop.com.cn
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和使用。
 * 任何企业和个人不允许对程序代码以任何形式任何目的再发布。
 * =========================================================
 * @author : niuteam
 * @date : 2015.1.17
 * @version : v1.0.0.0
 */
namespace app\wap\controller;

use data\service\Config;
use data\service\Goods;
use data\service\GoodsBrand as GoodsBrand;
use data\service\GoodsCategory;
use data\service\Member;
use data\service\Member as MemberService;
use data\service\Platform;
use data\service\promotion\PromoteRewardRule;
use data\service\WebSite;

class Index extends BaseController
{

    /**
     * 平台端首页
     *
     * @return Ambigous <\think\response\View, \think\response\$this, \think\response\View>
     */
    public function index()
    {
        // 分享
        $ticket = $this->getShareTicket();
        $this->assign("signPackage", $ticket);
        $platform = new Platform();
        // 轮播图
        $plat_adv_list = $platform->getPlatformAdvPositionDetail(1105);
        $this->assign('plat_adv_list', $plat_adv_list);
        
        // 首页公告下方广告位
        $index_adv_one = $platform->getPlatformAdvPositionDetail(1188);
        $this->assign('index_adv_one', $index_adv_one);
        // 首页品牌推荐下方广告位
        $index_adv_two = $platform->getPlatformAdvPositionDetail(1189);
        $this->assign('index_adv_two', $index_adv_two);
        // 促销模块
        // $cx_condition = [
        // 'class_type' => 2,
        // 'is_use' => 1,
        // 'show_type' => 1
        // ];
        // $class_list = $platform->getPlatformGoodsRecommendClass($cx_condition);
        // $this->assign("class_list", $class_list);


        // 首页楼层版块
        $good_category = new GoodsCategory();
        $shop_id = $this->instance_id;
        $block_list = $good_category->getGoodsCategoryBlockList($shop_id);
        // var_dump($block_list[0]['child_category'][0]['goods_list']['data']);
        $this->assign('block_list', $block_list);
        $goods_platform = new Platform();
        $shop_id = $this->instance_id;
        $goods_platform_list = $goods_platform->getRecommendGoodsList($shop_id);
        $this->assign('goods_platform_list', $goods_platform_list);
        // var_dump($goods_platform_list[0]['goods_list']);
        // 品牌
        $goods_brand = new GoodsBrand();
        $list = $goods_brand->getGoodsBrandList(1, 6, '', 'sort');
        $this->assign('list', $list['data']);
        
        // 限时折扣
        $goods = new Goods();
        $condition['status'] = 1;
        $condition['ng.state'] = 1;
        $discount_list = $goods->getDiscountGoodsList(1, 0, $condition, 'end_time');
        foreach ($discount_list['data'] as $k => $v) {
            $v['discount'] = str_replace('.00', '', $v['discount']);
            // $v['promotion_price'] = str_replace('.00', '', $v['promotion_price']);
            // $v['price'] = str_replace('.00', '', $v['price']);
        }
        $this->assign('discount_list', $discount_list['data']);
        // 获取当前时间
        $current_time = $this->getCurrentTime();
        $this->assign('ms_time', $current_time);
        // 首页商城热卖
        $hot_selling_adv = $platform->getPlatformAdvPositionDetail(1164);
        $this->assign('hot_selling_adv', $hot_selling_adv);
        
        // 公众号配置查询
        $config = new Config();
        $wchat_config = $config->getInstanceWchatConfig($this->instance_id);
        
        $is_subscribe = 0; // 标识：是否显示顶部关注 0：[隐藏]，1：[显示]
                           // 检查是否配置过微信公众号
        if (! empty($wchat_config['value'])) {
            if (! empty($wchat_config['value']['appid']) && ! empty($wchat_config['value']['appsecret'])) {
                // 如何判断是否关注
                if (isWeixin()) {
                    if (! empty($this->uid)) {
                        // 检查当前用户是否关注
                        $user_sub = $this->user->checkUserIsSubscribeInstance($this->uid, $this->instance_id);
                        if ($user_sub == 0) {
                            // 未关注
                            $is_subscribe = 1;
                        }
                    }
                }
            }
        }
        $this->assign("is_subscribe", $is_subscribe);
        // 公众号二维码获取
        $this->web_site = new WebSite();
        $web_info = $this->web_site->getWebSiteInfo();
        $this->assign('web_info', $web_info);
        
        $member = new MemberService();
        $source_user_name = "";
        $source_img_url = "";
        if (! empty($_GET['source_uid'])) {
            $_SESSION['source_uid'] = $_GET['source_uid'];
            $user_info = $member->getUserInfoByUid($_SESSION['source_uid']);
            if (! empty($user_info)) {
                $source_user_name = $user_info["nick_name"];
                if (! empty($user_info["user_headimg"])) {
                    $source_img_url = $user_info["user_headimg"];
                }
            }
        }
        
        $notice_arr = $config->getNotice(0);
        $this->assign('notice', $notice_arr);
        $this->assign('source_user_name', $source_user_name);
        $this->assign('source_img_url', $source_img_url);
        
        $member = new Member();
        $coupon_list = $member->getMemberCouponTypeList($this->instance_id, $this->uid);
        $this->assign('coupon_list', $coupon_list);
        // 判断是否开启了自定义模块
        // 判断是否显示商品分类
        
        return view($this->style . 'Index/index');
        if (hook_is_exist("customtemplate")) {
            // 获取自定义模板信息
            return view($this->style . 'Index/customTemplateIndex');
        } else {}
    }

    /**
     * 得到当前时间戳的毫秒数
     *
     * @return number
     */
    public function getCurrentTime()
    {
        $time = time();
        $time = $time * 1000;
        return $time;
    }

    /**
     * 自定义模板界面
     * 创建时间：2017年8月14日 16:54:36
     *
     * @return \think\response\View
     */
    public function customTemplateControl()
    {
        $id = request()->get("id", "");
        $config = new Config();
        $custom_template_info = [];
        $this->assign("custom_template", $custom_template_info);
        return view($this->style . 'Index/customTemplateControl');
    }

    /**
     * 限时折扣
     */
    public function discount()
    {
        $platform = new Platform();
        // 限时折扣广告位
        $discounts_adv = $platform->getPlatformAdvPositionDetail(1163);
        $this->assign('discounts_adv', $discounts_adv);
        if (request()->isAjax()) {
            $goods = new Goods();
            $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : '0';
            $condition['ng.state'] = 1;
            $condition['status'] = 1;
            if (! empty($category_id)) {
                $condition['category_id_1'] = $category_id;
            }
            $discount_list = $goods->getDiscountGoodsList(1, 0, $condition);
            foreach ($discount_list['data'] as $k => $v) {
                $v['discount'] = str_replace('.00', '', $v['discount']);
                $v['promotion_price'] = str_replace('.00', '', $v['promotion_price']);
                $v['price'] = str_replace('.00', '', $v['price']);
            }
            return $discount_list['data'];
        } else {
            $goods_category = new GoodsCategory();
            $goods_category_list_1 = $goods_category->getGoodsCategoryList(1, 0, [
                "is_visible" => 1,
                "level" => 1
            ]);
            
            $this->assign('goods_category_list_1', $goods_category_list_1['data']);
            
            return view($this->style . 'Index/discount');
        }
    }
    
    // 分享送积分
    public function shareGivePoint()
    {
        if (request()->isAjax()) {
            $rewardRule = new PromoteRewardRule();
            $url = request()->post('share_url', '');
            $url_arr = parse_url($url);
            if (stristr($url_arr['path'], 'goods/goodsdetail')) {
                
                $url_query_arr = explode('&', $url_arr['query']);
                $params = array();
                foreach ($url_query_arr as $param) {
                    $item = explode('=', $param);
                    $params[$item[0]] = $item[1];
                }
                if (! empty($params['id'])) {
                    hook('pointShareGoods', [
                        'goods_id' => $params['id']
                    ]);
                }
            }
            $res = $rewardRule->memberShareSendPoint($this->instance_id, $this->uid);
            return AjaxReturn($res);
        }
    }

    /**
     * 设置页面打开cookie
     */
    public function setClientCookie()
    {
        $client = request()->post('client', '');
        setcookie('default_client', $client);
        // $cookie = request()->cookie('default_client', '');
        // return $cookie;
        return AjaxReturn(1);
    }

    /**
     * 首页领用优惠券
     */
    public function getCoupon()
    {
        $coupon_type_id = request()->post('coupon_type_id', 0);
        if (! empty($this->uid)) {
            $member = new Member();
            $retval = $member->memberGetCoupon($this->uid, $coupon_type_id, 2);
            return AjaxReturn($retval);
        } else {
            return AjaxReturn(NO_LOGIN);
        }
    }
}
