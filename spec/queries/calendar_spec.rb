require 'rails_helper'

describe Calendar do
  subject(:calendar) { Calendar.new(user, start, stop) }
  let(:member) { create(:member, :registered) }
  let(:team) { member.team }
  let(:user) { member.user }
  let(:start) { Date.new(2017, 7, 1) }
  let(:stop) { Date.new(2017, 8, 1) }

  let!(:one_off) do
    create(:event, team: team)
  end

  let!(:weekly) do
    create(
      :event,
      :weekly,
      team: team,
      starts_at: Time.zone.local(2017, 6, 30, 19)
    )
  end

  let!(:past) do
    create(
      :event,
      team: team,
      starts_at: Time.zone.local(2016, 1, 1, 19),
      schedule_attributes: {
        period: :week,
        until: Time.zone.local(2017, 1, 1)
      }
    )
  end

  let!(:future) do
    create(
      :event,
      :weekly,
      team: team,
      starts_at: Time.zone.local(2017, 8, 4, 19)
    )
  end

  it { is_expected.to have_exactly(5).items }

  describe '#events' do
    subject(:events) { calendar.events }

    it { is_expected.to include one_off }
    it { is_expected.to include weekly }
    it { is_expected.not_to include past }
    it { is_expected.not_to include future }
  end

  describe '#occurrences' do
    subject(:occurrences) { calendar.occurrences }

    it { is_expected.to have_exactly(5).items }

    it 'is in order' do
      times = occurrences.map(&:starts_at)
      expect(times).to eq times.sort
    end
  end

  describe '#to_h' do
    subject(:hash) { calendar.to_h }

    it 'is keyed by date' do
      dates = calendar.map { |o| o.starts_at.to_date }.uniq
      expect(hash.keys).to match_array dates
    end
  end
end
