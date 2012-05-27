var vars_inited = false;
var video_player = null;
var index_div = null;
var slides_div = null;
var slides_metadata= null;
var projects_metadata= null;
var img = null;
var project_list_title = null;
var project_list_container = null;
var main_projects_div = null;
var main_player_div = null;
var main_player_title = null;


var last_slide_index = -1;
var last_video_time = 0;

var site_domain = "dev.simplex.tv";
var customer_id = 333;
var channel_id = 266;
var author_id = 0;
var project_id = 0;
var project_title = "";

function InitVars()
{
	if(vars_inited == false) 
	{
		video_player = document.getElementById("player");
		index_div = document.getElementById("index");
		slides_div = document.getElementById("slides");
		img = document.getElementById("slide_img");
		project_list_title = document.getElementById("project_list_title");
		project_list_container = document.getElementById("project_list_container");
		main_projects_div = document.getElementById("main_projects_div");
		main_player_div = document.getElementById("main_player_div");
		main_player_title = document.getElementById("main_player_title");
		
		vars_inited = true;
	}
}

function ConvertInt2TimeStr(time_int)
{
	time_int = Math.floor(time_int / 10);
	var mins = Math.floor(time_int / 60);
	var secs = Math.floor(time_int - mins*60);
	if(mins < 10) mins = "0" + mins;
	if(secs < 10) secs = "0" + secs;
	return mins + ":" + secs;
}

function SetIndexSlidesContent()
{
	if(slides_metadata!=null) {
		var i=0;
		for (; i < slides_metadata.length; i++) {
			var title = slides_metadata[i].data.title;
			var time_stamp = ConvertInt2TimeStr(slides_metadata[i].startPos);
			var img_src = GetProjectUrl() + slides_metadata[i].data.thumb + "_" +slides_metadata[i].data.frame + ".png";
			if(title) {
				index_div.innerHTML += GetIndexFrameDiv(i, time_stamp, title);
				slides_div.innerHTML += GetSlidesFrameDiv(i, time_stamp, title, img_src);
			}
		}
	}
}

function ClearIndexSlidesContent()
{
	index_div.innerHTML = "";
	slides_div.innerHTML = "";
}

