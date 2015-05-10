class FollowsController < ApplicationController
  layout 'posts'
  def index
    @user = User.find(params[:user_id])
  end  
end
