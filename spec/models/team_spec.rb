require 'rails_helper'

RSpec.describe Team, type: :model do
  subject(:team) { create(:team, options) }
  let(:options) { {} }

  it { is_expected.to validate_presence_of(:name) }

  context 'named ‘Dragon Army’' do
    let(:options) { { name: 'Dragon Army' } }

    describe '#to_param' do
      subject(:param) { team.to_param }
      it { is_expected.to eq 'dragon-army' }
    end
  end
end
