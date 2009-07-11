(function() {
	var	window = this,
		_List = window.List,
		undefiend,
		
		List = window.List = function( elem ) {
			return new List.fn.init( elem );
		};

	List.fn = List.prototype = {

		init: function( elem ) { 
			this.entries = elem.childNodes; 
			this.root = elem;
			
			return this;
		},
		
		size: function() {
			return this.entries.length;
		},
		
		/* insert( pos, DOM, ...) or insert( DOM, ... ) with pos = 0 */
		insert: function() {
			var i = 0, pos = 0;
			
			if ( typeof arguments[0] == 'number' ) {
				pos = parseInt( arguments[0] );
				if ( pos > this.size() || pos < 0 ) pos = 0;
				i++;
			}

			/* accepted a list of dom, e.g. insert(0, dom, dom, dom) */
			var frag = document.createDocumentFragment();
			
			for ( al = arguments.length; i < al; i++ ) {
				frag.appendChild( arguments[i] );
			}
			
			/* attach to the DOM tree */
			this.root.insertBefore( frag, this.entries[pos] );
			
			return this.init( this.root );
		},
		
		/* remove( pos, pos, pos, ... ) */
		remove: function() {
			var pos,	
			
				/* unique the arguments, return an array of elements to be removed. */
				queue = (function( entries, length ) {
					var a = new Array;
					/* uniq */
					for ( var i = this.length - 1; i >= 0; i-- ) {
						for ( var j = i - 1; j >= 0; j-- ) {
							if ( this[j] === this[i] ) j = --i;
						}
						
						/* resolution, push to array */
						var pos = parseInt( this[i] );
						if ( pos >= 0 && pos <= length ) a.push( entries[pos] );
					}
					return a;
				}).apply( Array.prototype.slice.call( arguments ), [this.entries, this.size()] ),
				
				ql = queue.length - 1;
				
			for ( ; ql >= 0; ql-- ) { this.root.removeChild( queue[ql] ); }
			
			return this.init( this.root );
		},
	};

	List.fn.init.prototype = List.prototype;
	
	List.noConflict = function() {
		window.List = _List;
		return List;
	}
})();