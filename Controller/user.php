<?php
/**
 * User: imyxz
 * Date: 2017-10-24
 * Time: 20:15
 * Github: https://github.com/imyxz/
 */
class user extends SlimvcController
{
    function isUserInQueue()
    {
        $user_id=$this->helper("global_helper")->getUserID();
        /** @var queue_model $queue_model */
        $queue_model=$this->model("queue_model");
        /** @var var_model $var_model */
        $var_model=$this->model("var_model");
        try {
            $return=array();
            if($item=$queue_model->getItemByUserID($user_id))
            {
                $return['data']=array(
                    "isInQueue"=>true,
                    "userPos"=>$item['queue_id'],
                    "curPos"=>$var_model->getValue("curPos"),
                    "queueLength"=>$queue_model->getQueueTotalLength(),
                    "avgServeTime"=>$var_model->getValue("avgServeTime")

                );
            }
            else
            {
                $return['data']=array(
                    "isInQueue"=>false,
                    "isRegisterAble"=>$var_model->getValue("isRegisterAble")
                );
            }

            $return['status'] = 0;
            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }

    }
    function register()
    {
        $user_id=$this->helper("global_helper")->getUserID();
        /** @var queue_model $queue_model */
        $queue_model=$this->model("queue_model");
        /** @var var_model $var_model */
        $var_model=$this->model("var_model");
        /** @var user_model $user_model */
        $user_model=$this->model("user_model");
        try {
            $return=array();
            if($var_model->getValue("isRegisterAble")!=0)
                throw new Exception("现在还未能预约哦！请关注现场信息！");
            if(($item=$queue_model->getItemByUserID($user_id)) && ($var_model->getValue("curPos")- $item['queue_id']<=5))
                throw new Exception("您在队伍中哦，请勿重新报名。温馨提示：过号5个之内排队是有效的哦");
            $json=$this->getRequestJson();
            $name=@$json['name'];
            $mobileNumber=@$json['mobileNumber'];
            $emailAddress=@$json['emailAddress'];
            if(empty($name) || strlen($name)>128)
                throw new Exception("姓名未按格式填写");
            if(empty($mobileNumber) || !preg_match_all("/^1[0-9]{10}$/",$mobileNumber))
                throw new Exception("手机未按格式填写");
            if(empty($emailAddress) || strlen($emailAddress)>256 || !preg_match_all('/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,}(\.[a-z]{2,})*)$/',$emailAddress))
                throw new Exception("邮箱未按格式填写");
            $queue_id=$queue_model->insertNewItem($user_id,$name,$mobileNumber,$emailAddress);
            if(!$queue_id)
                throw new Exception("系统出错！请联系现场工作人员！");
            if($queue_id-$var_model->getValue("curPos")<=3)//需要立即通知了
            {
                $open_id=$user_model->getOpenIDByUserID($user_id);
                if($this->helper("global_helper")->sendMessage($open_id,$queue_id))
                {
                    $queue_model->updateNoticeStatus($queue_id,true);
                }
            }
            $return['data']=$this->helper("global_helper")->updateQueueInfo();
            $return['userPos']=$queue_id;
            $return['status'] = 0;
            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }

    }
    function subscribeMsg()
    {
        $user_id=$this->helper("global_helper")->getUserID();
        /** @var queue_model $queue_model */
        $queue_model=$this->model("queue_model");
        /** @var var_model $var_model */
        $var_model=$this->model("var_model");
        global $Config;
        $wx_template_id=$Config['wx_template_id'];
        $app_id=$Config['wx_app_id'];
        $redirect=urlencode("https://100steps.withcic.cn/2017_gjty/user/onSubscribedMsg/");
        $url="https://mp.weixin.qq.com/mp/subscribemsg?action=get_confirm&appid=$app_id&scene=1000&template_id=$wx_template_id&redirect_url=$redirect&reserved=none#wechat_redirect";
        header("Location: $url");
    }
    function onSubscribedMsg()
    {
        $openid=@$_GET['openid'];
        $template_id=$_GET['template_id'];
        $action=$_GET['action'];
        /*
         * One of:
         *      confirm:用户确认订阅
         *      cancel:用户取消授权
         */
        $scene=intval($_GET['scene']);
        $reserved=@$_GET['reserved'];
        $user_id=$this->helper("global_helper")->getUserID();
        /** @var queue_model $queue_model */
        $queue_model=$this->model("queue_model");
        /** @var var_model $var_model */
        $var_model=$this->model("var_model");
        /** @var user_model $user_model */
        $user_model=$this->model("user_model");
        if($action=='confirm' && $openid==$_SESSION['openid'])
        {
            $user_model->updateUserSubscribeStatus($user_id,true);
            $redirect="https://100steps.withcic.cn/2017_gjty/index.html";
            header("Location: $redirect");
        }
        else
        {
            $redirect="https://100steps.withcic.cn/2017_gjty/guide.html";
            header("Location: $redirect");
        }
    }
}