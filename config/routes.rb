Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' \
    if Rails.env.development?

  post '/graphql', to: 'graphql#execute'

  match '/auth/:provider/callback' => 'oauth#callback', via: %i[get post]

  get '/password/:token' => 'passwords#change', as: :change_password
  patch '/password/:token' => 'passwords#update'

  root to: 'application#index'
  get '*anything', to: 'application#index'
end
