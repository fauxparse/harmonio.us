FactoryGirl.define do
  sequence(:event_name) { |n| "Event #{n}" }

  factory :event do
    team
    name { generate(:event_name) }
    description { Faker::Lorem.paragraph }
    starts_at { Time.zone.local(2017, 7, 27, 19, 0) }
    duration 1.hour

    transient do
      count nil
    end

    after(:build) do |event, evaluator|
      event.schedule.count = evaluator.count if evaluator.count.present?
    end

    trait :weekly do
      after(:build) do |event|
        event.schedule.period = :week
      end
    end

    trait :monthly do
      after(:build) do |event|
        event.schedule.period = :month
      end
    end

    trait :last_sundays do
      monthly

      after(:build) do |event|
        event.schedule.weekdays = { sunday: -1 }
      end
    end
  end
end
