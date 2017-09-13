class UserMailer < ApplicationMailer
  default from: 'noreply@harmonio.us'

  def reset_password(user)
    @user = user
    mail to: user.email
  end
end
