module Sluggable
  extend ActiveSupport::Concern

  included do
    acts_as_url :name, sluggable_options

    validates :name,
      presence: true,
      length: { in: 2..64, allow_blank: true }

    alias_method :to_param, :slug
  end

  module ClassMethods
    def random_deduplicator
      Enumerator.new { |enum| loop { enum.yield rand(10_000..99_999) } }
    end

    def sluggable_options
      {
        url_attribute: :slug,
        limit: 32,
        only_when_blank: true,
        duplicate_sequence: random_deduplicator,
        scope: column_names.include?('team_id') && :team_id
      }
    end
  end
end
