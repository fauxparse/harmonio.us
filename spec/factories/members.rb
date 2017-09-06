FactoryGirl.define do
  factory :member do
    name { Faker::Name.unique.name }
    team

    trait :registered do
      user { create(:user, name: name) }
    end

    trait :admin do
      admin true
      registered
    end
  end
end
