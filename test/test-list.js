$(function() {

	function createEntry( text ) {
		var e = document.createElement( 'li' );
		e.appendChild( document.createTextNode( text ) );
		return e;
	};


	module( 'List' );

	test( 'List.noConflict()', function() {
		ok( window.List = (function() {
			var L = window.List,
				l = List.noConflict();
			return ( l === L && window.List === undefined ) ? l : false;
		})(), 'it works' );
	} );

	test( 'over empty list', function() {
		var list = List( $('ul.empty').get(0) );

		ok( list.reorder(), "reorder shoudn't cause errors" );
		ok( list.reorder(), "reorder reversely shoudn't cause errors" );

		difference( 'List( $("ul.empty").get(0) ).size()', 0, function() {
			ok( list.remove( 0 ), "remove one shouldn't cause errors" );
		} );

		difference( 'List( $("ul.empty").get(0) ).size()', 1, function() {
			ok( list.insert( createEntry( 'new one') ), "insert one shouldn't cause errors" );
		} );
	} );

	test( 'insert()', function() {
		var list = List( $('ul.todo').get(0) );

		difference( 'List( $("ul.todo").get(0) ).size()', function() {
			ok( list.insert( createEntry( '1' ) ) , 'insert( e )' );
		} );

		difference( 'List( $("ul.todo").get(0) ).size()', 3, function() {
			ok(
				list.insert( createEntry( '2' ), createEntry( '3' ), createEntry( '4' ) ) ,
				'insert( e, e, e )'
			);
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), '2341abcdefg', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', 1, function() {
			ok( list.insert( 1, createEntry( '5' ) ) , 'insert( 1, e )' );
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), '25341abcdefg', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', 3, function() {
			ok(
				list.insert( 2, createEntry( '6' ), createEntry( '7' ), createEntry( '8' ) ),
				'insert( 2, e, e, e )'
			);
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), '25678341abcdefg', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', 1, function() {
			ok( list.insert( -1, createEntry( '9' ) ), 'insert( -1, e )' );
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), '925678341abcdefg', 'at head' );

		difference( 'List( $("ul.todo").get(0) ).size()', 1, function() {
			ok( list.insert( 200, createEntry( '10' ) ), 'insert( 200, e )' );
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), '10925678341abcdefg', 'at head' );
	} );

	test( 'remove()', function() {
		var list = List( $('ul.todo').get(0) );

		difference( 'List( $("ul.todo").get(0) ).size()', -1, function() {
			ok( list.remove( 3 ), 'remove( 3 )' );
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'abcefg', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', -3, function() {
			ok( list.remove( 0, 3, 2 ), 'remove( 0, 3, 2 )' );
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'bfg', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', -2, function() {
			ok( list.remove( 1, 1, 1, 2 ), 'remove( 1, 1, 1, 2 )' );
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'b', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', 0, function() {
			ok( list.remove( 100, -100, undefined ), 'remove( 100, -100, undefined )' );
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'b', 'in position' );
	} );

	test( 'reorder()', function() {
		var list = List( $('ul.todo').get(0) );

		ok ( list.reorder( {reverse: true} ), 'sort reversely' );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'gfedcba', 'in position' );

		ok ( list.reorder(), 'sort' );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'abcdefg', 'in position' );

		ok ( list.reorder( {shuffle: true} ), 'shuffle' );
		ok ( $('ul.todo > *').text().replace(/ /g, '') != 'abcdefg', "their positions shouldn't be the same position as before" );

		ok ( list.reorder( {fn: priority} ), 'sort by priority' );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'dgeafbc', 'in position' );

		ok ( list.reorder( {fn: priority, reverse: true} ), 'sort in reverse by priority' );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'cbfaegd', 'in position' );

		ok ( list.reorder(), 'toggle sort' );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'dgeafbc', 'in position' );

		ok ( list.reorder( {eyecandy: true} ), 'sort with eyecandy enabled)' );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'abcdefg', 'in position' );
	} );

	test( 'chain', function() {
		var list = List( $('ul.todo').get(0) );

		difference( 'List( $("ul.todo").get(0) ).size()', 0, function() {
			ok( list.insert( createEntry( 'aa' ) ).remove( 0 ) , 'insert( e ).remove( 0 )' );
		} );

		difference( 'List( $("ul.todo").get(0) ).size()', 1, function() {
			ok(
				list.insert( createEntry( 'bb' ) ).insert( createEntry( 'cc' ) )
					.remove( 0 ).insert( createEntry( 'dd' ), createEntry( 'ee' ) )
					.remove( 1, 2 )
				, 'insert( e ).insert( e ).remove( 0 ).insert( e, e ).remove( 1, 2 )'
			);
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'ddabcdefg', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', 0, function() {
			ok(
				list.insert( 1, createEntry( 'ff' ) ).insert( 0, createEntry( 'gg' ) )
					.remove( 0 ).insert( 1, createEntry( 'hh' ), createEntry( 'ii' ) )
					.remove( 1, 2, 3 )
				, 'insert( 1, e ).insert( 0, e ).remove( 0 ).insert( 1, e, e ).remove( 1, 2, 3 )'
			);
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'ddabcdefg', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', -7, function() {
			ok(
				list.insert( -100, createEntry( 'jj' ) ).insert( 100, createEntry( 'kk' ) )
					.remove( 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 1, 8, 9, 10 ).insert( createEntry( 'mm' ) )
				, 'insert( -100, e ).insert( 100, e ).remove( a lot ).insert( e )'
			);
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'mm', 'in position' );

		difference( 'List( $("ul.todo").get(0) ).size()', -7, function() {
			ok(
				list.insert( createEntry( 'nn' ) ).insert( 1, createEntry( 'oo' ) )
					.reorder().remove( 1 ).insert( createEntry( 'pp' ) ).reorder()
				, 'insert( e ).insert( 1, e ).reorder().remove( 1 ).insert( e ).reorder()'
			);
		} );
		equals ( $('ul.todo > *').text().replace(/ /g, ''), 'oommpp', 'in position' );
	} );
})
