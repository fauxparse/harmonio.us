FactoryGirl.define do
  factory :identity do
    transient do
      auth_hash { Faker::Omniauth.unique.send(provider) }
    end

    user
    uid { auth_hash[:uid] }

    trait :facebook do
      provider 'facebook'
    end

    trait :google do
      provider 'google'
    end

    trait :twitter do
      provider 'twitter'
    end
  end
end
