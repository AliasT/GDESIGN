class User < ActiveRecord::Base
  mount_uploader :avatar, AvatarUploader, default: 'default.png'

  validates :name, presence:true
  validates :password, presence:true, confirmation: true
  validates :password_confirmation , presence: true
  has_many :followers, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :messages, dependent: :destroy
end

