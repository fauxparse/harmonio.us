require 'rails_helper'

RSpec.describe Event, type: :model do
  subject(:event) { create(:event) }

  it { is_expected.to be_valid }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:starts_at) }
  it { is_expected.to validate_presence_of(:duration) }
  it {
    is_expected.to validate_numericality_of(:duration)
      .only_integer.is_greater_than(0)
  }
end
