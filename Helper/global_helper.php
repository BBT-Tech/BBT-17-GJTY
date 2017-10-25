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
        //TODO:与佳妹后端交互发送订阅信息
        return true;
    }
}