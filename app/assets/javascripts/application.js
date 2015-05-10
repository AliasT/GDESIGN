// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require underscore
//= require backbone-min
//= require mustache
//= require users
//= require_tree .


$(document).on('page:change', function() {
    (function(){

    })();



    (function(){
        $(document).ajaxSuccess(function() {
            setTimeout(function() {
                $('.progress-bar').css('width', '0%');
            }, 700);
        });
        $.ajaxSetup({
            xhr: function() { 
                try {
                    xhr = new window.XMLHttpRequest();
                    //进度条指示
                    xhr.onprogress = function(e) {
                        $bar = $('.progress-bar');
                        var pos = e.loaded;
                        var total = e.total;
                        $bar.css('width', pos/total * 100 + '%');
                    }
                    return xhr;
                } catch (e) {}
            }
        });
    })();


    // 禁用自动填充
    $('input').attr({'autocomplete': 'off'});

    //
    var changeStyle = function (e, classToApply, t) {
        e.preventDefault();
        var $that = $(e.target).parents('li').first();
        var href = $that.data('source');
        var method = '';
        var t = 1;
        //如果没有该类则是create请求
        if(!$that.hasClass(classToApply)) {
            method = 'create';
            t = 1;
        } else {
            method = 'delete';
            t = -1;
        }
        $.post(href, { m: method },  function (data) {
            if (data == 's') {
                $that.children('a').addClass(classToApply);
                var $span = $that.find('span').eq(1);
                var v = parseInt($span.html());
                $span.html(v + t);
                if(t==1) { $that.addClass(classToApply); }
                else { $that.removeClass(classToApply);}
            } else {
                $('body').html($(data));
            }
        });
    };


    // ajax 操作点赞
    $('.up').on('click', function(e) {
        changeStyle(e, 'al-up', '.up');
    });


    // ajax 顶你
    $('.ding span').on('click', function(e) {
        changeStyle(e, 'al-ding','.ding');
    });


    //$('.content-area').on('keypress', function(e) {
    //  var l = $(this).text().length;
    //  var d = $(this).children('div').length;
    //  if(l > 100 || d > 1) {
    //      $(this).css('overflow-y', 'scroll');
    //  }
    //});


    $('.sub-comment').on('click', function(e) {
        $('.sub-form').remove();
        var $target = $(e.target);
        var href = $target.attr('href');
        e.preventDefault();
        //复制评论表单
        $('.comment-form')
            .clone()
            .addClass('sub-form clearfix')
            .appendTo($target.parents('.list-group-item'))
            .hide()
            .slideDown();
        var link = $('.sub-form').siblings('.comment-content').find('a').first().html();
        $('.sub-form').find('input[type="submit"]').val('回复');
        $('.sub-form').find('input[type="text"]').val('回复@' + link + ' :');
        var a = $('.sub-form form').attr('action');
        $('.sub-form form').attr('action', a + '?refer_id=' + href.match(/\d+/)[0]);
    });


   // ajax删除
    $('.delete').on('click', function(e) {
         e.preventDefault();
         var $t = $(e.target);
         var href = $t.attr('href');
         $.post(href, { _method: 'delete' }, function(d) {
            $t.parents('.list-group-item').slideUp(function() {
                $(this).remove();
                if(d == 's') {
                    var text = $('.posts-count').html().match(/\d+/);
                    $('.posts-count').html('发布 ' + (parseInt(text) - 1));
                } else {
                    var text = $('.comment').html();
                    $('.comment').html(text.replace(/\d+/, function(m) { return parseInt(m) - 1; }))
                }
            });
         });
    });


    $('.delete-msg').on('click', function(e) {
         var $t = $(e.target);
         var href = $t.attr('href');
         $.post(href, { msg_id: $t.data('id') } , function(data) {
             if(data == 's') {
                 $t.parents('.list-group-item').slideUp(function() {
                     $(this).remove();
                 });
             }
         });
    });


    // search
    var $search = $('.navbar-form input[type="text"]');
    $search.on('keyup', function() {
        $('.users-list').remove();
        var value = $(this).val();
        $.post('/users/search', { s: value }, function(data) {
            // format: json
            var $users_list = $('<ul class="list-group users-list"></ul>');
            var l = '';
            $.each(data, function(i, v) {
                l += '<li class="list-group-item">' + '<a href=/users/' + v.id + '/posts>' + v.name + '</a></li>'
            });
            $(l).appendTo($users_list);
            $users_list.appendTo($('.navbar-form'));
        });
    });


    //移除搜索表单
    $('.users-list').click(function() {
       $(this).remove();
    });


    // 更改图片按钮
    $('img.form-control').click(function(e) {
        $('#user_avatar').click();
    });

    
    // 图片本地显示
    var wUC = window.URL.createObjectURL;
    $('#user_avatar').change(function(e) {
        var file = e.target.files[0];
        var url = wUC(file);
        $('img.form-control').attr('src', url);
    });


    //登录页面动画过渡
    var sign = parseInt($('.data-sign').html());
    if(sign == -1) {
        $('.form-container').addClass('data-sign-1');
    }
    sign = sign == 0 ? -1 : 0;
    $('.sign').click(function() {
        $('.form-container').animate({
            left: sign * 100 + '%'
        }, {
            duration: 500,
            complete: function() {
                sign = sign == 0 ? -1 : 0;
            },
            easing: 'easeOutSine'
        });
    });


    //导航链接样式
    $('.navbar-nav a').hover(function() {
        $(this).toggleClass('nav-link');
    });


    //表单前端验证
    (function() {
        var $input = $('.middle-form .validate-input input').not('.btn');
        var $ok = $('<span class="glyphicon glyphicon-ok user-right"></span>');
        var $remove = $('<span class="glyphicon glyphicon-remove user-wrong"></span>');
        
        $input.blur(function(e) {
            var icon = [$ok, $remove];
            var $t = $(e.target);
            var $target = $t.parent('.form-group');
            var t = $input.attr('type') == 'password' ? 'p' : 'n';
            var value = $(this).val();
            // -t password or
            if($t.val() != '') {
                $.post('/users/search', { s: value, _t: t }, function(data) {
                    $target.find('.glyphicon').remove();
                    if($t.hasClass('new-user-name')) { icon.reverse(); }
                    if(data == 's') {
                        $target.append(icon[0].clone());
                    } else {
                        $target.append(icon[1].clone());
                    } 
                });
            }
        });

        $('.middle-form .btn').click(function(e) {
            e.preventDefault();
            console.log('a');
            var $target = $(e.target).parents('form');
            var count = $target.find('.glyphicon-ok').length;
            if(count > 1 || (count == 1 && $target.find('.new-user-name').length == 1 ) {
                setTimeout(function() {
                    $target.submit();
                }, 400);
            }
        });
    })();

    // 发布ajax 获取渲染后的html
    (function() {
        $('#post_content').on('keyup', function() {
            var $submit = $(this).siblings('input[type="submit"]');
            $submit.removeAttr('disabled');
            if($(this).val() == '') {
                $submit.attr('disabled', 'disabled');
            }
        });
        $('#new_post').on('submit', function(e) {
            e.preventDefault();
            var href = $(this).attr('action');
            var text = $('.posts-count').html();
            $.post(href, { post: { content: $('#post_content').val() }}, function(data) {
                $(data).prependTo($('.col-md-6').children('.list-group')).hide().fadeIn();
                $('.posts-count').html(text.replace(/\d+/, function(m) {
                    return parseInt(m) + 1;
                }));
            });
        })
    })();
    
});