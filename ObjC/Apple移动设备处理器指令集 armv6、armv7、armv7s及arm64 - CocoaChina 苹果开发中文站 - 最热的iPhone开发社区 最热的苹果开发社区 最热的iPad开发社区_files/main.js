$(function() {
	/*2014-12-2添加微信大图是否显示*/
	$(".weixin").hover(function(){$("#returns img.weixinimg").show();},function(){$("#returns img.weixinimg").hide();});
	/*2014-12-2添加微信大图是否显示 end*/

	/*2014-12-10添加首页顶部广告位轮换js*/

	/*2014-12-10添加首页顶部广告位轮换js end*/

	$(".itemdoc img, .doccon img").css("cursor", "pointer").on("click", function() {
		var _src = $(this).attr("src");
		$('<div id="modal">'
			+'<a href="#" class="simplemodal-close" style="top:-22px;right:-10px"></a>'
			+'<img src="'+ _src +'" style="width:100%" />'
			+'</div>').modal({
				overlayClose: true,
				autoResize: true,
				onOpen: function (dialog) {
					dialog.overlay.fadeIn('fast', function () {
						dialog.container.slideDown('fast', function () {
							dialog.data.fadeIn('fast');
						});
					});
				},
				onClose: function (dialog) {
					dialog.data.fadeOut('fast', function () {
						dialog.container.slideUp('fast', function () {
							dialog.overlay.fadeOut('fast', function () {
							
							$.modal.close(); // must call this!

						});
						});
					});
				}
			});
		})

	if($("pre").length > 0) {
		$("pre").each(function() {
			if($(this).find("code").length > 0) {
				$(this).html($(this).find("code").html());
			}
			$(this).attr("class", "brush: cpp;");
		})
		SyntaxHighlighter.defaults['toolbar'] = false; 
		SyntaxHighlighter.all();
	}

	$(".docnav li h5 a").click(function() {
		var _parent = $(this).parent();
		_parent.next("ul").slideToggle(200);
		if(_parent.hasClass("active")) {
			_parent.removeClass("active");
		} else {
			_parent.addClass("active");
		}
	});
	
	$(document).on('click', '.reply', function() {
		if($(this).parent().parent().parent().hasClass("comsub")) {
			$("#subreplybox").css("padding-left", "85px").show().insertAfter($(this).parent().parent().parent());
		} else {
			$("#subreplybox").css("padding-left", "0").show().insertAfter($(this).parent().parent());
		}
		$("#top_id").val($(this).attr("data-id"));
		return false;
	});

	// 文章的赞功能
	$(document).on('click', '.favourbtn', function() {
		var _this = $(this);
		$.post("/tutorial/support_tutorial", {id: _this.attr("data-id")}, function(data) {
			if(data.status == 1) {
				_this.html("<i></i>已赞("+ data.num +")");
				_this.addClass("praised");
			} else if(data.status == 2) {
				return simModal(0);
			} else {
				if(!_this.parent().find("span.red")) {
					_this.parent().append($("<span class='fr'></span>").css({lineHeight: '28px', fontSize:'14px'}).addClass("red").html(""+data.content));
					setTimeout(function() {
						_this.parent().find(".red").remove();
					}, 1000);
				}
			}
			return false;
		}, "JSON");
		return false;
	})

	// 评论的支持和赞
	var _orOther = true;
	$(document).on('click', '.report, .praise', function() {
		if(_orOther) {
			_orOther = false;
			var _this = $(this);
			var _class = _this.attr("class");
			var _id = _this.attr("data-id");

			if(_class == "report") {
				$.post("/tutorial/support_comment", {type: 0, id: ""+_id}, function(data) {
					if(data.status == 1) {
						_this.html("已举报");
					} else if(data.status == 2) {
						return simModal(0);
					} else {
						if(!_this.parent().find(".red").length) {
							_this.parent().prepend($("<span></span>").addClass("red").html(""+data.content));
							setTimeout(function() {
								_this.parent().find(".red").remove();
							}, 1000);
						}
					}
					_orOther = true;
					return false;
				}, "JSON");
			} else if(_class == "praise") {
				$.post("/tutorial/support_comment", {type:1, id:""+_id}, function(data) {
					if(data.status == 1) {
						_this.html('<i class="grayicon graypraise"></i>支持(' + data.num +')');
						_this.addClass("praised");
					} else if(data.status == 2) {
						return simModal(0);
					} else {
						if(!_this.parent().find(".red").length) {
							_this.parent().prepend($("<span></span>").addClass("red").html(""+data.content));
							setTimeout(function() {
								_this.parent().find(".red").remove();
							}, 1000);
						}
					}
					_orOther = true;
					return false;
				}, "JSON");
			} else {
				_orOther = true;
				return false;
			}
		}
	});

	// 发表评论
	var _orCom = true;
	$("#send_comment").click(function() {
		if(_orCom) {
			_orCom = false;
			if($("#loginor").val() == 0) {
				_orCom = true;
				return simModal(0);
			}

			if($.trim($(".topreply").find("textarea").val()) == "") {
				$("#toptip").fadeIn(200);

				$(".topreply").find("textarea").on("focus", function() {
					$("#toptip").fadeOut(200);
				})
				_orCom = true;
				return false;
			}
			

			$.post("/tutorial/comment", $(".topreply").serialize(), function(data) {
				if(data.status == 1) {
					var _html = '<li>'
					+'<a class="fl"><img src="'+data.icon+'" width="48" height="48" alt="" /></a>'
					+'<div class="item">'
					+'<div class="author"><a>'+ data.username +'</a><span>1分钟前</span></div>'
					+'<div class="con">'+ data.content +'</div>'
					+'<div class="opt"><a href="javascript:void(0)" data-id="'+ data.id +'" class="report">举报</a>'
					+'<a href="javascript:void(0)" data-id="'+ data.id +'" class="praise"><i class="grayicon graypraise"></i>支持(0)</a>'
					+'<a href="javascript:void(0)" data-id="' + data.id +'" class="reply"><i class="grayicon grayreply"></i>回复(<span>0</span>)</a></div>'
					+'</div>'
					+'</li>';
					$(".comlists").prepend(_html);
					$('html, body').animate({scrollTop:$(".comments .cbttl").offset().top+'px'}, 200);
					$(".topreply")[0].reset();
				} else if(data.status == 2) {
					_orCom = true;
					return simModal(0);
				}
				else {
					$("#toptip").html(data.content).fadeIn(200);
					$(".topreply").find("textarea").on("focus", function() {
						$("#toptip").fadeOut(200);
					})
					$(".topreply").find("input").on("focus", function() {
						$("#toptip").fadeOut(200);
					})
				}

				if(data.vcode == 1) {
					window.location.reload(true);
				}
				_orCom = true;
			}, 'JSON');
}
return false;
});
	// 发表回复
	var _orReply = true;
	$("#send_reply").click(function() {
		if(_orReply) {
			_orReply = false;
			if($("#loginor").val() == 0) {
				_orReply = true;
				return simModal(0);
			}
			if($.trim($("#subreply").find("textarea").val()) == "") {
				$("#subtip").fadeIn(200);

				$("#subreply").find("textarea").on("focus", function() {
					$("#subtip").fadeOut(200);
				})
				
				_orReply = true;
				return false;
			}

			$.post("/tutorial/comment", $("#subreply").serialize(), function(data) {
				if(data.status == 1) {
					
					var _html = '<div class="comsub">'
					+'<a class="fl"><img src="'+data.icon+'" width="48" height="48" alt="" /></a>'
					+'<div class="item">'
					+'<div class="author"><a>' + data.username + '</a><span>1分钟前</span></div>'
					+'<div class="con">' + data.content + '</div>'
					+'<div class="opt"><a href="javascript:void(0)" data-id="'+ data.id +'" class="report">举报</a>'
					+'<a href="javascript:void(0)" data-id="'+ data.id +'" class="praise"><i class="grayicon graypraise"></i>支持(0)</a>'
					+'<a href="javascript:void(0)" data-id="' + data.top_id + '" class="reply"><i class="grayicon grayreply"></i>回复</a></div>'
					+'</div>'
					+'</div>';
					$("#subreplybox").parent().append(_html);
					
					$("#subreplybox").hide();
					$("#subreply")[0].reset();
					
					$("#subreplybox").parent().find(".reply span").html($("#subreplybox").parent().find(".comsub").length - 1);
				} else if(data.status == 2) {
					_orReply = true;
					return simModal(0);
				} else {
					$("#subtip").html(data.content).fadeIn(200);
					$("#subreply").find("textarea").on("focus", function() {
						$("#subtip").fadeOut(200);
					})
					$("#subreply").find("input").on("focus", function() {
						$("#subtip").fadeOut(200);
					})
				}

				if(data.vcode == 1) {
					window.location.reload(true);
				}
				_orReply = true;
			}, 'JSON')
}
return false;
})

/*$(document).scroll(function(e) {
	var _scrollTop = $(document).scrollTop();
	var _navTop = $(".breadcrumb").height()+94+40;
	var _navLeft = ($(window).width()-1000)/2;
	_navLeft = _navLeft > 0 ? _navLeft: 0;
	
	if(_scrollTop >= _navTop) {
		$(".coursenav").css({position: "fixed", left: _navLeft+"px", top: "1px"});
		if(_scrollTop >= $(document).height() - $(".footer").height() - $(".coursenav").height()) {
			$(".coursenav").css({position: "absolute", left:"0", top:$(".coursebg").height() - $(".coursenav").height() +"px"});
		}
	} else {
		$(".coursenav").css({position: "absolute", left: "0px", top: "0px"});
	}
	
	if($(".cuoursebtm").length > 0) {
		var _relatesTop = $(".cuoursebtm").offset().top;
		if(_scrollTop >= _relatesTop) {
			$(".relates").css({position: "fixed", left: _navLeft + 710 +"px", top: "0"});
			if(_scrollTop >= $(document).height() - $(".footer").height() - $(".relates").height() - 70) {
				$(".relates").css({position: "absolute", left:"0", top:$(".doc").height() - $("#sidearticle").height() - $(".relates").height() - 70 +"px"});
			}
		} else {
			$(".relates").css({position: "absolute", left: "0", top: "0px"});
		}
	}

	if(_scrollTop > 200) {
		$("#returntop").fadeIn(200);
	} else {
		$("#returntop").fadeOut(200);
	}

	if(_scrollTop >= $(".footer").offset().top - $(window).height() - 10) {
		$("#returns").css({position:"absolute", top: $(".footer").offset().top-211+"px", bottom: "inherit"});
	} else {
		$("#returns").css({position:"fixed", top: "inherit", bottom: "10px"});
	}
});*/


$("#returntop").on("click", function() {
	$('html, body').animate({scrollTop:0}, 500);
})
/*$(window).resize(function() {
	var _scrollTop = $(document).scrollTop();
	var _navTop = $(".breadcrumb").height()+94+40;
	var _navLeft = ($(window).width()-1000)/2;
	
	if(_scrollTop >= _navTop && _navLeft > 0) {
		$(".coursenav").css({left: _navLeft+"px"});
		if(parseInt($(".coursenav").css("top")) > 1) {
			$(".coursenav").css({left: "0px"});
		}
	} else {
		$(".coursenav").css({left: "0px"});
	}
	
	if($(".cuoursebtm").length > 0) {
		var _relatesTop = $(".cuoursebtm").offset().top;
		if(_scrollTop >= _relatesTop && _navLeft > 0) {
			$(".relates").css({left: _navLeft + 710 +"px"});
			if(parseInt($(".relates").css("top")) > 0) {
				$(".relates").css({left: "0"});
			}
		} else if(_scrollTop >= _relatesTop && _navLeft < 0) {
			$(".relates").css({left: "710px"});
		} else {
			$(".relates").css({left: "0"});
		}
	}
});*/
if($(".articleside").length>0)
		{
			var reTop = $(".relates").offset().top;
			function relatesFix()
			{
				/*var winH=$(window).height();
				var oScTop=$(window).scrollTop();*/
				/*if($(window).scrollTop()>=reTop+$(".relates").height()-$(window).height() && $(window).scrollTop()<$(".footer").offset().top-$(window).height())
				{
					$(".relates").css({"position":"fixed","bottom":"-35px","top":""});
				}
				else if($(window).scrollTop()>=$(".footer").offset().top-$(".relates").height())
				{
					$(".relates").css({"position":"absolute","top":$(".footer").offset().top-$(".relates").height()-$("#sidearticle").height()+67+'px',"bottom":""});
				}
				else if($(window).scrollTop() < $(".relates").height() - $(window).height())
				{
					$(".relates").css({"position":"static","bottom":"","top":""});
				}*/
				if($(window).scrollTop()>=reTop && $(window).scrollTop()<$(".footer").offset().top-$(window).height())
				{
					$(".relates").css({"position":"fixed","bottom":"","top":"0"});
				}
				else if($(window).scrollTop()>=$(".footer").offset().top-$(window).height())
				{
					$(".relates").css({"position":"absolute","top":$(".footer").offset().top-$(".relates").height()-$("#sidearticle").height()+67+'px',"bottom":""});
				}
				else 
				{
					$(".relates").css({"position":"static","bottom":"","top":""});
				}

			}
			$(window).scroll(relatesFix);
			$(window).resize(relatesFix);
		}

	//滚动后出现返回顶部的图标：
	function returnsFixed()
	{
		var oFooterTop=$(".footer").offset().top;
		if($(window).scrollTop()>200 && $(window).scrollTop()<oFooterTop-$(window).height())
		{
			$("#returntop").fadeIn(200);
			$("#returns").css({"position":"fixed","top":"","bottom":"70px"});			
		}
		else if($(window).scrollTop()>=oFooterTop-$(window).height())
		{
			$("#returntop").fadeIn(200);
			$("#returns").css({"position":"absolute","top":oFooterTop-$("#returns").height()-70+'px',"bottom":""});
		}	
		else
		{
			$("#returntop").fadeOut(200);
		}
	}
	$(window).scroll(returnsFixed);

})

