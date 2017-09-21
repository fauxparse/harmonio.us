require 'rails_helper'

describe Event::Occurrences do
  subject(:occurrences) { event.occurrences }
  let(:list) do
    occurrences.between(
      event.starts_at.beginning_of_day,
      event.starts_at.beginning_of_day + 1.month
    )
  end

  context 'for a single event' do
    let(:event) { create(:event) }

    it 'has a single occurrence' do
      expect(list).to have_exactly(1).item
    end

    context 'when saved and reloaded' do
      it 'picks the same occurrences' do
        list.map(&:save!)
        expect(event.reload.occurrences.first).to be_persisted
      end
    end
  end

  context 'for a repeated event' do
    let(:event) { create(:event, :weekly, count: 3) }

    it 'has three occurrences' do
      expect(list).to have_exactly(3).items
    end

    it 'prunes old occurrences when the schedule changes' do
      list.each(&:save)
      expect { event.update!(schedule_attributes: { period: :month }) }
        .to change { event.existing_occurrences.count }
        .by(-2)
        .and not_change { event.existing_occurrences.reload.first.id }
    end
  end
end