function GetIndexFrameDiv(index, time_stamp, title_str)
{
	var div = "<div id=\"index_frame_#index\" class=\"index_title_container inactive_index_frame\" onclick=\"onSlideClick(#index);\"><div class=\"index_time\">#time_stamp</div>#title_str</div>";
	div = div.replace(/#index/g, index);
	div = div.replace("#time_stamp", time_stamp);
	div = div.replace("#title_str", title_str);
	return div;
}

function GetSlidesFrameDiv(index, time_stamp, title_str, img_src)
{
	var div = "<div id=\"slides_frame_#index\" class=\"index_title_container inactive_index_frame\" onclick=\"onSlideClick(#index);\"><div class=\"index_time\">#time_stamp</div><div class=\"slide_img\"><img src=\"#img_src\" style=\"width:100%\"></div><div class=\"slides_title\">#title_str</div></div>";
	div = div.replace(/#index/g, index);
	div = div.replace("#time_stamp", time_stamp);
	div = div.replace("#title_str", title_str);
	div = div.replace("#img_src", img_src);
	return div;
}

function onSlideClick(index)
{
	if(slides_metadata!=null && index < slides_metadata.length) {
		video_player.currentTime = Math.floor(slides_metadata[index].startPos / 10);
		video_player.play();
		changeImage(index);
	}
}

function onVideoPlayer_TimeUpdate()
{
	if(slides_metadata == null) return;
	var flag = true;
	var vid_curtime = video_player.currentTime;
	if(last_video_time > vid_curtime) {
		last_slide_index = -1;
	}
		
	var i=slides_metadata.length-1;
	for (; i>=0 && flag; i--) {
		if(vid_curtime >= Math.floor(slides_metadata[i].startPos / 10)) {
			if(i > last_slide_index) {
				changeImage(i);
			}
			flag = false;
		}
	}
	last_video_time = vid_curtime;
}

function changeImage(index)
{
	last_slide_index = index;
	img.src = GetProjectUrl() + slides_metadata[index].data.thumb + "_" +slides_metadata[index].data.frame + ".png";
	setAll_index_frames_inactive();
	set_active_frame(index);
}

function setAll_index_frames_inactive()
{
	if(slides_metadata == null) return;
	var i=slides_metadata.length-1;
	for (; i>=0; i--) {
		var frame = document.getElementById("index_frame_"+i);
		if(frame) frame.className = frame.className.replace(" active_index_frame", " inactive_index_frame");
		
		frame = document.getElementById("slides_frame_"+i);
		if(frame) frame.className = frame.className.replace(" active_index_frame", " inactive_index_frame");
	}
}

function set_active_frame(index)
{
	var frame =  document.getElementById("index_frame_"+index);
	if(frame != null) {
		frame.className = frame.className.replace(" inactive_index_frame", " active_index_frame");
	}

	frame =  document.getElementById("slides_frame_"+index);
	if(frame != null) {
		frame.className = frame.className.replace(" inactive_index_frame", " active_index_frame");
	}
}

function GetProjectsMetadataUrl()
{
	var url = "http://strong-winter-8770.herokuapp.com/jsonp?url=";
    url += "http://" + site_domain + "/multichannel/"+ customer_id +"/"+ channel_id +"/.ocdd/json";
    url += "&callback=OnRecieveProjectsMetadata";
    return url;
}

function GetProjectsMetadata()
{
    var script = document.createElement('script');
    script.setAttribute('src', GetProjectsMetadataUrl());
    script.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(script);
}

function OnRecieveProjectsMetadata(response)
{
	projects_metadata = eval('(' + response + ')');
	project_list_title.innerText = projects_metadata[0].title;
	SetProjectsListDivContent();
}

function SetProjectsListDivContent()
{
	if(projects_metadata!=null) {
		var i=0;
		var projects = projects_metadata[0].projects;
		for (; i < projects.length; i++) {
			var title = projects[i].title;
			var description = projects[i].description;
			var customerId = projects[i].customerId;
			var authorId = projects[i].authorId;
			var projectId = projects[i].projectId;
			var img_src = "http://" + site_domain + "/content/" + customerId + "/" + authorId + "/" + projectId + "/simvid_1.jpg";
			
			project_list_container.innerHTML += GetProjectDiv(i, title, description, img_src, customerId, authorId, projectId);
		}
	}
}

function GetProjectDiv(index, title, description, img_src, customerId, authorId, projectId)
{
	if(description == null) description = "";
	var div = "<div id=\"project_div_"+index+"\" class=\"project_div\" onclick=\"onProjectClick("+index+","+customerId+","+authorId+","+projectId+");\">";
	div += "<div class=\"project_img\"><img src=\"" + img_src + "\" style=\"width:100%;\"/></div>";
	div += "<div class=\"project_name_div\">"+title+"</div>";
	div += "<div class=\"project_desc_div\">"+description+"</div>";
	div += "</div>";
	return div;
}

function onProjectClick(index, customerId, authorId, projectId) 
{
	author_id = authorId;
	project_id = projectId;
	
	main_player_title.innerHTML = projects_metadata[0].projects[index].title;
	video_player.poster = GetProjectUrl() + "simvid_1.jpg";
	
	GetVideoMetadata();
	GetSlidesMetadata();
	setPlayerVisible();
	video_player.addEventListener('timeupdate', onVideoPlayer_TimeUpdate, false);
}

function GetVideoMetadataUrl()
{
	var url = "http://strong-winter-8770.herokuapp.com/jsonp?url=";
    url += GetProjectUrl() +"pl01.sid";
    url += "&callback=OnRecieveVideoMetadata";
    return url;
}

function GetSlidesMetadataUrl()
{
	var url = "http://strong-winter-8770.herokuapp.com/jsonp?url=";
    url += GetProjectUrl() +"pl02.sid";
    url += "&callback=OnRecieveSlidesMetadata";
    return url;
}

function GetProjectUrl()
{
	return "http://" + site_domain + "/content/"+ customer_id +"/"+ author_id + "/"+ project_id +"/";
}

function GetVideoMetadata()
{
    var script = document.createElement('script');
    script.setAttribute('src', GetVideoMetadataUrl());
    script.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(script);
}

function OnRecieveVideoMetadata(response)
{
	var video_metadata = eval('(' + response + ')');
	video_player.src = "http://" + site_domain + "/content/"+ customer_id +"/"+ author_id + "/"+ project_id +"/" + video_metadata[0].data.filename + '.flv';
}

function GetSlidesMetadata()
{
    var script = document.createElement('script');
    script.setAttribute('src', GetSlidesMetadataUrl());
    script.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(script);
}

function OnRecieveSlidesMetadata(response)
{
	slides_metadata = eval('(' + response + ')');
	SetIndexSlidesContent();
}

function setProjectsListVisible()
{
	ClearIndexSlidesContent();
	video_player.removeEventListener('timeupdate', onVideoPlayer_TimeUpdate, false); 
	video_player.pause();
	video_player.currentTime = 0;
	video_player.poster = "";
	img.src="";
	
	last_slide_index = -1;
	main_projects_div.style.display = "block";
	main_player_div.style.display = "none";
}

function setPlayerVisible()
{
	main_projects_div.style.display = "none";
	main_player_div.style.display = "block";
}
