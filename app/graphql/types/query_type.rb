module Types
  QueryType = GraphQL::ObjectType.define do
    name 'Query'

    field :session, SessionType do
      description 'Details of the current logged-in user'
      resolve ->(_obj, _args, ctx) {
        UserSession.new(ctx[:authenticator])
      }
    end
  end
end
