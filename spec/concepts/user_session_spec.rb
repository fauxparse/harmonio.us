require 'rails_helper'

RSpec.describe UserSession do
  subject(:session) { UserSession.new(authenticator) }
  let(:authenticator) { double }
  let(:user) { nil }

  before do
    allow(authenticator).to receive(:current_user).and_return(user)
  end

  describe '#user' do
    subject(:logged_in_user) { session.user }

    context 'when logged out' do
      it { is_expected.to be_nil }
    end

    context 'when logged in' do
      let(:user) { create(:user) }

      it { is_expected.to eq user }
    end
  end

  describe '#login' do
    subject(:login) { session.login(email, password) }
    let(:email) { Faker::Internet.email }
    let(:password) { Faker::Internet.password }

    before do
      expect(authenticator)
        .to receive(:login)
        .with(email, password)
        .and_return(user)
    end

    context 'when successful' do
      let(:user) { create(:user, email: email, password: password) }

      it { is_expected.to eq session }

      it 'has no errors' do
        login
        expect(session.errors).to be_empty
      end
    end

    context 'when unsuccessful' do
      it { is_expected.to eq session }

      it 'has an error' do
        login
        expect(session.errors).to have_exactly(1).item
      end
    end
  end

  describe '#logout' do
    subject(:logout) { session.logout }

    before do
      expect(authenticator).to receive(:logout)
    end

    it { is_expected.to eq session }

    it 'has no errors' do
      logout
      expect(session.errors).to be_empty
    end
  end

  describe '#register' do
    subject(:register) { session.register(name, email, password) }
    let(:name) { Faker::Name.name }
    let(:email) { Faker::Internet.email(name) }
    let(:password) { Faker::Internet.password }

    context 'when successful' do
      before do
        expect(authenticator)
          .to receive(:auto_login)
          .with(an_instance_of(User))
      end

      it { is_expected.to eq session }

      it 'has no errors' do
        register
        expect(session.errors).to be_empty
      end
    end

    context 'when unsuccessful' do
      before do
        create(:user, name: name, email: email, password: password)
      end

      it { is_expected.to eq session }

      it 'has an error' do
        expect(authenticator).not_to receive(:auto_login)
        register
        expect(session.errors).to have_exactly(1).item
      end
    end
  end
end
