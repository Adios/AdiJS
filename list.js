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
		
		/* insert( index, DOM, ...) or insert( DOM, ... ) with index = 0 */
		insert: function() {
			var i = 0, index = 0;
			
			if ( typeof arguments[0] == 'number' ) {
				index = parseInt( arguments[0] );
				if ( index > this.size() || index < 0 ) index = 0;
				i++;
			}

			/* accepted a list of dom, e.g. insert(0, dom, dom, dom) */
			var frag = document.createDocumentFragment();
			
			for ( var al = arguments.length; i < al; i++ ) {
				frag.appendChild( arguments[i] );
			}
			
			/* attach to the DOM tree */
			this.root.insertBefore( frag, this.entries[index] );
			
			return this.init( this.root );
		},
		
		/* remove( index, index, index, ... ) */
		remove: function() {
			var index,	
			
				/* unique the arguments, return an array of elements to be removed. */
				queue = (function( entries, length ) {
					var a = new Array;
					/* uniq */
					for ( var i = this.length - 1; i >= 0; i-- ) {
						for ( var j = i - 1; j >= 0; j-- ) {
							if ( this[j] === this[i] ) j = --i;
						}
						
						/* resolution, push to array */
						var index = parseInt( this[i] );
						if ( index >= 0 && index <= length - 1 ) a.push( entries[index] );
					}
					return a;
				}).apply( Array.prototype.slice.call( arguments ), [this.entries, this.size()] ),
				
				ql = queue.length - 1;
				
			for ( ; ql >= 0; ql-- ) { this.root.removeChild( queue[ql] ); }
			
			return this.init( this.root );
		}
	};

	List.fn.init.prototype = List.prototype;
	
	List.noConflict = function() {
		window.List = _List;
		return List;
	}
})();