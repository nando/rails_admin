require 'rails_admin/abstract_model'

module RailsAdmin
  class ApplicationController < ::ApplicationController
    before_filter :_authenticate!
    before_filter :_authorize!
    before_filter :set_plugin_name
    before_filter :prepend_views_path
  
    helper_method :_current_user

    def prepend_views_path
      prepend_view_path "app/views/rails_admin"
    end

    def get_model
      model_name = to_model_name(params[:model_name] || params[:controller])
      @abstract_model = RailsAdmin::AbstractModel.new(model_name)
      @model_config = RailsAdmin.config(@abstract_model)
      not_found if @model_config.excluded?
      @properties = @abstract_model.properties
    end

    def to_model_name(param)
      parts = param.split("::")
      parts.map{|x| x == parts.last ? x.singularize.camelize : x.camelize}.join("::")
    end

    def get_object
      @object = @abstract_model.get(params[:id]) || @abstract_model.model.find(params[:id])
      if params[:locale] && (@object.locale != params[:locale])
        @object = @object.get_locale(params[:locale]) || @object.new_locale(params[:locale])
      end
      @master = @object.master
      @localized_object = Gloobal::LocalizedEntity.new(@object)
      not_found unless @object
    end

    private

    def _authenticate!
      instance_eval &RailsAdmin.authenticate_with
    end

    def _authorize!
      instance_eval &RailsAdmin.authorize_with
    end

    def _current_user
      instance_eval &RailsAdmin.current_user_method
    end

    def set_plugin_name
      @plugin_name = "RailsAdmin"
    end

    def not_found
      render :file => Rails.root.join('public', '404.html'), :layout => false, :status => 404
    end
  end
end
