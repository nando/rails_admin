require 'rails_admin/config/fields/base'

module RailsAdmin
  module Config
    module Fields
      module Types
        class Text < RailsAdmin::Config::Fields::Base
          # Register field type for the type loader
          RailsAdmin::Config::Fields::Types::register(self)

          @column_width = 250
          @searchable = true

          # CKEditor is enabled by default
          register_instance_option(:ckeditor) do
            true
          end

          # If you want to have a different toolbar configuration for CKEditor
          # create your own custom config.js and override this configuration
          register_instance_option(:ckeditor_config_js) do
            "/javascripts/ckeditor/config.js"
          end
        end
      end
    end
  end
end
