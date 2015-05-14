class Post < ActiveRecord::Base
  mount_uploader :img, ImgUploader
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :ups, dependent: :destroy
end
