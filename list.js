(function() {
	var	window = this,
		_List = window.List,
		undefiend,

		List = window.List = function( elem ) {
			return new List.fn.init( elem );
		};

	List.fn = List.prototype = {

		init: function( elem ) {

			this.entries = new Array;

			for ( var i = 0, ns = elem.childNodes, nsl = ns.length; i < nsl; i++ ) {
				if ( ns[i].nodeType == 1 ) this.entries.push( ns[i] );
			}

			this.root = elem;

			return this;
		},

		size: function() {
			return this.entries.length;
		},

		/* insert( index, DOM, ...) or insert( DOM, ... ) with index = 0 */
		insert: function() {
			var i = 0, index = 0, length = this.size();

			if ( typeof arguments[0] == 'number' ) {
				index = parseInt( arguments[0] );
				if ( index > length || index < 0 ) index = 0;
				i++;
			}

			/* accepted a list of dom, e.g. insert(0, dom, dom, dom) */
			var frag = document.createDocumentFragment();

			for ( var al = arguments.length; i < al; i++ ) {
				frag.appendChild( arguments[i] );
			}

			/* attach to the DOM tree */
			this.root.insertBefore( frag, length ? this.entries[index] : null  );

			/* insert may change the order of list */
			this.ordered = false;

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
				}).call( Array.prototype.slice.call( arguments ), this.entries, this.size() ),

				ql = queue.length - 1;

			for ( ; ql >= 0; ql-- ) { this.root.removeChild( queue[ql] ); }

			return this.init( this.root );
		},

		/*
			ooo = {
				sorter: null,				user-defined sorter function
				reverse: false,				reverse the output
				shuffle: false,				shuffle the list
				fn: `compare text content`,	user-defined comparison function
				eyecandy: false				candy candy
			}
			list.reorder(); // just sort it
			lsit.reorder(); // toggle(reverse) the privious result.
		*/
		reorder : function( ooo ) {
			var	root = this.root.cloneNode( false ),
				frag = document.createDocumentFragment();

			if ( this.ordered && !ooo ) {
				this.entries.reverse();
			} else {
				/* merge opts from ooo */
				var opts = (function( o ) {
					var opts = {
						fn: function( a, b ) {
							return (
								(a.innerText ? a.innerText : a.textContent ) > (b.innerText ? b.innerText : b.textContent )
								) ? 1 : 0;
						}
					};
					for ( var attr in o ) { opts[attr] = o[attr]; }
					return opts;
				})( ooo ),
				organizer = ( opts.sorter ) ? opts.sorter : ( opts.shuffle ) ? shuffle : bsort;
				/* sorting or shuffling */
				organizer.call( this.entries, opts.fn );
				if ( opts.reverse ) this.entries.reverse();
			}

			/* create a new clone */
			for ( var i = 0, al = this.size(); i < al; i++ ) {
				frag.appendChild( this.entries[i] );
			}
			root.appendChild( frag );

			/* replace */
			this.root.parentNode.replaceChild( root, this.root );

			/* the list object is ordered now */
			this.ordered = true;
			return this.init( root );
		}
	};

	List.fn.init.prototype = List.prototype;

	List.noConflict = function() {
		window.List = _List;
		return List;
	}

	function shuffle() {
		for ( var i = this.length, j, buf; i; j = parseInt ( Math.random() * i ), buf = this[--i], this[i] = this[j], this[j] = buf );
	}

	function bsort( fn ) {
		for ( var buf, i = this.length - 1, j; j = i - 1, i >= 0; i-- ) {
			for ( ; j >= 0; j-- ) {
				if ( fn( this[j], this[i] ) > 0 ) {
					buf = this[i];
					this[i] = this[j];
					this[j] = buf;
				}
			}
		}
	}
})();
