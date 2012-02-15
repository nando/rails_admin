module RailsAdmin
  class PublicController < RailsAdmin::ApplicationController
    skip_before_filter :_authenticate!
    skip_before_filter :_authorize!
    before_filter :get_model
    before_filter :get_object, :only => :show

    def show
      render :action => 'rails_admin/main/show'
    end

    def index
      @objects = @abstract_model.model.order('updated_at DESC').limit(10)
    end    
end
