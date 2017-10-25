<?php
/**
 * User: imyxz
 * Date: 2017-10-24
 * Time: 19:13
 * Github: https://github.com/imyxz/
 */
class queue_model extends SlimvcModel
{
    function getQueueList($start,$limit)
    {
        return $this->queryStmt("select *,unix_timestamp(register_time) as register_time_ts from queue_info order by queue_id asc limit ?,?",
            "ii",
            $start,
            $limit)->all();
    }
    function getQueueListFrom($queue_id,$limit)
    {
        return $this->queryStmt("select *,unix_timestamp(register_time) as register_time_ts from queue_info where queue_id>=? order by queue_id asc limit 0,?",
            "ii",
            $queue_id,
            $limit)->all();
    }
    function insertNewItem($user_id,$name,$mobile_phone,$email_address)
    {
        if(!$this->queryStmt("insert into queue_info set user_id=?,name=?,mobile_phone=?,email_address=?,is_noticed=false,register_time=now()",
            "isss",
            $user_id,
            $name,
            $mobile_phone,
            $email_address))
            return false;
        return $this->InsertId;
    }
    function getItemByQueueID($queue_id)
    {
        return $this->queryStmt("select *,unix_timestamp(register_time) as register_time_ts from queue_info where queue_id=? limit 1",
            "i",
            $queue_id)->row();
    }
    function getItemByUserID($user_id)
    {
        return $this->queryStmt("select *,unix_timestamp(register_time) as register_time_ts from queue_info where user_id=? order by queue_id desc limit 1",
            "i",
            $user_id)->row();
    }
    function getQueueTotalLength()
    {
        return $this->query("select count(queue_id) from queue_info")->row()['count(queue_id)'];
    }
    function updateNoticeStatus($queue_id,$status)
    {
        return $this->queryStmt("update queue_info set is_noticed=? where queue_id=? limit 1",
            "ii",
            $status,
            $queue_id);
    }
}