class Comment < ActiveRecord::Base
  belongs_to :post
  has_many :pluses, dependent: :destroy
end
