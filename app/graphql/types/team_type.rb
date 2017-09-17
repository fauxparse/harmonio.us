module Types
  TeamType = GraphQL::ObjectType.define do
    name 'Team'
    field :id, !types.ID
    field :name, !types.String
    field :slug, !types.String
    field :members, !types[MemberType]

    field :member, MemberType do
      argument :id, types.String
      resolve ->(obj, args, _ctx) {
        obj.members.find_by(slug: args[:id])
      }
    end
  end
end
