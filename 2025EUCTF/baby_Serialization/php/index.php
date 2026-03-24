<?php
highlight_file(__FILE__);

class PASS { 
    public $name= '2';
    public $flag = '111';
    public function __wakeup(){
        $this->name = '111';
    }
}

if (isset($_GET['data'])) {
    $data = $_GET['data'];
    $user = unserialize($data);
    if (is_object($user) && property_exists($user, 'flag') && $user->flag === '111') {
        echo file_get_contents('/flag.txt');
    } else {
        exit('Wrong!');
    }
}