class CreateMembers < ActiveRecord::Migration[5.1]
  def change
    create_table :members do |t|
      t.belongs_to :team, foreign_key: { on_delete: :cascade }
      t.string :name, limit: 128, required: true
      t.string :slug, limit: 64, required: true
      t.boolean :admin, default: false

      t.timestamps

      t.index %i[team_id slug], unique: true
    end
  end
end
