# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170904061904) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "identities", force: :cascade do |t|
    t.bigint "user_id"
    t.string "provider", limit: 64
    t.string "uid", limit: 128
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_identities_on_provider_and_uid", unique: true
    t.index ["user_id", "provider"], name: "index_identities_on_user_id_and_provider", unique: true
    t.index ["user_id"], name: "index_identities_on_user_id"
  end

  create_table "members", force: :cascade do |t|
    t.bigint "team_id"
    t.string "name", limit: 128
    t.string "slug", limit: 64
    t.boolean "admin", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["team_id", "slug"], name: "index_members_on_team_id_and_slug", unique: true
    t.index ["team_id"], name: "index_members_on_team_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name", limit: 64
    t.string "slug", limit: 64
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_teams_on_slug", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email"
  end

  add_foreign_key "identities", "users", on_delete: :cascade
  add_foreign_key "members", "teams", on_delete: :cascade
end
