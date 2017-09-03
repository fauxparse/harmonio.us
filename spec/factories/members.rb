FactoryGirl.define do
  factory :member do
    name { Faker::Name.unique.name }
    team

    trait :admin do
      admin true
    end
  end
end
