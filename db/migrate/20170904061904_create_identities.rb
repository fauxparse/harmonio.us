class CreateIdentities < ActiveRecord::Migration[5.1]
  def change
    create_table :identities do |t|
      t.belongs_to :user, required: true, foreign_key: { on_delete: :cascade }
      t.string :provider, limit: 64, required: true
      t.string :uid, limit: 128, required: true

      t.timestamps

      t.index %i[provider uid], unique: true
      t.index %i[user_id provider], unique: true
    end
  end
end
