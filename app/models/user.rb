class User < ApplicationRecord
  authenticates_with_sorcery!

  validates :email, presence: true, uniqueness: { case_sensitive: false }
end
