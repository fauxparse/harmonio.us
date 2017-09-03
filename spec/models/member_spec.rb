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
end
