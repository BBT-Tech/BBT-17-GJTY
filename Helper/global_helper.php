<?php
/**
 * User: imyxz
 * Date: 2017-10-24
 * Time: 19:45
 * Github: https://github.com/imyxz/
 */
class global_helper extends SlimvcHelper
{
    function getOpenID()
    {
        if(!isset($_SESSION['openid']) || empty($_SESSION['openid']))
        {
            $target="https://100steps.withcic.cn/2017_gjty/index.html";
            $this->jumpTo("https://100steps.withcic.cn/wechat_bbt/Home/Vote/index?state=" . urlencode($target));
            exit;
        }
        return $_SESSION['openid'];
    }
    function getUserID()
    {
        $open_id=$this->getOpenID();
        /** @var user_model $user_model */
        $user_model=$this->model("user_model");
        if(!($user_id=$user_model->getUserIDByOpenID($open_id)))
            $user_id=$user_model->addNewUserByOpenID($open_id);
        return $user_id;

    }
    function jumpTo($url)
    {
        ob_clean();
        $return=array();
        $return['status']=-1;
        $return['redirect']=$url;
        header("Content-type: application/json");
        echo json_encode($return);
    }
    function isAdminLogin()
    {
        if(isset($_SESSION['is_admin']) && $_SESSION['is_admin']==true)
            return true;
        else
            return false;
    }
    function loginAdmin()
    {
        $_SESSION['is_admin']=true;
    }
    function logoutAdmin()
    {
        unset($_SESSION['is_admin']);
    }
    function sendMessage($open_id,$cur_pos)
    {
        /** @var curlRequest $curl */
        $curl=$this->newClass("curlRequest");
        $return=$curl->post("https://100steps.withcic.cn/wechat_bbt/Home/Vote/sendMessage",array(
            "openid"=>$open_id,
            "url"=>"https://100steps.withcic.cn/2017_gjty/index.html",
            "scene"=>1000,
            "title"=>"即将到号提醒",
            "content"=>"嘿，光影涂鸦马上就轮到你啦( ´･ᴗ･` )
你的编号为【". $cur_pos ."】 前面仅有三人在等候啦，赶快来吧୧(﹒︠ᴗ﹒︡)୨
【注意：过号五个号码将作废哦，届时就需要重新取号啦】",
            "color"=>"#666666"
        ));
        $json=json_decode($return,true);
        if(!$json || $json['status']!=true)
            return false;
        else
            return true;
    }
    function updateQueueInfo()
    {
        /** @var queue_model $queue_model */
        $queue_model=$this->model("queue_model");
        /** @var var_model $var_model */
        $var_model=$this->model("var_model");
        $json=array(
            "curPos"=>intval($var_model->getValue("curPos")),
            "queueLength"=>$queue_model->getQueueTotalLength(),
            "avgServeTime"=>intval($var_model->getValue("avgServeTime"))
        );
        file_put_contents(_Root ._DS_ . "queueinfo.json",json_encode($json));
        return $json;
    }
}