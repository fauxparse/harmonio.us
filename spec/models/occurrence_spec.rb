require 'rails_helper'

RSpec.describe Occurrence, type: :model do
  subject(:occurrence) { create(:occurrence, event: event) }
  let(:event) { create(:event) }

  it { is_expected.to be_valid }
end
