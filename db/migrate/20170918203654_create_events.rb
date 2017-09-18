class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events do |t|
      t.belongs_to :team, foreign_key: { on_delete: :cascade }
      t.string :name, limit: 128, required: true
      t.string :slug, limit: 128, required: true
      t.text :description
      t.datetime :starts_at, required: true
      t.datetime :ends_at
      t.integer :duration, default: 1.hour, required: true

      t.timestamps

      t.index %i[starts_at ends_at]
    end
  end
end