// 通用的弹窗提示
function simModal(type) {
	var _ttl = '';
	var _content = '';
	
	switch(type) {
		case 0:
		{
			_ttl = "登录提示";
			_content = "您还未登录：<a href='"+ $("#loginurl").val() +"' target='_blank'>登录</a><a href='"+ $("#sso_signup_url").val() +"' target='_blank'>注册</a>";
			break;
		}
		default:
		{
			_ttl = "提示";
			_content = "无效参数。<a href='/'>返回首页</a>";
		}
	}

	$('<div id="modal">'
		+'<a href="#" class="simplemodal-close"></a>'
		+'<h2>'+ _ttl +'</h2>'
		+'<p>'+ _content +'</p>'
		+'</div>').modal({minWidth:400,minHeight:140});
	return false;
}

// 百度搜索
function search(){
	var word = $("#search_val").val();
	word = word+" site:cn.cocos2d-x.org";
	$("#word").val(word);
	return true;
}

// 统计log
function logCount(e, id) {
	$.post("/main/datalv", {"datalv": id}, function(data) {
		return true;
	});
}
// 统计首页点击量
function hitsCount(e, id) {
	$.post("/main/hitslog", {"id": id}, function(data) {
		return true;
	});
}

function download_num(d_id){
	var id=d_id;
	if(id!=""){
		$.post("/download/index",{"id":id},function(data){
			if(data.url=="error"){
				return simModal(0);
			} else {
				location.href = data.url;
			}
		},"JSON")
	}
	return false;
}

