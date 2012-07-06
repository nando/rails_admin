 module RailsAdmin
  class AbstractObject
    instance_methods.each { |m| undef_method m unless m =~ /(^__|^send$|^object_id$)/ }

    attr_accessor :object
    attr_accessor :associations

    def initialize(object)
      self.object = object
    end

    def attributes=(attributes)
      object.send :attributes=, attributes #, false
    end

    def method_missing(name, *args, &block)
      self.object.send name, *args, &block
    end

    def save(options = { :validate => true })
      object.save(options) and update_all_associations
    end

    protected

    def update_all_associations
      return true if associations.nil?

      abstract_model = AbstractModel.new(object.class)

      abstract_model.associations.each do |association|
        if associations.has_key?(association[:name])
          ids = associations[association[:name]]
          begin
            case association[:type]
            when :has_one
              update_association(association, ids)
            when :has_many, :has_and_belongs_to_many
              update_associations(association, ids.to_a)
            end
          rescue Exception => e
            object.errors.add association[:name], e.to_s
            return false
          end
        end
      end
    end

    def update_associations(association, ids = [])
      klass = self.class
      associated_model = RailsAdmin::AbstractModel.new(association[:child_model])
      if klass.send("#{association[:name]}_with_role?")
        through_model = (klass.class_name + association[:name].to_s.classify).constantize
        tm_assoc_name = association[:child_model].to_s.underscore
        k_name = klass.class_name.underscore
        values = ids.map{|str| str.split(':')}.collect do |pair|
          if assoc = associated_model.get(pair[0]) and role = Taxonomy.find_by_id(pair[1])
            fields = "#{k_name}_id_and_#{tm_assoc_name}_id_and_#{tm_assoc_name}_role_id"
            through_model.send "find_or_create_by_#{fields}", self.id, pair[0], pair[1]
          end
        end.compact
        object.send "#{k_name}_#{association[:name]}=", values
      else
        object.send "#{association[:name]}=", ids.collect{|id| associated_model.get(id)}.compact
      end
      object.save
    end

    def update_association(association, id = nil)
      associated_model = RailsAdmin::AbstractModel.new(association[:child_model])
      if associated = associated_model.get(id)
        associated.update_attributes(association[:child_key].first => object.id)
      end
    end
  end
end
