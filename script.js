const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

var prof = "";
var name = "";
var fontfam = "";

var lineheight = 0;
var wpad = 0;
var comment = 0;
var custchara = 1;
var avapad = 0;
var avaheight = 0;

var charas = [];
var fonts = [];

/*** FORM FUNCTIONS ***/
//load character list
$.get('https://raw.githubusercontent.com/LiinCh/KH3PostGeneratorWeb/master/List/Character.txt', function(data) {
	//split file content by line break
    var characters = data.split("\n");
	//iterate all lines
    for ( x = 0; x < characters.length; x++) {
		//split line by semicolon and set the key as 2nd field if filled or 1st field if not
		var chars = characters[x].split(";");
		if (chars.length < 5) continue;
		var key = chars[1] != '' ? chars[1] : chars[0];
		
		//load data from file into associative array
		charas[key] = [];
		charas[key]["EN"] = chars[0];
		charas[key]["JP"] = chars[2];
		charas[key]["File"] = chars[4];
		
		//add loaded data according to default language to character drop down list
		var lan = $('meta[name=language]').attr("content");
		var chr = lan == "EN" ? (chars[1] != '' ? chars[1] : chars[0]) : (chars[3] != '' ? chars[3] : chars[2]);
		$('#frmchara').append("<option value='" + key + "'>" + chr + "</option>");
    }
}, 'text');

//load language/font list
$.get('https://raw.githubusercontent.com/LiinCh/KH3PostGeneratorWeb/master/List/LanguageFont.txt', function(data) {
	//split file content by line break
    var languages = data.split("\n");
	//iterate all lines
    for ( x = 0; x < languages.length; x++) {
		//split line by semicolon
		var lan = languages[x].split(";");
		//load data from file into associative array
		fonts[lan[0]] = [];
		fonts[lan[0]]["Font"] = lan[1];
		fonts[lan[0]]["LineHeight"] = lan[2];
		//add loaded data to character drop down list
		$('#lan').append("<option>" + lan[0] + "</option>");
    }
}, 'text');

//Toggle displayed input between Upload button and Image URL text box
function ToggleInput(id, state) {
	if (state == 1) {
		$('#' + id + 'img').css('display', 'initial');
		$('#' + id + 'imgbtn').css('display', 'initial');
		$('#' + id + 'url').css('display', 'none');
	}
	else {
		$('#' + id + 'img').css('display', 'none');
		$('#' + id + 'imgbtn').css('display', 'none');
		$('#' + id + 'url').css('display', 'initial');
	}
}

//Load canvas content to URL and initiate click to download the image, set filename with date time to minimalize duplicate name
function Download() {
	var lnk = document.createElement('a'), e;	
	var dt = new Date();
	lnk.download = 'KH_' + dt.getFullYear() + (dt.getMonth()+1) + dt.getDate() + dt.getHours() + dt.getMinutes() + dt.getSeconds();
	lnk.href = c.toDataURL("image/png;base64");
	lnk.click();
}

//Change image upload button text to show uploaded file name
function ChangeFile(id) {
	var file = document.getElementById(id + 'img').files[0];
	if (file != null) $('#' + id + 'imgbtn').val(file.name);
	else $('#' + id + 'imgbtn').val('Upload Image');
}

function AddComment() {
	//Increase comment counter by 1 and add new comment section
	comment += 1;
	$('#commentform').append('<div id="comment' + comment + '">Comment #' + comment + ' &nbsp; <button onclick="RemoveComment(' + comment + ')">x</button></div>');
	
	//Copy the existing character and message field to the new comment section and set the value to initial
	$('#frmchara').clone().attr('id', 'commentchara' + comment).val('???').appendTo('#comment' + comment);
	$('#message').clone().attr('id', 'commentmessage' + comment).val('').appendTo('#comment' + comment);
}
function RemoveComment(id) {
	//Move the value of comment section after the deleted section to fill the previous section
	for (var x = id; x < comment; x++)
	{
		$('#commentchara' + x).val($('#commentchara' + (x + 1)).val());
		$('#commentmessage' + x).val($('#commentmessage' + (x + 1)).val());
	}
	
	//Delete the last comment section and decrease comment counter by 1
	$('#comment' + comment).remove();
	comment -= 1;
}

