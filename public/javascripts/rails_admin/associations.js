var associations_buffer = []
document.observe("dom:loaded", function() {
  var counter = 0;

  $$(".firstSelect").each(function(elem){
    elem.writeAttribute('ref',counter);
    associations_buffer[counter] = []

    elem.childElements().each(function(e){
      associations_buffer[counter].push([e.innerHTML,e.readAttribute('value')])
    })

    counter += 1;
  })

  $$(".searchMany").each(function(elem){
    Event.observe(elem,'focus',function(e){
      var used = e.target.readAttribute('used');

      if(used=="0"){
        e.target.setStyle({color:"#000"});
        e.target.writeAttribute('used','1');
        e.target.value = ""
      }
    })

    Event.observe(elem,'blur',function(e){
      var text = e.target.value;
      var used = e.target.readAttribute('used');
      var assoc = e.target.readAttribute('ref');

      if(text.length == 0){
        e.target.setStyle({color:"#AAA"});
        e.target.writeAttribute('used','0');
        e.target.value = "Search " + assoc
      }
    })

    Event.observe(elem,'keyup',function(e){
      var select = elem.parentNode.parentNode.childElements()[1].childElements()[0];
      var select_two = elem.parentNode.parentNode.childElements()[1].childElements()[3]
      var aux = []
      var ref = select.readAttribute('ref')
      var text = e.target.value.toLowerCase();
      function already_selected(value){
        var selected;
        select_two.childElements().each(function(e){
          selected = e.readAttribute('value') == value;
          if(selected) throw $break;
        })
        return(selected);
      }
      associations_buffer[ref].each(function(ev){
        if(ev[0].toLowerCase().indexOf(text)!=-1){
          aux.push(ev)
        }
      })

      select.childElements().each(function(ev){
        ev.remove();
      })

      aux.each(function(ev){
        if(!already_selected(ev[1])){
          var option = new Element('option',{"value":ev[1]}).update(ev[0])
          select.insert({bottom:option});
        }
      })
    })
  });

  $$(".addAssoc").each(function(elem){
    var assocName = elem.parentNode.parentNode.childElements()[3].childElements()[0].readAttribute('name');

    Event.observe(elem,'click',function(e){
      var parentDiv = e.findElement('a').parentNode.parentNode;
      var hiddenFields = parentDiv.childElements()[3];
      var select = parentDiv.childElements()[1].childElements()[0];
      var select_two = parentDiv.childElements()[1].childElements()[3]
      var counter = select.readAttribute("ref");

      select.childElements().each(function(ev){
        if(ev.selected == true){

          var option = new Element('option',{"value":ev.readAttribute('value')}).update(ev.innerHTML)
          select_two.insert({bottom:option});
          ev.remove()

          var hidden = new Element('input',{"name":assocName,"type":"hidden","value":ev.readAttribute('value')})
          hiddenFields.insert({bottom:hidden});
        }

      })
    })
  })

  $$(".removeAssoc").each(function(elem){

    var assocName = elem.parentNode.parentNode.childElements()[3].childElements()[0].readAttribute('name');

    Event.observe(elem,'click',function(e){
      var parentDiv = e.findElement('a').parentNode.parentNode;
      var hiddenFields = parentDiv.childElements()[3];
      var select = parentDiv.childElements()[1].childElements()[0];
      var select_two = parentDiv.childElements()[1].childElements()[3]
      var counter = select.readAttribute("ref");

      select_two.childElements().each(function(ev){
        if(ev.selected == true){

          var option = new Element('option',{"value":ev.readAttribute('value')}).update(ev.innerHTML)
          select.insert({bottom:option});
          ev.remove()

          hiddenFields.childElements().each(function(o){
            var hiddenValue = o.value;
            if(hiddenValue==ev.readAttribute('value')){
              o.remove()
            }
          })

          if (!hiddenFields.childElements().length) {
            var dummyField = new Element('input', {"type": "hidden", "name": assocName})
            hiddenFields.insert({bottom: dummyField});
          }
        }

      })
    })
  })

  $$(".addAllAssoc").each(function(elem){

    var assocName = elem.parentNode.parentNode.childElements()[3].childElements()[0].readAttribute('name');

    Event.observe(elem,'click',function(e){

      var parentDiv = e.findElement('a').parentNode.parentNode;
      var hiddenFields = parentDiv.childElements()[3];
      var select = parentDiv.childElements()[1].childElements()[0];
      var select_two = parentDiv.childElements()[1].childElements()[3]

      select.childElements().each(function(ev){
        var option = new Element('option',{"value":ev.readAttribute('value')}).update(ev.innerHTML)
        select_two.insert({bottom:option});
        ev.remove()

        var hidden = new Element('input',{"name":assocName,"type":"hidden","value":ev.readAttribute('value')})
        hiddenFields.insert({bottom:hidden});
      })

    })
  })

  $$(".clearAssoc").each(function(elem){

    var assocName = elem.parentNode.parentNode.childElements()[3].childElements()[0].readAttribute('name');

    Event.observe(elem,'click',function(e){

      var parentDiv = e.findElement('a').parentNode.parentNode;
      var hiddenFields = parentDiv.childElements()[3];
      var select = parentDiv.childElements()[1].childElements()[0];
      var select_two = parentDiv.childElements()[1].childElements()[3]

      select_two.childElements().each(function(ev){
        var option = new Element('option',{"value":ev.readAttribute('value')}).update(ev.innerHTML)
        select.insert({bottom:option});
        ev.remove()
      })

      hiddenFields.childElements().each(function(ev){
        ev.remove();
      });

      if (!hiddenFields.childElements().length) {
        var dummyField = new Element('input', {"type": "hidden", "name": assocName})
        hiddenFields.insert({bottom: dummyField});
      }

    })
  })

});
