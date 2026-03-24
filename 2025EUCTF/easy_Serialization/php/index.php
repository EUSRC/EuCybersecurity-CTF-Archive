<?php
highlight_file(__FILE__);
class User {
    private $eu;
    public $passwd;
    public $bypass;

    public function __wakeup() {
        if (!isset($this->bypass)) {
            $this->eu = 2;
        }
    }
    public function __destruct() {
        if ($this->eu === 3 && $this->passwd === 5) {
            echo file_get_contents('/flag.txt');
        } else {
            echo "NONONO";
        }
    }
}

if (isset($_GET['data'])) {
    $data = $_GET['data'];
    $user = unserialize($data);
}
?>