function AddChara() {
	//Increase comment counter by 1 and add new custom character section
	custchara += 1;
	$('#custform').append('<div id="cform' + custchara + '"><h3>Custom ' + custchara + ' &nbsp; ' + 
						  '<button onclick="RemoveChara(' + custchara + ')">x</button>' + 
						  '</h3>Name<input type="text" id="custname' + custchara + '" />' +
						  'Avatar<br/>' +
						  '<input type="radio" name="cus' + custchara + 'sel" id="cus' + custchara + 'sel1" ' + 
							'onclick="ToggleInput(\'cus' + custchara + '\', 1)" checked="checked" />' +
						  '<label for="cus' + custchara + 'sel1">Upload</label>' +
						  '<input type="radio" name="cus' + custchara + 'sel" id="cus' + custchara + 'sel2" ' + 
							'onclick="ToggleInput(\'cus' + custchara + '\', 2)" />' +
						  '<label for="cus' + custchara + 'sel2">URL</label>' +
						  '<br/>' +
						  '<input type="button" id="cus' + custchara + 'imgbtn" value="Upload Image">' +
						  '<input type="file" id="cus' + custchara + 'img" onchange="ChangeFile(\'cus' + custchara + '\')"/>' +
						  '<input type="text" id="cus' + custchara + 'url" style="display:none"/>' +
						  '</div>');
}
function RemoveChara(id) {
	if (custchara <= 1) {
		//Simply empty form if it's the last form
		$('#custname1').val('');
		$('#custurl1').val('');
	}
	else {
		//Move the custom character value from section after the deleted section to fill the previous section
		for (var x = id; x < custchara; x++) 
		{
			$('#custname' + x).val($('#custname' + (x + 1)).val());
			$('#custurl' + x).val($('#custurl' + (x + 1)).val());
		}
		//Delete the last custom character section and decrease comment counter by 1
		$('#cform' + custchara).remove();
		custchara -= 1;
	}
}
function UpdateChara() {
	for (var x = 1; x <= custchara; x++)
	{
		//remove previous value and add the new one
		$('#frmchara option[value="customchar' + x + '"]').remove();
		if ($('#custname' + x).val().length > 0)
			$('#frmchara').append("<option value='customchar" + x + "'>" + $('#custname' + x).val() + "</option>");
		for (var y = 1; y <= comment; y++)
		{
			$('#commentchara' + y + ' option[value="customchar' + x + '"]').remove();
			if ($('#commentchara' + y).val().length > 0)
				$('#commentchara' + y).append("<option value='customchar" + x + "'>" + $('#custname' + x).val() + "</option>");
		}
	}
	
	//remove the remaining options on list
	var x = custchara + 1;
	while ($('#frmchara option[value="customchar' + x + '"]').val() != null)
	{
		$('#frmchara option[value="customchar' + x + '"]').remove();
		for (var y = 1; y <= comment; y++)
		x += 1;
	}
}

