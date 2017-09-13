class User < ApplicationRecord
  authenticates_with_sorcery!

  has_many :identities, dependent: :destroy, autosave: true
  has_many :memberships,
    class_name: 'Member',
    dependent: :destroy,
    autosave: true
  has_many :teams, through: :memberships

  validates :name, length: { maximum: 128, allow_blank: true }
  validates :email,
    presence: true,
    format: {
      with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, allow_blank: true
    },
    uniqueness: { case_sensitive: false }
end
