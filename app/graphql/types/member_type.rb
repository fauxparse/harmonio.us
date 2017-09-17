module Types
  MemberType = GraphQL::ObjectType.define do
    name 'Member'
    field :id, !types.ID
    field :name, !types.String
    field :slug, !types.String
    field :admin, !types.Boolean
    field :registered, !types.Boolean do
      resolve ->(member, _args, _ctx) {
        member.registered?
      }
    end
    field :team, !TeamType
  end
end
