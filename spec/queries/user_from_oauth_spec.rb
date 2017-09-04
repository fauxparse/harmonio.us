require 'rails_helper'

describe UserFromOauth do
  subject(:query) { UserFromOauth.new(auth_hash, current_user) }
  let(:current_user) { nil }
  let(:auth_hash) { double }
  let(:auth_info) { double }
  let(:name) { Faker::Name.unique.name }
  let(:email) { Faker::Internet.unique.email(name) }

  before do
    allow(auth_hash).to receive(:provider).and_return provider
    allow(auth_hash).to receive(:uid).and_return uid
    allow(auth_hash).to receive(:info).and_return auth_info
    allow(auth_info).to receive(:name).and_return name
    allow(auth_info).to receive(:email).and_return email
  end

  shared_examples 'OAuth authentication' do
    context 'when there are no matching users' do
      it 'creates a user' do
        expect { query.user }.to change(User, :count).by(1)
        expect(query.user.name).to eq name
        expect(query.user.email).to eq email
      end

      it 'creates an identity record' do
        expect { query.user }.to change(Identity, :count).by(1)
        expect(query.identity.provider).to eq provider
        expect(query.identity.uid).to eq uid
      end
    end

    context 'when already authenticated' do
      let!(:existing_user) do
        create(:user).tap do |user|
          user.identities.create(provider: provider, uid: uid)
        end
      end

      it 'does not create a user' do
        expect { query.user }.not_to change(User, :count)
        expect(query.user.name).to eq existing_user.name
        expect(query.user.email).to eq existing_user.email
        expect(query.user.email).not_to eq email
      end

      it 'does not create an identity record' do
        expect { query.user }.not_to change(Identity, :count)
        expect(query.identity.provider).to eq provider
        expect(query.identity.uid).to eq uid
      end
    end

    context 'when a matching user exists' do
      before do
        create(:user, email: email)
      end

      it 'does not create a user' do
        expect { query.user }.not_to change(User, :count)
        expect(query.user.email).to eq email
      end

      it 'creates an identity record' do
        expect { query.user }.to change(Identity, :count).by(1)
        expect(query.identity.provider).to eq provider
        expect(query.identity.uid).to eq uid
      end
    end

    context 'when logged in' do
      let!(:current_user) { create(:user, email: email) }

      it 'does not create a user' do
        expect { query.user }.not_to change(User, :count)
        expect(query.user.email).to eq email
      end

      it 'creates an identity record' do
        expect { query.user }.to change { current_user.identities.count }.by(1)
        expect(query.identity.provider).to eq provider
        expect(query.identity.uid).to eq uid
      end
    end
  end

  context 'from Facebook' do
    let(:provider) { 'facebook' }
    let(:uid) { Faker::Number.number(7) }
    it_behaves_like 'OAuth authentication'
  end

  context 'from Google' do
    let(:provider) { 'google' }
    let(:uid) { Faker::Number.number(9) }
    it_behaves_like 'OAuth authentication'
  end

  context 'from Twitter' do
    let(:provider) { 'twitter' }
    let(:uid) { Faker::Number.number(6) }
    it_behaves_like 'OAuth authentication'
  end
end
