class FollowersController < ApplicationController
  layout 'posts'
  def index
    @user = User.find(params[:user_id])
  end


  def create
    if get_sta
      get_user.followers.create(fid: session[:signed])
      redirect_to get_refer_url
    end
  end


  def destroy
    get_user.followers.find(params[:id]).destroy
    redirect_to get_refer_url
  end

  private
    def get_user
      User.find(params[:user_id])
    end

    def get_refer_url
      request.referer
    end  
end
