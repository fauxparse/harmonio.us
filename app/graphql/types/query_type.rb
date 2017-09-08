module Types
  QueryType = GraphQL::ObjectType.define do
    name 'Query'

    field :session, SessionType do
      description 'Details of the current logged-in user'
      resolve ->(_obj, _args, ctx) {
        UserSession.new(ctx[:authenticator])
      }
    end

    field :teams, types[TeamType] do
      description 'Teams of which the current user is a member'
      resolve ->(_obj, _args, ctx) {
        user = ctx[:authenticator].current_user
        user ? user.memberships.includes(:team).map(&:team) : []
      }
    end

    field :team, TeamType do
      description 'A team'
      argument :id, types.ID
      resolve ->(_obj, args, ctx) {
        user = ctx[:authenticator].current_user
        user && user.teams.find_by(slug: args[:id])
      }
    end
  end
end
