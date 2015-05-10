class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def get_sta
    if !session[:signed]
      session[:refer_url] = request.referer
      flash[:msg] = '请先登录'
      redirect_to users_path
      return false
    else
      return true
    end
  end


  # 根据类型生成message
  # message_type 调用时确定
  # 1 赞post
  # 2 post直接@
  # 3 评论回复
  def make_message(user, message_type, resource_id, target_id=nil)
    user.messages.create(m_type: message_type, r_id: resource_id, t_id: target_id, from_id: session[:signed].to_int)
  end


  def validate_user(r_name)
    @u = User.where(name: r_name).take
    if @u
      return @u
    else
      return nil
    end
  end


  def get_users(r_string)
    a = []
    r_string.gsub(/@\S+/) {|m| a.push(validate_user(m[1..-1]))}
    return a
  end


  def send_to_all(r_string, message_type, resource_id)
    users = get_users(r_string)
    users.each do |u|
      if u
        make_message(u, message_type, resource_id)
      end
    end
  end
end