/*** CANVAS FUNCTIONS ***/
function generate() {
	//initialize data for canvas
	getfont();
	var height = calculateheight();
	getchara('#frmchara');
	
	//If export background is selected then add 500px left padding to all elements drawn into canvas
	if($("#exportbg").prop('checked') == true) wpad = 500;
	else wpad = 0;
	
	//initialize canvas and set margin for preview
	c.width = 920 + (wpad * 2);
	c.height = height;
	ctx.clearRect(0, 0, c.width, c.height);
	$('.prvinnerwrap').css('margin', '-' + (height/ 4) + 'px -' + ((920 + (wpad * 2)) / 4) + 'px');
	
	//draw background patterns into canvas
	var pat = ctx.createPattern(document.getElementById("bg"), 'repeat');
	ctx.rect(0, 0, 920 + (wpad * 2), height);
	ctx.fillStyle = pat;
	ctx.fill();
	
	//add gradient for shadow on top of patterns
	//Gradient is set to be vertically black only at the center of canvas
	var grd = ctx.createLinearGradient(0, 0, 920 + (wpad * 2), 0);
	grd.addColorStop(0, "transparent");
	grd.addColorStop(0.5, "black");
	grd.addColorStop(1, "transparent");
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 920 + (wpad * 2), height);
	
	//Draw the white background of main post
	//Main post contains 2 parts, the menus and the post itself
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(wpad, 0, 920, 75);
	ctx.fillRect(wpad, 85, 920, height - 85);
	
	//Draw menu images into canvas 
	ctx.drawImage(document.getElementById("h1"), wpad, 0);
	ctx.drawImage(document.getElementById("h2"), wpad + 360, 0);
	ctx.drawImage(document.getElementById("h3"), wpad + 845, 0);
	ctx.drawImage(document.getElementById("menu"), wpad + 700, 85);
		
	//create new image for avatar and draw it into canvas once it's loaded
	//pad and line are just variable to set the avatar position into canvas
	var avatar = new Image();
	avatar.crossOrigin = "Anonymous";
	avatar.pad = 45;
	avatar.line = 100;
	avatar.src = prof;
	avatar.onload = loadavatar;
	
	//Write poster character name
	ctx.font = fontfam;
	ctx.fillStyle = '#777777';
	ctx.textBaseline = 'top';
	ctx.fillText(name, wpad + 130, 125);
	
	//Draw grey rectangle for post picture placeholder
	ctx.fillStyle = "#555555";
	ctx.fillRect(wpad, 185, 920, 520);
	
	//Create new image for post picture
	var content = new Image();
	content.crossOrigin = "Anonymous";
	//If it's URL then set source to the URL, if not load uploaded image as URL data and set it as source
	if($('#contenturl').css('display') != 'none') content.src = $('#contenturl').val();
	else if (document.getElementById('contentimg').files[0] != null)
		content.src = URL.createObjectURL(document.getElementById('contentimg').files[0]);
	//Draw image into canvas once it's loaded
	content.onload = loadcontent;
	
	//Write message into canvas
	var line = loadmessage(740, $('#message').val(), 80, wpad + 850, 4, false);
	
	//Define tags font color
	ctx.fillStyle = 'MediumBlue';
	//remove excess space from tag list and convert long space (for Japanese) into regular space, then put the list into array
	var tags = $('#tags').val().trim().replace(/\s+/g, ' ').replace(/ +(?= )/g, '').replace(' ', ' ').split(" ");
	
	//initialize parameters for tags and the first tag
	var tagwidth = wpad + 80;
	var linecount = 1;
	var tag;
	
	for (var x = 0; x < tags.length; x++) {
		//If the tag started with #, omit the first character. If it's empty, do not draw anything and go to next tag
		tag = tags[x];
		if (tag.substring(0, 1) == '#') tag = tag.substring(1);
		if(tag.trim().length <= 0) continue;
		
		//draw tag image into canvas
		ctx.drawImage(document.getElementById("t"), tagwidth, line);
		tagwidth += 30;
		
		//Write tag into canvas
		ctx.fillText(tag, tagwidth, line);
		tagwidth += ctx.measureText(tag).width + 10;
		
		//measure length with next word if current tag is not the last
		if (x + 1 < tags.length) {
			//load the next tag
			tag = tags[x+1];
			if (tag.substring(0, 1) == '#') tag = tag.substring(1);
			
			//if tag width for current line greater than 850px then go to next line
			if (tagwidth + ctx.measureText(tag).width > wpad + 850) {
				tagwidth = wpad + 80;
				line += lineheight;
			}
		}
	}
	
	//move on next line for comment
	line += lineheight;
	
	//Iterate all comments
	for(var x = 1; x <= comment; x++)
	{
		//initialize name and profile link for current character
		getchara('#commentchara' + x);
		
		//create new image for current comment avatar and draw it into canvas once it's loaded
		var ca = new Image();
		ca.crossOrigin = "Anonymous";
		ca.pad = 90;
		ca.line = line + (lineheight * 1.5 - 45);
		ca.src = prof;
		ca.onload = loadavatar;
		
		//write the comment into canvas, put character name into the beginning of comment
		var newline = loadmessage(line + (lineheight / 2), name + ' ' + $('#commentmessage' + x).val(), 170, wpad + 820, 2, true);
		if (newline - line < lineheight * 2.3) line += lineheight * 2.3;
		else line = newline;
	}
	
	//display the preview
	$("#preview").css("display", "block");
}

