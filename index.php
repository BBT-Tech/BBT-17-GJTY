<?php
/**
 * User: imyxz
 * Date: 2017/5/24
 * Time: 14:18
 * Github: https://github.com/imyxz/
 */
define('_DS_',DIRECTORY_SEPARATOR);          //目录分隔符
define('_Root',dirname(__FILE__) . _DS_);
define('_Slimvc',_Root . 'Slimvc' . _DS_);
define('_Controller',_Root . 'Controller' . _DS_);
define('_Model',_Root . 'Model' . _DS_);
define('_View',_Root . 'View' . _DS_);
define('_Class',_Root . 'Class' . _DS_);
define('_Helper',_Root . 'Helper' . _DS_);
define('_HTTP','');
define('_PREFIX','/2017_gjty');
if(substr($_SERVER['REQUEST_URI'],0,strlen(_PREFIX))==_PREFIX)
    $_SERVER['REQUEST_URI']=substr($_SERVER['REQUEST_URI'],strlen(_PREFIX),strlen($_SERVER['REQUEST_URI'])-strlen(_PREFIX));
include(_Slimvc . 'Config.php');
include(_Slimvc . 'Slimvc.php');


$Slimvc=new Slimvc();
$Slimvc->processor->initProcess();
$Slimvc->processor->startController();
