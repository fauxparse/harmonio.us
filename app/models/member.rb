class Member < ApplicationRecord
  include Sluggable

  belongs_to :team
  belongs_to :user, optional: true

  validates :name, uniqueness: { scope: :team_id, case_sensitive: false }
  validates :user_id, uniqueness: { scope: :team_id, allow_blank: true }
  validates :user, presence: true, if: :admin?

  validate :cannot_remove_last_admin, if: :was_admin?
  validate :cannot_remove_last_user, if: :was_registered?

  scope :admin, -> { where(admin: true) }
  scope :registered, -> { where.not(user_id: nil) }

  private

  def cannot_remove_last_admin
    errors.add(:admin, :cannot_remove_last_admin) \
      unless other_members?(:admin)
  end

  def cannot_remove_last_user
    errors.add(:user, :cannot_remove_last_user) \
      unless other_members?(:registered)
  end

  def other_members?(scope)
    team.members.send(scope).where.not(id: id).exists?
  end

  def was_admin?
    admin_changed? && admin_was.present?
  end

  def was_registered?
    user_id_changed? && user_id_was.present? && !user_id.present?
  end
end
