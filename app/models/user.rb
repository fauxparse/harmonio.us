class User < ApplicationRecord
  authenticates_with_sorcery!

  has_many :identities, dependent: :destroy, autosave: true
  has_many :memberships,
    class_name: 'Member',
    dependent: :destroy,
    autosave: true
  has_many :teams, through: :memberships

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :name, length: { maximum: 128, allow_blank: true }
end
