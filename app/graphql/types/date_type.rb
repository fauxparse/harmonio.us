module Types
  DateType = GraphQL::ScalarType.define do
    name 'Date'
    description 'A date'

    coerce_input ->(value, _ctx) { Date.parse(value) }
    coerce_result ->(value, _ctx) { value.to_s(:db) }
  end
end
