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
        $(document).ajaxSuccess(function() {
            setTimeout(function() {
                $('.progress-bar').css('width', '0%');
            }, 400);
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
                        $bar.css('width', pos / total * 100 + '%');
                    }
                    xhr.upload.onprogress = function() {
                        console.log('1');
                    }
                    return xhr;
                } catch (e) {}
            }
        });
    })();


    // 禁用自动填充
    $('input').attr({'autocomplete': 'off'});

    //
    var changeStyle = function (e, classToApply, signal) {
        e.preventDefault();
        var $that = $(this);
        var href = $that.attr('href');
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
                $that.addClass(classToApply);
                var $span = $that.find('span').eq(1);
                var v = parseInt($span.html());
                $span.html(v + t);
                $span.addClass('popover-count');
                setTimeout(function() {
                    $span.removeClass('popover-count');
                }, 1000);
                if(t==1) { 
                    $that.addClass(classToApply);

                }
                else {
                    $that.removeClass(classToApply);
                }
            } else {
                $('body').html($(data));
            }
        });
    };


    // ajax 操作点赞
    $('.up').on('click', function(e) {
        changeStyle.call(this, e, 'al-up', '.up');
    });


    // ajax 顶你
    $('.ding').on('click', function(e) {
        changeStyle(e, 'al-ding','.ding');
    });


    $('.sub-comment').on('click', function(e) {
        $('.sub-form').remove();
        var $target = $(this);
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
         var $t = $(this);
         var href = $t.attr('href');
         $.post(href, { _method: 'delete' }, function(d) {
            $t.parents('.list-group-item').slideUp({
                easing: 'easeInOutBounce',
                complete: function() {
                    $(this).remove();
                    if(d == 's') {
                        var text = $('.posts-count').html().match(/\d+/);
                        $('.posts-count').html('发布 ' + (parseInt(text) - 1));
                    } else {
                        var text = $('.comment').html();
                        $('.comment').html(text.replace(/\d+/, function(m) { return parseInt(m) - 1; }))
                    }
                }
            });
         });
    });


    $('.delete-msg').on('click', function(e) {
         var $t = $(this);
         var href = $t.attr('href');
         console.log(href);
         $.post(href, { msg_id: $t.data('id') } , function(data) {
             if(data == 's') {
                 $t.parents('.list-group-item').first().slideUp({
                    complete: function() {
                        $(this).remove();
                    },
                    easing: 'easeInOutBounce'
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
    var getImg = function(source, $target) {
        var url = window.URL.createObjectURL(source);
        $target.attr('src', url);
    }

    $('#user_avatar').change(function(e) {
        file = e.target.files[0];
        getImg(file, $('img.form-control'));
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
            var $target = $(this).parents('form');
            var t = setInterval(function() {
                var count = $target.find('.glyphicon-ok').length;
                if(count > 1 || (count == 1 && $target.find('.new-user-name').length == 1 )) {
                    clearInterval(t);
                    $target.submit();
                }
            }, 100);
        });
    })();

    // 发布ajax 获取渲染后的html
    (function() {
        $('#post_content').on('keyup', function() {
            var $submit = $(this).siblings('.form-group').children('button[type="submit"]');
            $submit.removeAttr('disabled');
            if($(this).val() == '') {
                $submit.attr('disabled', 'disabled');
            }
        });
        var img ;
        $('#post_img').on('change', function(e) {
            $(this).siblings('img').remove();
            $(this).siblings('button').removeAttr('disabled');
            var $that = $(this);
            var $img = $('<img src="">');
            var file = e.target.files[0];
            img = file;
            getImg(file, $img);
            $img.prependTo($that.parent('.form-group'));
            $(this).siblings('button').css('marginTop', '15px');
        });

        $('#new_post').on('submit', function(e) {
            e.preventDefault();
            var href = $(this).attr('action');
            var $that = $(this);
            var data = new FormData($that.get(0))
            var text = $('.posts-count').html();
            // $.post(href, data , function(data) {
            //     $(data).prependTo($('.col-md-6').children('.list-group')).hide().fadeIn();
            //     $('.posts-count').html(text.replace(/\d+/, function(m) {
            //         return parseInt(m) + 1;
            //     }));
            // });

            $.ajax({
                url: href,
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    $(data).prependTo($('.col-md-6').children('.list-group')).hide().fadeIn();
                    $('.posts-count').html(text.replace(/\d+/, function(m) {
                        return parseInt(m) + 1;
                    }));
                }
            })

        })
    })();
    
});