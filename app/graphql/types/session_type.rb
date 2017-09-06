module Types
  SessionType = GraphQL::ObjectType.define do
    name 'Session'
    field :user, UserType
    field :errors, types[types.String]
  end
end
