class Team < ApplicationRecord
  include Sluggable

  has_many :members, dependent: :destroy
end
