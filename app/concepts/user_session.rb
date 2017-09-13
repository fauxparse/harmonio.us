class UserSession
  attr_reader :errors

  def initialize(authenticator)
    @authenticator = authenticator
    @errors = []
  end

  def user
    authenticator.current_user
  end

  def login(email, password)
    @errors = []
    authenticator.login(email, password) || login_error
    self
  end

  def logout
    @errors = []
    authenticator.logout
    self
  end

  def register(name, email, password)
    user = User.new(name: name, email: email, password: password)
    if user.save
      authenticator.auto_login(user)
    else
      @errors = user.errors.full_messages
    end
    self
  end

  def reset_password(email)
    user = User.find_by(email: email)
    user.generate_reset_password_token!
    UserMailer.reset_password(user).deliver_now
    self
  end

  private

  attr_reader :authenticator

  def login_error
    @errors = [I18n.t('login.failed')]
  end
end
