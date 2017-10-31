<?php
/**
 * User: imyxz
 * Date: 2017-10-24
 * Time: 20:39
 * Github: https://github.com/imyxz/
 */
class admin extends SlimvcController
{
    function checkLogin()
    {
        try {
            $json=$this->getRequestJson();
            $username=$json['userName'];
            $password=$json['passWord'];
            global $Config;
            if($username!=$Config['AdminUsername'] || $password!=$Config['AdminPassword'])
                throw new Exception("用户名或密码错误！");
            $this->helper("global_helper")->loginAdmin();
            $return=array();
            $return['status'] = 0;
            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }
    }
    function logOut()
    {
        $this->helper("global_helper")->logoutAdmin();
        $return=array();
        $return['status'] = 0;
        $this->outputJson($return);
    }
    function getQueueList()
    {
        try {
            if(!$this->helper("global_helper")->isAdminLogin())
                throw new Exception("请先登录");
            /** @var queue_model $queue_model */
            $queue_model=$this->model("queue_model");
            /** @var var_model $var_model */
            $var_model=$this->model("var_model");
            $page=intval($_GET['page']);
            $limit=intval($_GET['limit']);
            if($page<=0)
                $page=1;
            if($limit<=0)
                $limit=10;
            $start=($page-1)*$limit;
            $results=$queue_model->getQueueList($start,$limit);
            $return=array();
            $return['data']=array();
            foreach($results as $one)
            {
                $return['data'][]=array(
                    "posID"=>$one['queue_id'],
                    "name"=>$one['name'],
                    "mobileNumber"=>$one['mobile_phone'],
                    "emailAddress"=>$one['email_address'],
                    "registerDate"=>$one['register_time_ts'],
                    "isNoticed"=>$one['is_noticed']
                );
            };
            $return['status']=0;
            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }
    }
    function getQueueListByPos()
    {
        try {
            if(!$this->helper("global_helper")->isAdminLogin())
                throw new Exception("请先登录");
            /** @var queue_model $queue_model */
            $queue_model=$this->model("queue_model");
            /** @var var_model $var_model */
            $var_model=$this->model("var_model");
            $queue_id=intval($_GET['start']);
            $limit=intval($_GET['limit']);
            $results=$queue_model->getQueueListFrom($queue_id,$limit);
            $return=array();
            $return['data']=array();
            foreach($results as $one)
            {
                $return['data'][]=array(
                    "posID"=>$one['queue_id'],
                    "name"=>$one['name'],
                    "mobileNumber"=>$one['mobile_phone'],
                    "emailAddress"=>$one['email_address'],
                    "registerDate"=>$one['register_time_ts'],
                    "isNoticed"=>$one['is_noticed']
                );
            };
            $return['status']=0;
            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }
    }
    function getQueueItem()
    {
        try {
            if(!$this->helper("global_helper")->isAdminLogin())
                throw new Exception("请先登录");
            /** @var queue_model $queue_model */
            $queue_model=$this->model("queue_model");
            /** @var var_model $var_model */
            $var_model=$this->model("var_model");
            $queue_id=intval($_GET['posID']);
            $one=$queue_model->getItemByQueueID($queue_id);
            if(!$one)
                throw new Exception("查无此人！");

            $return=array();
            $return['data']=array(
                "posID"=>$one['queue_id'],
                "name"=>$one['name'],
                "mobileNumber"=>$one['mobile_phone'],
                "emailAddress"=>$one['email_address'],
                "registerDate"=>$one['register_time_ts'],
                "isNoticed"=>$one['is_noticed']
            );
            $return['status']=0;
            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }
    }
    function goNext()
    {
        try {
            if(!$this->helper("global_helper")->isAdminLogin())
                throw new Exception("请先登录");
            /** @var queue_model $queue_model */
            $queue_model=$this->model("queue_model");
            /** @var var_model $var_model */
            $var_model=$this->model("var_model");
            /** @var user_model $user_model */
            $user_model=$this->model("user_model");
            $json=$this->getRequestJson();

            $cur_id=intval($json['curPos']);
            if($cur_id!=$var_model->getValue("curPos"))
                throw new Exception("前后台数据不一致！请先尝试刷新页面！");
            if($cur_id>=$queue_model->getQueueTotalLength())
                throw new Exception("不能next哦，目前已经处理完所有排队了");
            $start=$cur_id+1;
            if($start<1)    $start=1;
            $results=$queue_model->getQueueListFrom($start,3);
            foreach($results as $one)
            {
                if(!$one['is_noticed'])
                {
                    $open_id=$user_model->getOpenIDByUserID($one['user_id']);
                    if($this->helper("global_helper")->sendMessage($open_id,$one['queue_id']))
                    {
                        $queue_model->updateNoticeStatus($one['queue_id'],true);
                    }
                }
            }
            $var_model->setValue("curPos",$cur_id+1);
            $return['data']=$this->helper("global_helper")->updateQueueInfo();

            $return['status']=0;

            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }
    }

    function setIsRegisterAble()
    {
        try {
            if(!$this->helper("global_helper")->isAdminLogin())
                throw new Exception("请先登录");
            /** @var queue_model $queue_model */
            $queue_model=$this->model("queue_model");
            /** @var var_model $var_model */
            $var_model=$this->model("var_model");
            /** @var user_model $user_model */
            $user_model=$this->model("user_model");
            $json=$this->getRequestJson();

            $status=intval($json['status']);
            if($status!=0 && $status!=1 && $status!=-1)
                throw new Exception("无效的值");
            $var_model->setValue("isRegisterAble",$status);
            $return['status']=0;

            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }
    }
    function getRegisterAble()
    {
        try {
            if(!$this->helper("global_helper")->isAdminLogin())
                throw new Exception("请先登录");
            /** @var queue_model $queue_model */
            $queue_model=$this->model("queue_model");
            /** @var var_model $var_model */
            $var_model=$this->model("var_model");
            /** @var user_model $user_model */
            $user_model=$this->model("user_model");
            $json=$this->getRequestJson();
            $return['data']=array(
                "status"=>$var_model->getValue("isRegisterAble")
            );
            $return['status']=0;

            $this->outputJson($return);

        } catch (Exception $e) {
            $return=array();
            $return['status'] = 1;
            $return['errorMessage'] = $e->getMessage();
            $this->outputJson($return);

        }
    }

}
