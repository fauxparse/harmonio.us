FactoryGirl.define do
  sequence(:event_name) { |n| "Event #{n}" }

  factory :event do
    team
    name { generate(:event_name) }
    description { Faker::Lorem.paragraph }
    starts_at { Time.zone.local(2017, 7, 27, 19, 0) }
    duration 1.hour
  end
end
