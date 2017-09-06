class UserFromOauth
  def initialize(auth_hash, current_user = nil)
    @auth_hash = auth_hash
    @current_user = current_user
  end

  def user
    identity.user
  end

  def identity
    @identity ||= find_or_create_user.identities.find_or_create_by!(
      provider: provider,
      uid: uid
    )
  end

  private

  attr_reader :auth_hash, :current_user

  def provider
    auth_hash.provider
  end

  def uid
    auth_hash.uid
  end

  def name
    auth_hash.info.name
  end

  def email
    auth_hash.info.email
  end

  def find_or_create_user
    @user ||=
      current_user ||
      Identity.find_by(provider: provider, uid: uid).try(:user) ||
      User.find_by(email: email) ||
      User.create!(name: name, email: email)
  end
end
