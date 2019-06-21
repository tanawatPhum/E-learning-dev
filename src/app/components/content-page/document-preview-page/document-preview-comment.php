<?php
Create database my_db;
Create table comments int id auto_increment, varchar(255) comment not null;
mysql_connect("localhost", "root", "root") or die("connecting");                             
mysql_select_db("my_db")or die("database");
$com = $_POST['comment'];

$query = "INSERT INTO comments(comment) VALUES('".$com."')";
mysql_query($query);

mysql_connect("localhost", "root", "root") or die("connecting")                           
mysql_select_db("my_db")or die("database");
$sql = "SELECT comment FROM comment";
        $res = mysql_query($sql);
        $result = "";
        while($row = $res->fetch_row()){
                $result .= $row[0]."<br/>";
        }   
        echo $result;
?>
