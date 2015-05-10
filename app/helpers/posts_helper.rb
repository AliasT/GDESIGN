module PostsHelper
  def get_u
    if session[:signed]
      return User.find(session[:signed])
    end
  end

  # user_id must be an integer
  # return format json
  def query_post(u_id, list_len)
    Post.find_by_sql ['SELECT posts.* FROM posts, followers WHERE posts.user_id = followers.user_id and
                           followers.fid = ? order by created_at desc', u_id]
  end
end
