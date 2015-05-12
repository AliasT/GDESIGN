class UsersController < ApplicationController

  # render不会重新请求
  # index 登录页面 get
  layout 'posts'
  def index
    @user = User.new
    @sign = 0
  end


  # 如果找到一个记录
  # 设置cookie跳转至主界面
  # 否则重定向至登录界面和提示注册
  def signin
    @user = User.where('name = ? and password = ?', user_params[:name], user_params[:password]).take
    if @user
      session[:signed] = @user[:id]
      # 将跳转的url缓存, 然后删除
      url = session[:refer_url]
      if url
        session[:refer_url] = nil
        redirect_to url
      else
        redirect_to @user
      end
    else
      flash[:msg] = '用户名或密码错误'
      redirect_to users_path
    end
  end


  # 新建用户
  def create
    @s = User.exists?(name: user_params[:name])
    @sign = -1
    if @s
    #存在
      flash[:msg1] = '用户名已存在'
      redirect_to users_path
    else
      @p = params.require(:user).permit(:name, :password, :password_confirmation)
      @user = User.new(@p)
      if @user.save
        @user.followers.create(fid: @user[:id])
        session[:signed] = @user[:id]
        flash[:msg1] = '注册成功'
        @sign = 0
        redirect_to users_path
      else
        render :index
      end
    end
  end



  # 注册页面 get
  def new
    @user = User.new
  end


  # 更新信息页面
  def edit
    @user = User.find(params[:id])
  end


  # 展示用户主界面,该界面显示所有关注对象和自己的post
  # 只要用户未登录，就跳转至显示页面，不显示特殊部件
  def show
    if session[:signed].to_s != params[:id].to_s
      redirect_to user_posts_path(params[:id])
    end
    @user = User.find(params[:id])
    @p = Post.find_by_sql ['SELECT posts.* FROM posts, followers WHERE posts.user_id = followers.user_id and 
                           followers.fid = ? order by created_at desc', @user[:id]]
  end


  # put：更新动作由　edit 而来
  def update
    @user = User.find(params[:id])
    @user.avatar = params[:user][:avatar]
    @user.name = params[:user][:name]
    @user.save(validate: false)
    redirect_to edit_user_path(@user)
  end


  # 注销过程
  def signout
    session[:signed] = nil
    redirect_to users_path
  end


  def messages
    if get_sta
      @user = User.find(params[:id])
      if params[:msg_id]
        msg_id = params[:msg_id].to_i
        @user.messages.find(msg_id).destroy
        render plain: 's'
      else
        render 'show_messages'
      end  
    end
  end


  def search
    key_word = params[:s]
    #前端验证
    if params[:_t]
      if params[:_t] == 'n'
        @user = User.where({ name: key_word }).take
        if @user
          session[:temp_user] = @user
          render plain: 's'
        else 
          render plain: 'f'
        end
      else
        if @user.password == key_word
          render plain: 's'
        else
          render plain: 'f'
        end
      end

    #用户名搜索  
    else
      @users = User.where("name like '%#{key_word}%'")
      render json: @users.to_json(only: [:name, :id])
    end
  end


  #健壮参数
  private
    def user_params
      params.require(:user).permit(:name, :password)
    end
end
