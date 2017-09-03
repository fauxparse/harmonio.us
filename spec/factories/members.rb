FactoryGirl.define do
  sequence(:member_name) { Faker::Name.unique }

  factory :member do
    name { generate(:member_name) }
    team

    trait :admin do
      admin true
    end
  end
end
