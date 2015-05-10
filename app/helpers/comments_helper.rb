module CommentsHelper
  def get_order
    @post.comments.all.order(created_at: :desc)
  end
end
