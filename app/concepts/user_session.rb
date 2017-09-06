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

  private

  attr_reader :authenticator

  def login_error
    @errors = [I18n.t('login.failed')]
  end
end
