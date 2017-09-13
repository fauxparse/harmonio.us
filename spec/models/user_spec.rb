require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { create(:user) }

  it { is_expected.to validate_presence_of :email }
  it { is_expected.to validate_uniqueness_of(:email).case_insensitive }

  context 'with a bad email address' do
    subject(:user) { build(:user, email: 'wrong') }

    it { is_expected.not_to be_valid }
  end

  context 'as a member of a team' do
    subject(:user) { member.user }
    let(:member) { create(:member, :admin) }

    it 'has a team' do
      expect(user.teams).to have_exactly(1).item
    end

    it 'has an admin membership' do
      expect(user.memberships.admin).to have_exactly(1).item
    end
  end
end
