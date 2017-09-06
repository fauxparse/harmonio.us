require 'rails_helper'

RSpec.describe Identity, type: :model do
  subject(:identity) { create(:identity, :google) }

  it { is_expected.to be_valid }
  it { is_expected.to validate_presence_of :provider }
  it {
    is_expected
      .to validate_inclusion_of(:provider)
      .in_array(%w[facebook google twitter])
  }
  it { is_expected.to validate_uniqueness_of(:provider).scoped_to(:user_id) }
  it { is_expected.to validate_presence_of :uid }
end
