$(function() {

	function isInPosition() {
		for ( var i = 0, al = arguments.length; i < al; i++ ) {
			if ( $('ul.todo > *').eq(i).text() != arguments[i] ) return false;
		}
		return true;		
	};
	
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
		ok ( isInPosition( '2', '3', '4', '1' ), 'they should be in position' );
		
		difference( 'List( $("ul.todo").get(0) ).size()', 1, function() { 
			ok( list.insert( 1, createEntry( '5' ) ) , 'insert( 1, e )' );
		} );
		ok ( isInPosition( '2', '5', '3' ), 'they sholud be in position' );
		
		difference( 'List( $("ul.todo").get(0) ).size()', 3, function() { 
			ok( 
				list.insert( 2, createEntry( '6' ), createEntry( '7' ), createEntry( '8' ) ),
				'insert( 2, e, e, e )'
			);
		} );
		ok ( isInPosition( '2', '5', '6', '7', '8', '3' ), 'they should be in position' );
	
		difference( 'List( $("ul.todo").get(0) ).size()', 1, function() { 
			ok( list.insert( -1, createEntry( '9' ) ), 'insert( -1, e )' );
		} );
		ok ( isInPosition( '9', '2'), 'it should be at the head');
		
		difference( 'List( $("ul.todo").get(0) ).size()', 1, function() { 
			ok( list.insert( 200, createEntry( '10' ) ), 'insert( 200, e )' );
		} );
		ok ( isInPosition( '10', '9'), 'it should be at the head'); 
	} );
	
	test( 'remove()', function() {
		var list = List( $('ul.todo').get(0) );

		difference( 'List( $("ul.todo").get(0) ).size()', -1, function() {
			ok( list.remove( 3 ), 'remove( 3 )' );
		} );

		ok ( isInPosition( 'a', 'b', 'c', 'e', 'f', 'g' ), 'they should be in position' );
		
		difference( 'List( $("ul.todo").get(0) ).size()', -3, function() {
			ok( list.remove( 0, 3, 2 ), 'remove( 0, 3, 2 )' );
		} );
		ok ( isInPosition( 'b', 'f', 'g' ), 'they should be in position' );
		
		difference( 'List( $("ul.todo").get(0) ).size()', -2, function() {
			ok( list.remove( 1, 1, 1, 2 ), 'remove( 1, 1, 1, 2 )' );
		} );
		ok ( isInPosition( 'b' ), 'they should be in position' );
		
		difference( 'List( $("ul.todo").get(0) ).size()', 0, function() {
			ok( list.remove( 100, -100, undefined ), 'remove( 100, -100, undefined )' );
		} );
		ok ( isInPosition( 'b' ), 'they should be in position' );		
	} );

	test( 'reorder()', function() {
		var list = List( $('ul.todo').get(0) );
		
		ok ( list.reorder( {reverse: true} ), 'sort reversely' );
		ok ( isInPosition( 'g', 'f', 'e', 'd', 'c', 'b', 'a' ), 'they should be in position' );
		
		ok ( list.reorder(), 'sort' );
		ok ( isInPosition( 'a', 'b', 'c', 'd', 'e', 'f', 'g' ), 'they should be in position' );
		
		ok ( list.reorder( {shuffle: true} ), 'shuffle' );
		ok ( isInPosition( 'a', 'b', 'c', 'd', 'e', 'f', 'g' ), "their positions shouldn't be the same position as berfore" );		
	
		ok ( list.reorder( {fn: priority} ), 'sort by priority' );
		ok ( isInPosition( 'd', 'g', 'e', 'a', 'f', 'b', 'c' ), 'they should be in position' );
		
		ok ( list.reorder( {fn: priority, reverse: true} ), 'sort in reverse by priority' );
		ok ( isInPosition( 'c', 'b', 'f', 'a', 'e', 'g', 'd' ), 'they should be in position' );
		
		ok ( list.reorder( {eyecandy: true} ), 'sort with eyecandy enabled)' );
		ok ( isInPosition( 'a', 'b', 'c', 'd', 'e', 'f', 'g' ), 'they should be in position' );
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
		ok ( isInPosition( 'dd' ), 'they should be in position' );
			
		difference( 'List( $("ul.todo").get(0) ).size()', 0, function() { 
			ok( 
				list.insert( 1, createEntry( 'ff' ) ).insert( 0, createEntry( 'gg' ) )
					.remove( 0 ).insert( 1, createEntry( 'hh' ), createEntry( 'ii' ) )
					.remove( 1, 2, 3 )
				, 'insert( 1, e ).insert( 0, e ).remove( 0 ).insert( 1, e, e ).remove( 1, 2, 3 )' 
			);
		} );
		ok ( isInPosition( 'dd' ), 'they should be in position' );
		
		difference( 'List( $("ul.todo").get(0) ).size()', -7, function() { 
			ok( 
				list.insert( -100, createEntry( 'jj' ) ).insert( 100, createEntry( 'kk' ) )
					.remove( 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 1, 8, 9, 10 ).insert( createEntry( 'mm' ) )
				, 'insert( -100, e ).insert( 100, e ).remove( a lot ).insert( e )' 
			);
		} );
		ok ( isInPosition( 'mm' ), 'they should be in position' );
		
		difference( 'List( $("ul.todo").get(0) ).size()', -7, function() { 
			ok( 
				list.insert( createEntry( 'nn' ) ).insert( 1, createEntry( 'oo' ) )
					.reorder().remove( 1 ).insert( createEntry( 'pp' ) )
				, 'insert( e ).insert( 1, e ).reorder().remove( 1 ).insert( e )' 
			);
		} );
		ok ( isInPosition( 'pp', 'mm', 'oo' ), 'they should be in position' );	
	} );
})