class OauthController < ApplicationController
  def callback
    auto_login(user_from_oauth)
    redirect_to root_path
  end

  private

  def user_from_oauth
    UserFromOauth.new(auth_hash, current_user).user
  end

  def auth_hash
    request.env['omniauth.auth']
  end
end
