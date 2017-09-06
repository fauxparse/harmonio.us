module Types
  MembershipType = GraphQL::ObjectType.define do
    name 'Membership'
    field :id, !types.ID
    field :team, !TeamType
    field :admin, !types.Boolean
  end
end
