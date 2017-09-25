module Types
  OccurrenceType = GraphQL::ObjectType.define do
    name 'Occurrence'
    field :event, !EventType

    field :startsAt, !DateTimeType do
      resolve ->(obj, _args, _ctx) { obj.starts_at }
    end

    field :endsAt, !DateTimeType do
      resolve ->(obj, _args, _ctx) { obj.ends_at }
    end
  end
end
