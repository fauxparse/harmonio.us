module Types
  EventType = GraphQL::ObjectType.define do
    name 'Event'
    field :id, !types.ID
    field :name, !types.String
    field :slug, !types.String
    field :description, !types.String
    field :team, !TeamType
  end
end
