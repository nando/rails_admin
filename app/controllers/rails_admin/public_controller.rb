module RailsAdmin
  class PublicController < RailsAdmin::ApplicationController
    skip_before_filter :_authenticate!
    skip_before_filter :_authorize!
    before_filter :get_model
    before_filter :get_object

    def show
      render :action => 'rails_admin/main/show'
    end
  end
end
