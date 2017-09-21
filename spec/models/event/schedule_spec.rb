require 'rails_helper'

describe Event::Schedule do
  subject(:schedule) { event.schedule }
  let(:july) { Date.new(2017, 7, 1) }
  let(:september) { Date.new(2017, 9, 1) }
  let(:times) { schedule.between(july, september) }
  let(:dates) { times.map(&:to_date) }

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

  context 'for a weekly event' do
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

    context 'on Mondays and Thursdays' do
      before { event.update!(schedule_attributes: { weekdays: [1, 4] }) }

      it 'generates the correct dates' do
        expect(dates).to eq [
          Date.new(2017, 7, 27),
          Date.new(2017, 7, 31),
          Date.new(2017, 8, 3),
          Date.new(2017, 8, 7),
          Date.new(2017, 8, 10),
          Date.new(2017, 8, 14),
          Date.new(2017, 8, 17),
          Date.new(2017, 8, 21),
          Date.new(2017, 8, 24),
          Date.new(2017, 8, 28),
          Date.new(2017, 8, 31)
        ]
      end

      it 'reloads correctly' do
        reloaded = Event.find(event.id)
        expect(reloaded.schedule.between(july, september))
          .to eq times
      end
    end

    context 'that repeats until 11 August' do
      before do
        event.update!(schedule_attributes: { until: Date.new(2017, 8, 11) })
      end

      it 'has 3 dates' do
        expect(dates).to eq [
          Date.new(2017, 7, 27),
          Date.new(2017, 8, 3),
          Date.new(2017, 8, 10)
        ]
      end

      it 'has no events in September' do
        expect(schedule.between(september, september + 1.month))
          .to be_empty
      end
    end

    context 'that repeats 5 times' do
      before { event.update!(schedule_attributes: { count: 5 }) }

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

        it 'can be set to 1' do
          expect { event.update(schedule_attributes: { count: 1 }) }
            .to change { event.schedule.repeating? }
            .from(true)
            .to(false)
        end
      end

      describe '#period' do
        it 'can be set to :once' do
          expect { event.update(schedule_attributes: { period: :once }) }
            .to change { event.schedule.repeating? }
            .from(true)
            .to(false)
            .and change { event.schedule.count }
            .from(5)
            .to(1)
        end
      end
    end
  end

  context 'for a monthly event' do
    context 'by day of month' do
      let(:event) do
        create(:event, schedule_attributes: { period: :month })
      end

      it 'repeats monthly' do
        expect(times).to eq((0..1).map { |n| event.starts_at + n.months })
      end
    end

    context 'by weekdays' do
      let(:event) do
        create(
          :event,
          schedule_attributes: {
            period: :month, weekdays: { friday: [-1], monday: [2, 4] }
          }
        )
      end

      it 'changes the start date' do
        expect(event.starts_at.to_date).to eq(Date.new(2017, 7, 28))
      end

      it 'repeats on the correct dates' do
        expect(dates).to eq [
          Date.new(2017, 7, 28),
          Date.new(2017, 8, 14),
          Date.new(2017, 8, 25),
          Date.new(2017, 8, 28)
        ]
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
