$(function() {

	function isInPosition() {
		for ( var i = 0, al = arguments.length; i < al; i++ ) {
			if ( $('#list > *').eq(i).text() != arguments[i] ) return false;
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
	
	test( 'insert()', function() {
		ok ( $('#list > *').size() == 0, 'start with an empty list' );
		
		var list = List( document.getElementById( 'list' ) );

		difference( 'List($("#list").get(0)).size()', function() { 
			ok( list.insert( createEntry( '1' ) ) , 'insert( e )' );
		} );
		
		difference( 'List($("#list").get(0)).size()', 3, function() { 
			ok( 
				list.insert( createEntry( '2' ), createEntry( '3' ), createEntry( '4' ) ) , 
				'insert( e, e, e )' 
			);
		} );
		ok ( isInPosition( '2', '3', '4', '1' ), 'they should be in position' );
		
		difference( 'List($("#list").get(0)).size()', 1, function() { 
			ok( list.insert( 1, createEntry( '5' ) ) , 'insert( 1, e )' );
		} );
		ok ( isInPosition( '2', '5', '3' ), 'they sholud be in position' );
		
		difference( 'List($("#list").get(0)).size()', 3, function() { 
			ok( 
				list.insert( 2, createEntry( '6' ), createEntry( '7' ), createEntry( '8' ) ),
				'insert( 2, e, e, e )'
			);
		} );
		ok ( isInPosition( '2', '5', '6', '7', '8', '3' ), 'they should be in position' );
	
		difference( 'List($("#list").get(0)).size()', 1, function() { 
			ok( list.insert( -1, createEntry( '9' ) ), 'insert( -1, e )' );
		} );
		ok ( isInPosition( '9', '2'), 'it should be at the head');
		
		difference( 'List($("#list").get(0)).size()', 1, function() { 
			ok( list.insert( 200, createEntry( '10' ) ), 'insert( 200, e )' );
		} );
		ok ( isInPosition( '10', '9'), 'it should be at the head'); 
	} );
	
	test( 'remove()', function() {
		ok ( 
			$('#list').append('<li>a</li><li>b</li><li>c</li><li>d</li><li>e</li><li>f</li>'), 
			'create a list with a,b,c,d,e,f' 
		);
		
		var list = List( document.getElementById( 'list' ) );
		
		difference( 'List($("#list").get(0)).size()', -1, function() {
			ok( list.remove( 3 ), 'remove( 3 )' );
		} );
		ok ( isInPosition( 'a', 'b', 'c', 'e', 'f' ), 'they should be in position' );
		
		difference( 'List($("#list").get(0)).size()', -3, function() {
			ok( list.remove( 0, 3, 2 ), 'remove( 0, 3, 2 )' );
		} );
		ok ( isInPosition( 'b', 'f' ), 'they should be in position' );
		
		difference( 'List($("#list").get(0)).size()', -1, function() {
			ok( list.remove( 1, 1, 1 ), 'remove( 1, 1, 1 )' );
		} );
		ok ( isInPosition( 'b' ), 'they should be in position' );
		
		difference( 'List($("#list").get(0)).size()', 0, function() {
			ok( list.remove( 100, -100, undefined ), 'remove( 100, -100, undefined )' );
		} );
		ok ( isInPosition( 'b' ), 'they should be in position' );
		
		difference( 'List($("#list").get(0)).size()', -1, function() {
			ok( list.remove( 0, 0, 0 ), 'remove( 0, 0, 0 )' );
			ok( true, 'remove empty list sholud not cause errors' );
		} );
	} );
})