//Function to calculate canvas height
function calculateheight() {
	//set font first so message could be calculated precisely and initialize variables
	//Line directly set at 740px because all before that are content with fixed height
	ctx.font = fontfam;
	var line = 740;
	var linecount = 1;
	var tagwidth = 80;
	
	//calculate message height by simulating write process
	var msgline = $('#message').val().split("\n");
	for (var y = 0; y < msgline.length; y++) {
		var msg = msgline[y].trim().replace(/ +(?= )/g, '').split(" ");
		for (var x = 0; x < msg.length; x++) {
			tagwidth += ctx.measureText(msg[x] + ' ').width;
			if (x + 1 < msg.length) {
				if (tagwidth + ctx.measureText(msg[x + 1]).width > 850) {
					tagwidth = 80;
					line += lineheight;
				}
			}
		}
		tagwidth = 80;
		line += lineheight;
	}
	
	//calculate tags height by simulating write process
	var tags = $('#tags').val().trim().replace(/\s+/g, ' ').replace(/ +(?= )/g, '').replace(' ', ' ').split(" ");
	tagwidth = 80;
	linecount = 1;
	for (var x = 0; x < tags.length; x++) {
		tagwidth += 30;
		tagwidth += ctx.measureText(tags[x]).width + 10;
		if (x + 1 < tags.length) {
			if (tagwidth + ctx.measureText(tags[x + 1]).width > 850) {
				tagwidth = 80;
				line += lineheight;
			}
		}
	}
	line += lineheight;
	
	//calculate comments height by simulating write process
	for(var z = 1; z <= comment; z++) {
		var newline = line + (lineheight / 2);
		getchara('#commentchara' + z);
		msgline = (name + ' ' + $('#commentmessage' + z).val()).split("\n");
		
		for (var y = 0; y < msgline.length; y++) {
			var msg = msgline[y].trim().replace(/ +(?= )/g, '').split(" ");
			for (var x = 0; x < msg.length; x++) {
				tagwidth += ctx.measureText(msg[x] + ' ').width;
				if (x + 1 < msg.length) {
					if (tagwidth + ctx.measureText(msg[x + 1]).width > 820) {
						tagwidth = 170;
						newline += lineheight;
					}
				}
			}
			tagwidth = 170;
			newline += lineheight;
		}
		if (newline - line < lineheight * 2.3) line += lineheight * 2.3;
		else line = newline;
	}
	
	//if line height is too small, return default height
	if (line < 1080) return 1080;
	else return line;
}

