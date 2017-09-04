Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' \
    if Rails.env.development?

  post '/graphql', to: 'graphql#execute'

  match '/auth/:provider/callback' => 'oauth#callback', via: %i[get post]

  root to: 'application#index'
end
