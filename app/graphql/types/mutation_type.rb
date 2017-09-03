module Types
  MutationType = GraphQL::ObjectType.define do
    name 'Mutation'

    field :logIn, SessionType do
      description 'Attempts to log in a user'
      argument :email, !types.String
      argument :password, !types.String

      resolve ->(_obj, args, ctx) {
        UserSession
          .new(ctx[:authenticator])
          .login(args[:email], args[:password])
      }
    end

    field :logOut, SessionType do
      description 'Logs the current user out'

      resolve ->(_obj, _args, ctx) {
        UserSession
          .new(ctx[:authenticator])
          .logout
      }
    end
  end
end
