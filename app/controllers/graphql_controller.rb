class GraphqlController < ApplicationController
  def execute
    render json: query_result
  end

  private

  def query_result
    HarmonioSchema.execute(
      graphql_query,
      variables: query_variables,
      context: query_context
    )
  end

  def graphql_query
    params[:query]
  end

  def query_variables
    ensure_hash(params[:variables])
  end

  def query_context
    { authenticator: self }
  end

  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      ambiguous_param.present? ? ensure_hash(JSON.parse(ambiguous_param)) : {}
    when Hash, ActionController::Parameters then ambiguous_param
    when nil then {}
    else raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end
end
