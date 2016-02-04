<!DOCTYPE html>
<html lang="en">
<head>
<title><?php echo $title; ?></title>
<style type="text/css">

body {
	background-color: #fff;
	margin: 40px;
	font: 13px/20px normal Helvetica, Arial, sans-serif;
	color: #4F5155;
}

a {
	color: #003399;
	background-color: transparent;
	font-weight: normal;
}

h1 {
	color: #444;
	background-color: transparent;
	border-bottom: 1px solid #D0D0D0;
	font-size: 19px;
	font-weight: normal;
	margin: 0 0 14px 0;
	padding: 14px 15px 10px 15px;
}

code {
	font-family: Consolas, Monaco, Courier New, Courier, monospace;
	font-size: 12px;
	background-color: #f9f9f9;
	border: 1px solid #D0D0D0;
	color: #002166;
	display: block;
	margin: 14px 0 14px 0;
	padding: 12px 10px 12px 10px;
}

#container {
	margin: 10px;
	border: 1px solid #D0D0D0;
	-webkit-box-shadow: 0 0 8px #D0D0D0;
}

span{
	color: #B0B0B0;
}

p {
	margin: 12px 15px 12px 15px;
}

input {
	font-size: 13px;
}
</style>
</head>
<body>
	<div id="container">
		<h1><?php echo $title; ?></h1>
		<p>Current Version : <?php echo $current ?></p>
		<p><?php echo $message; ?></p>
		
		<form method="POST" action="#" id="goto">
			<p>
				<label for="version">Migrate to version</label>:
				
				<select value="<?php echo $current ?>" id="version" onchange="document.getElementById('goto').setAttribute('action','<?php echo site_url('/migrate/to/'); ?>/'+this.value+'/');">
				<option value="latest">=================</option>
				<option value="latest">===== LATEST =====</option>
				<option value="latest">=================</option>
				<?php
				$dir = "../backend/application/migrations";
				
				$a = scandir($dir);
				$b = array();
				foreach($a as $key){
				?>
					<?php
					$array = substr($key, 0, 14);
					if(substr($array, 0, 4) == 2015){
						array_push($b, $key);
					?>
						<option value="<?php echo $array ?>"><?php echo $key ?></option>
					<?php
					}
				}
				?>
				</select>
				
				<input type="submit" value="Go"/>
			</p>
		</form>
		
		<p>
		<?php if("a"){ ?>
			<a href="<?php echo site_url('/migrate/to/latest'); ?>" title="set to latest version" class="ideal">Latest</a>&nbsp;|&nbsp;
		<?php } else { ?>
			<span class="ideal" title="">Latest</span>
		<?php } ?>
		<?php if($ideal = $current){ ?>
			<a href="<?php echo site_url('/migrate/to/reset'); ?>" title="reset to 0" class="ideal">Reset</a>&nbsp;|&nbsp;
		<?php } else { ?>
			<span class="ideal" title="">Reset</span>
		<?php } ?>
		</p>
	</div>
	
	
	<div>
		<?php
			foreach ($b as $key){
		?>
			<h3><?php echo $key?></h3>
			<code>
				<?php 
					readfile("../backend/application/migrations/$key");
				?>
			</code>
		<?php 
			}
		?>
	</div>
</body>
</html>