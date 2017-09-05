require 'rails_helper'

RSpec.describe Member, type: :model do
  subject(:member) { create(:member, team: team) }
  let(:team) { create(:team) }

  it { is_expected.to be_valid }
  it { is_expected.to validate_presence_of :name }
  it {
    is_expected.to validate_uniqueness_of(:name)
      .scoped_to(:team_id)
      .case_insensitive
  }

  context 'named ‘Hermione’' do
    subject(:member) { build(:member, name: 'Hermione', team: team) }

    context 'when there is another Hermione on the same team' do
      let!(:imposter) { create(:member, name: 'Hermione', team: team) }

      it { is_expected.not_to be_valid }
    end

    describe '#to_param' do
      subject(:param) { member.tap(&:save).to_param }

      it { is_expected.to eq 'hermione' }

      context 'when there is a Hermione on another team' do
        before do
          create(:member, name: 'Hermione')
        end

        it { is_expected.to eq 'hermione' }
      end
    end
  end

  context 'who is a registered user' do
    subject(:member) { create(:member, :registered, team: team) }
    before do
      5.times { create(:member, team: team) }
    end

    it 'cannot remove the user' do
      member.user = nil
      expect(member).not_to be_valid
      expect(member).to have_exactly(1).error_on(:user)
      expect(member.errors_on(:user)).to include(/at least one registered/)
    end

    context 'when there are other registered users on the team' do
      before { create(:member, :registered, team: team) }

      it 'can remove the user' do
        member.user = nil
        expect(member).to be_valid
      end
    end
  end

  context 'with admin privileges' do
    subject(:member) { build(:member, :admin, user: user, team: team) }
    let(:user) { create(:user) }

    context 'who is not a registered user' do
      let(:user) { nil }

      it 'is invalid' do
        expect(member).not_to be_valid
        expect(member).to have_exactly(1).error_on(:user)
        expect(member.errors_on(:user)).to include(/must be a registered user/)
      end
    end

    context 'who is the only admin on a team' do
      before { member.save! }

      it 'cannot remove the admin flag' do
        member.admin = false
        expect(member).not_to be_valid
        expect(member).to have_exactly(1).error_on(:admin)
        expect(member.errors_on(:admin)).to include(/at least one admin/)
      end
    end

    context 'when there are other admins on the team' do
      before do
        member.save!
        create(:member, :admin, :registered, team: team)
      end

      it 'can remove the admin flag' do
        member.admin = false
        expect(member).to be_valid
      end
    end
  end
end
