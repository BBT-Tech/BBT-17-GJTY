<?php
/**
 * User: imyxz
 * Date: 2017-10-24
 * Time: 19:18
 * Github: https://github.com/imyxz/
 */
class var_model extends SlimvcModel
{
    function getValue($var_name)
    {
        return $this->queryStmt("select * from system_var where var_name=? limit 1",
            "s",
            $var_name)->row()['var_val'];
    }
    function setValue($var_name,$var_value)
    {
        return $this->queryStmt("update system_var set var_val=? where var_name=? limit 1",
            "ss",
            $var_value,
            $var_name);
    }
    function newVar($var_name,$var_value)
    {
        return $this->queryStmt("insert into system_var set var_name=?,var_value=?",
            "ss",
            $var_name,
            $var_value);
    }
}