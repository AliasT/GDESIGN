module ApplicationHelper
  def get_class(target, class_name, action)
    a = ''
    a = ' ' + class_name  if session[:signed] && target.exists?(action => session[:signed].to_int)
    return a
  end


  def get_user_link(user_name)
    @u = User.where(name: user_name).take
    if @u
      return user_posts_path(@u)
    else
      return signin_path
    end
  end


  def get_new_content(r_string)
    return r_string.gsub(/@\S+/) { |m| link_to m, get_user_link(m[1..-1]), class: 'user-in-content'}
  end


end
