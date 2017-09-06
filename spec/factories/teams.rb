FactoryGirl.define do
  factory :team do
    name { Faker::Team.unique.name }
  end
end
