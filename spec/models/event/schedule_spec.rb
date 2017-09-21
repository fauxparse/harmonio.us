require 'rails_helper'

describe Event::Schedule do
  subject(:schedule) { event.schedule }
  let(:july) { Date.civil(2017, 7, 1) }
  let(:september) { Date.civil(2017, 9, 1) }
  let(:times) { schedule.between(july, september) }

  context 'for a single event' do
    let(:event) { create(:event) }

    describe '#between' do
      subject(:scheduled_times) { times }

      it { is_expected.to have_exactly(1).item }

      it 'contains the start time of the event' do
        expect(times).to eq [event.starts_at]
      end
    end

    describe '#count' do
      it 'is 1' do
        expect(schedule.count).to eq 1
      end
    end

    describe '#period' do
      it 'is :once' do
        expect(schedule.period).to eq :once
      end
    end
  end

  context 'for a repeating event' do
    let(:event) { create(:event, :weekly) }

    describe '#between' do
      subject(:scheduled_times) { times }

      it { is_expected.to have_exactly(6).items }

      it 'contains only the times until the end of the range' do
        expect(times).to eq((0..5).map { |n| event.starts_at + n.weeks })
      end
    end

    describe '#count' do
      it 'is nil' do
        expect(schedule.count).to be_nil
      end
    end

    describe '#period' do
      it 'is :week' do
        expect(schedule.period).to eq :week
      end
    end
  end

  context 'for an event that repeats 5 times' do
    let(:event) { create(:event, :weekly, count: 5) }

    describe '#between' do
      subject(:scheduled_times) { times }

      it { is_expected.to have_exactly(5).items }

      it 'contains only the times until the end of the range' do
        expect(times).to eq((0..4).map { |n| event.starts_at + n.weeks })
      end
    end

    describe '#count' do
      it 'is 5' do
        expect(schedule.count).to eq 5
      end
    end

    describe '#period' do
      it 'is :week' do
        expect(schedule.period).to eq :week
      end
    end
  end

  context 'when the start time is changed' do
    let(:event) { create(:event, :weekly) }

    it 'updates the schedule' do
      expect { event.update(starts_at: event.starts_at + 1.day) }
        .to change { event.schedule.start_time }
        .by(1.day)
    end
  end
end
