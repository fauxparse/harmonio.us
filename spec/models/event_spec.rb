require 'rails_helper'

RSpec.describe Event, type: :model do
  subject(:event) { create(:event) }

  it { is_expected.to be_valid }
  it { is_expected.to validate_presence_of(:name) }
  it {
    is_expected.to validate_numericality_of(:duration)
      .only_integer
      .is_greater_than(0)
  }

  describe '#schedule' do
    subject(:schedule) { event.schedule }

    it { is_expected.to be_present }
    it { is_expected.not_to be_repeating }

    it 'has the correct start time' do
      expect(schedule.start_time).to eq event.starts_at
    end

    it 'has the correct end time' do
      expect(schedule.end_time).to eq event.ends_at
    end

    it 'can be updated' do
      expect {
        event.update!(schedule_attributes: { period: :week, interval: 2 })
      }
        .to change { event.reload.schedule.period }
        .from(:once)
        .to(:week)
    end

    context 'for a weekly event' do
      let(:event) { create(:event, :weekly) }

      it { is_expected.to be_repeating }

      it 'has a weekly period' do
        expect(schedule.period).to eq :week
      end

      it 'occurs on Thursdays' do
        expect(schedule.weekdays).to eq [4]
      end

      it 'has an interval of 1' do
        expect(schedule.interval).to eq 1
      end

      it 'has no end time' do
        expect(schedule.end_time).to be_nil
      end
    end

    context 'for an event on the last Sunday of every month' do
      let(:event) { create(:event, :last_sundays) }

      it { is_expected.to be_repeating }

      it 'has a monthly period' do
        expect(schedule.period).to eq :month
      end

      it 'occurs on the last Sunday of every month' do
        expect(schedule.weekdays).to eq(0 => [-1])
      end

      it 'has an interval of 1' do
        expect(schedule.interval).to eq 1
      end

      it 'has no end time' do
        expect(schedule.end_time).to be_nil
      end

      it 'has a different start date' do
        expect(schedule.start_time).to eq(Time.zone.local(2017, 7, 30, 19, 0))
        expect(event.starts_at).to eq(schedule.start_time)
      end
    end
  end
end
