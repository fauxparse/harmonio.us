class User < ApplicationRecord
  authenticates_with_sorcery!

  has_many :identities, dependent: :destroy, autosave: true

  validates :email, presence: true, uniqueness: { case_sensitive: false }
end
