<?php
        var secretreCAPTCHAKey = '6LcKMz0UAAAAAKSeo5WYCvTtzen0L30qzQnrTK5K';
        $email;$comment;$captcha;
        if(isset($_POST['email'])){
          $email=$_POST['email'];
        }
        if(isset($_POST['password'])){
          $email=$_POST['password'];
        }
        if(isset($_POST['g-recaptcha-response'])){
          $captcha=$_POST['g-recaptcha-response'];
        }
        if(!$captcha){
          echo '<h2>Please check the the captcha form.</h2>';
          exit;
        }
        $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret="+secretreCAPTCHAKey+"&response=".$captcha."&remoteip=".$_SERVER['REMOTE_ADDR']);
        if($response.success==false)
        {
          echo 'success';
        }else
        {
          echo 'error';
        }
?>
