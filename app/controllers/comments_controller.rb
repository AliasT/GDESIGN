class CommentsController < ApplicationController
  layout 'posts'

  def index
    @post = Post.find(params[:post_id])
    @user = @post.user
  end


  # 新评论
  def create
    if get_sta
      @post = Post.find(params[:post_id])
      @comment = @post.comments.create(commenter: session[:signed].to_i,
                                       content: params.require(:comment).permit(:content)[:content])
      make_message(@post.user, 5, @post.id, @comment.id)
      #子评论
      if params[:refer_id]
        comment_id = params[:refer_id].to_i
        user = User.find(Comment.find(comment_id).commenter)
        make_message(user, 3, comment_id, @comment.id)
      end
      redirect_to post_comments_path(@post)
    end
  end


  #给评论顶的操作
  def plus
    @comment = Comment.find(params[:id])
    if get_sta
      if params[:m] == 'create'
        @comment.pluses.create(pluser: session[:signed].to_int)
        make_message(User.find(@comment.commenter), 4, @comment.id)
        render plain: 's'
      else
        @comment.pluses.where({ pluser: session[:signed].to_int} ).take.destroy
        render plain: 's'
      end
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    @comment.destroy
    render plain: 'c'
  end
end
