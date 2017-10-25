<?php
/**
 * User: imyxz
 * Date: 2017-10-24
 * Time: 19:08
 * Github: https://github.com/imyxz/
 */
class user_model extends SlimvcModel
{
    function getUserIDByOpenID($open_id)
    {
        $row= $this->queryStmt("select user_id from user_info where open_id=? limit 1",
            "s",
            $open_id)->row();
        if(!$row)
            return false;
        else
            return $row['user_id'];
    }
    function getOpenIDByUserID($user_id)
    {
        return $this->queryStmt("select open_id from user_info where user_id=? limit 1",
            "i",
            $user_id)->row()['open_id'];
    }
    function addNewUserByOpenID($open_id)
    {
        if(!$this->queryStmt("insert into user_info set open_id=? , is_subscribed=false",
            "s",
            $open_id))
            return false;
        return $this->InsertId;
    }
    function updateUserSubscribeStatus($user_id,$status)
    {
        return $this->queryStmt("update user_info set is_subscribed=? where user_id=? limit 1",
            "ii",
            $status,
            $user_id);
    }
}