//Function for writing main message body and comments
function loadmessage(start, msg, pad, width, linecnt, startname) {
	//Initialize variables
	var line = start;
	var linecount = 1;
	var msgwidth = wpad + pad;
	
	//split message by line break
	var msgline = msg.split("\n");
	
	//Iterate every line on message
	for (var y = 0; y < msgline.length; y++) {
		//Split line by space
		var msg = msgline[y].trim().replace(/ +(?= )/g, '').split(" ");
		
		//Iterate all words in line
		for (var x = 0; x < msg.length; x++) {
			//If message started with a name then set font color to grey, if it started with @ set it to blue, otherwise set as black
			if (startname) { ctx.fillStyle = '#777777'; startname = false; msg[x] += ' '; }
			else if (msg[x].substring(0, 1) == '@') ctx.fillStyle = 'MediumBlue';
			else ctx.fillStyle = 'Black';
			
			//Write the word into canvas and measure the length of word
			ctx.fillText(msg[x] + ' ', msgwidth, line);
			msgwidth += ctx.measureText(msg[x] + ' ').width;
			
			//measure the current text width with next word, if it's longer than predefined text area width go to next line
			if (x + 1 < msg.length) {
				if (msgwidth + ctx.measureText(msg[x + 1]).width > width) {
					msgwidth = wpad + pad;
					line += lineheight;
				}
			}
		}
		
		//set message into next line and reset message width
		msgwidth = wpad + pad;
		line += lineheight;
	}
	return line;
}

//Function for drawing avatar into canvas
function loadavatar() {
	if (this.width == 70 && this.height == 70) ctx.drawImage(this, wpad + this.pad, this.line);
	else {
		ctx.save();
		ctx.beginPath();
		ctx.arc(wpad + this.pad + 35, this.line + 35, 35, 0, 2 * Math.PI);
		ctx.clip();
		if (this.width > this.height)
		{
			var scale = this.width * (70 / this.height);
			ctx.drawImage(this, scale / 2, 0, this.width - scale, this.height, wpad + this.pad, this.line, 70, 70);
		}
		else if (this.width = this.height)
		{
			ctx.drawImage(this, 0, 0, this.width, this.height, wpad + this.pad, this.line, 70, 70);
		}
		else
		{
			var scale = this.height * (70 / this.width);
			ctx.drawImage(this, 0, scale / 2, this.width, this.height - scale, wpad + this.pad, this.line, 70, 70);
		}
		ctx.restore();
	}
}

//Function for drawing content image into canvas
function loadcontent() {
	//Compare image width to height ratio with template ratio and scale accordingly
	if (this.width / this.height > 1.77) {
		var scale = this.width - (this.height / 520 * 920);
		ctx.drawImage(this, scale / 2, 0, this.width - scale, this.height, wpad, 185, 920, 520);
	} else {
		var scale = this.height - (this.width / 920 * 520);
		ctx.drawImage(this, 0, scale / 2, this.width, this.height - scale, wpad, 185, 920, 520);
	}
	
	//Draw watermark on top of content image if the field is filled
	if ($('#watermark').val() != '') {
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		var width = ctx.measureText($('#watermark').val()).width + 10;
		ctx.fillRect(wpad + 920 - width,185,width,35);
		ctx.fillStyle = 'rgba(255,255,255,0.5)';
		ctx.fillText($('#watermark').val(), wpad + (920 - width) + 5, 190);
	}
}

//Get font from array
function getfont() {
	fontfam = fonts[$('#lan').val()]["Font"];
	lineheight = parseInt(fonts[$('#lan').val()]["LineHeight"]);
}

//Get character name and avatar image
function getchara(id) {
	//Get the inputed value if it's custom character
	if ($(id).val().includes('customchar')) 
	{
		var num = $(id).val().replace('customchar', '');
		name = $('#custname' + num).val();
		
		if($('#cus' + num + 'url').css('display') != 'none') prof = $('#cus' + num + 'url').val();
		else if (document.getElementById('cus' + num + 'img').files[0] != null)
			prof = URL.createObjectURL(document.getElementById('cus' + num + 'img').files[0]);
	}
	//If it's not custom character then simply get the name and link from array
	else 
	{
		if ($(id).val() != '???')
		{
			if ($('#lan').val().includes("English")) name = charas[$(id).val()]["EN"];
			else name = charas[$(id).val()]["JP"];
		}
		else name = $(id).val();
		prof = 'https://raw.githubusercontent.com/LiinCh/KH3PostGeneratorWeb/master/Images/Avatars/' + charas[$(id).val()]["File"];
	}
}