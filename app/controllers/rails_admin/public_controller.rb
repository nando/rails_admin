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
      page = (params[:page] || 0).to_i
      per_page = (params[:per_page] || 20).to_i
      @objects = @abstract_model.model.order('updated_at DESC').offset(page*per_page).limit(per_page)
    end    
  end
end
