class OauthController < ApplicationController
  def callback
    auto_login(user_from_oauth)
    redirect_to root_path
  end

  private

  def user_from_oauth
    identity.user
  end

  def auth_hash
    request.env['omniauth.auth']
  end

  def provider
    auth_hash.provider
  end

  def uid
    auth_hash.uid
  end

  def email
    auth_hash.info.email
  end

  def user
    @user ||=
      current_user ||
      Identity.find_by(provider: provider, uid: uid).try(:user) ||
      User.find_by(email: email) ||
      User.create!(email: email)
  end

  def identity
    @identity ||= user.identities.find_or_create_by!(
      provider: provider,
      uid: uid
    )
  end
end
