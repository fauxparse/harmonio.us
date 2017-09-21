class AddRecurrenceRuleToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :recurrence_rule, :text
  end
end