/*2014-12-10添加首页顶部广告位轮换js*/
window.onload=function(){
  var pics=document.getElementById('pics');
  var pics_pre=getbyclass(pics,'pics_pre')[0];
  var pics_next=getbyclass(pics,'pics_next')[0];
  var pics_list=getbyclass(pics,'pics_list')[0];
  var pics_ul=pics.getElementsByTagName('ul')[0];
  var pics_lis=pics_ul.getElementsByTagName('li');
  var inow=0;
  for (var i=0;i<pics_lis.length ;i++ )
  {
	  var list=document.createElement('li');
	  pics_list.appendChild(list);
  }
  var list_li=pics_list.getElementsByTagName('li');
  for (var i=0; i<list_li.length;i++ )
	{
		  list_li[i].onclick=function (){
		  inow=index(this,list_li);
		  show(inow);
		  }
		  list_li[i].onmouseover=function(){
		  	clearInterval(timer);
		  }
	}
	show(0);
	var timer=setInterval(function (){
		if (inow<pics_lis.length-1)
		{
			inow++;
		}else{
		inow=0;
		}
		show(inow);
	},6000);
	pics_pre.onclick=function (){//上一个
	if (inow>0)
	{
		inow-=1;
	}else{
	inow=pics_lis.length-1;
	}
		show(inow);
	}
    pics_next.onclick=function (){//下一个
	if (inow<pics_lis.length-1)
	{
		inow+=1;
	}else{
	inow=0;
	}
		show(inow);
	}
  
  function show(inow){
  for (var i=0;i<pics_lis.length ;i++ )
  {
	  move(pics_lis[i],{opacity:0});  
	  $(list_li[i]).addClass("opacity20")
  }
 	 move(pics_lis[inow],{opacity:100});
  	$(list_li[inow]).removeClass("opacity20")
	
	//解决IE8层的问题
	if(inow==2){
	  	$(".li01 a,.li02 a").addClass("opacity0")
	}else{
		$(".li01 a,.li02 a").removeClass("opacity0")
	}
  }
  pics.onmouseover=function(){
  pics_pre.style.display="block";
  pics_next.style.display="block";
  pics_list.style.display='block';
  clearInterval(timer);
  }
  pics.onmouseout=function(){
  timer=setInterval(function (){
		if (inow<pics_lis.length)
		{
			show(inow);
			inow++;
		}else{
		inow=0;
		}
	},6000);
  }
  pics_pre.onmouseover=function(){
  	clearInterval(timer);
  }
  pics_next.onmouseover=function(){
  	clearInterval(timer);
  }
  }
/*2014-12-10添加首页顶部广告位轮换js end*/