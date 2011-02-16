/**
 *
 */
var Typebox = $.Class.create({
    /*
     * properties
     */
    _element : null,
    _text : "",
    _fixed : "",
    _current : "",
    _position : 0,
    _iteration : 0,
    _max_iterations: 3,
    _waited : 0,
    _started : false,
    
    /*
     *
     */
    initialize: function(element) {
      this._element = $(element);
      this._text = this._element.attr("data-text");
    },
    
    /*
      *
      */
     get_inner: function() {
       return $(this._element.find("var").first());
     },
    
    /*
     * Calculates and returns the next character to be displayed.
     */
    get_char: function() {
      if(this.is_waiting()) {
        var value = '.';
        this._fixed = this._current;
        if(++this._waited == 10) {
          this._fixed = "";
          value = '';
        }
      } else {
        var value = (this._iteration < (this._max_iterations - 1))
          ? Math.floor(Math.random() * 10)
          : this._text[this._position];
        this._iteration = (this._iteration + 1) % (this._max_iterations + 1);
        if(this._iteration == 0) {
          this._position++;
          this._fixed = this._current;
        }
      }
      return value;
    },
    
    /*
     *
     */
    is_done: function() {
      return this._position >= this._text.length;
    },
    
    /*
     *
     */
    is_waiting: function() {
      return this._element.attr("data-prefill") == "true" && this._waited < 10;
    },
    
    /*
     *
     */
    update: function() {
      if(!this.is_done()) {
        this._current = this._fixed + this.get_char();
        this.get_inner().replaceWith('<var>' + this._current + '</var>');
      }
      this._started = true;
      return this.is_done();
    },
    
    /*
     *
     */
    is_firstrun: function() {
      return !this._started;
    },
    
    /*
     *
     */
    should_pause: function() {
      return this._element.attr("data-prepause") && this.is_firstrun();
    },
    
    /*
     *
     */
    get_interval: function() {
      if(this.should_pause()) {
        return parseInt(this._element.attr("data-prepause"));
      } else if(this.is_waiting()) {
        return 500;
      } else {
        return 10;
      }
    },
    
    /*
     *
     */
    toString: function() {
      return this._element.id;
    },
    
  }, {
    /*
     * properties
     */
    getset: [['BoxId', '_box_id']]
});


/**
 *
 */
var Typewriter = $.Class.create({
    /*
     * properties
     */
    _box : null,
    _max_iterations : null,
    _fixed : "",
    _position : 0,
    _iteration : 0,
    _waited : 0,
    _current_text : "messaging decelerated",
    _parts : [],
    
    /*
     * Constructs a new typewriter for the given DOM Object ID.
     */
    initialize: function(box_id) {
      this._box_id = box_id;
      this._box = $(box_id);
      this._max_iterations = parseInt(this._box.attr("data-iterations"));
      this.load_parts();
      $(document.body).click(jQuery.proxy(this.register, this));
    },
    
    /*
     *
     */
    load_part: function(part) {
      this._parts.push(new Typebox(part));
    },
    
    /*
     *
     */
    load_parts: function() {
      var boxes = $(this._box_id + " .fill_text");
      var parent = this;
      $.each(boxes, function(index, element) { parent.load_part(element) });
    },
    
    /*
     *
     */
    register: function() {
      if(this._box.is(":hidden")) {
        this._box.show("fast", jQuery.proxy(this.type, this));
      }
    },
    
    /*
     *
     */
    get_part: function() {
      if(this._current_part == null || (this._current_part.is_done() && this._parts.length > 0))
        this._current_part = this._parts.shift();
      return this._current_part;
    },
    
    /*
     *
     */
    type: function() {
      this.get_part().update();
      var timeout = this.get_part().get_interval();
      window.setTimeout(jQuery.proxy(this.type, this), timeout);
    },
    
    /*
     * methods
     */
    toString: function() {
      return this.property('BoxId');
    }
  }, {
    /*
     * properties
     */
    getset: [['BoxId', '_box_id']]
});