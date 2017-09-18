class CreateOccurrences < ActiveRecord::Migration[5.1]
  def change
    create_table :occurrences do |t|
      t.belongs_to :event, foreign_key: { on_delete: :cascade }
      t.datetime :starts_at, required: true
      t.datetime :ends_at, required: true

      t.timestamps

      t.index %i[event_id starts_at ends_at], unique: true
    end
  end
end
