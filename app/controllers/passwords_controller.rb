class PasswordsController < ApplicationController
  before_action :ensure_user_exists

  def change; end

  def update
    if user.update(user_params)
      auto_login(user)
      redirect_to root_path
    else
      render :change
    end
  end

  private

  def token
    @token ||= params[:token]
  end

  def user
    @user ||= User.load_from_reset_password_token(token)
  end

  helper_method :user, :token

  def user_params
    params.require(:user).permit(:password)
  end

  def ensure_user_exists
    redirect_to root_path unless user.present?
  end
end
