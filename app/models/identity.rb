class Identity < ApplicationRecord
  belongs_to :user

  validates :provider,
    presence: true,
    uniqueness: { scope: :user_id },
    inclusion: { in: %w[facebook google twitter] }
  validates :uid,
    presence: true,
    uniqueness: { scope: :provider }
end
