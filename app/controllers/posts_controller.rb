class PostsController < ApplicationController
  helper PostsHelper
  layout 'posts'

  
  def create
    @user = get_user
    @post = @user.posts.new
    @post.content = params[:post][:content]
    @post.img = params[:post][:img]
    @post.save()
    send_to_all(@post.content, 2, @post.id)
    render template: 'users/_post_list', locals: { post: @post }, layout: false
  end


  def index
    @user = get_user
    if params[:offset]
      @posts = get_more_posts(offset: params[:offset].to_i * 10)
      render template: 'users/p', layout: false
    else
      @posts = get_more_posts
    end
  end


  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    render plain: 's'
  end


  def ups
    # 找到并加一
    if get_sta
      @post = Post.find(params[:id])
      if params[:m] == 'create'
        @post.ups.create(uper: session[:signed].to_int)
        make_message(@post.user, 1, @post.id)
        render plain: 's'
      else
        @post.ups.where({ uper: session[:signed].to_int }).take.destroy
        render plain: 's'
      end
    end
  end


  def hot
    @posts = Post.all.sort { |x, y| x.comments.count + x.ups.count <=> y.comments.count + y.ups.count }.reverse
  end


  private
    def get_user
      User.find(params[:user_id])
    end

    def get_more_posts(offset: 0)
      @user.posts.order(created_at: :desc).limit(10).offset(offset)
    end

end
