FactoryGirl.define do
  factory :occurrence do
    event
    starts_at { event.starts_at }
  end
end
