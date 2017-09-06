module Types
  TeamType = GraphQL::ObjectType.define do
    name 'Team'
    field :id, !types.ID
    field :name, !types.String
    field :slug, !types.String
    field :members, !types[MemberType]
  end
end
