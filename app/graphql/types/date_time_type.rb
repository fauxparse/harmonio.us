module Types
  DateTimeType = GraphQL::ScalarType.define do
    name 'DateTime'
    description 'A time with timezone'

    coerce_input ->(value, _ctx) { value.to_time }
    coerce_result ->(value, _ctx) { value.iso8601 }
  end
end
