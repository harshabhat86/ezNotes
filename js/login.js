Parse.initialize("kL1NFNINEGFag94CWEM6LmL7xRxPzVvAPNhAO6nZ",
	"xlKdh66kYBpTJ33FneuyDkuzlayFQ2HDGfMHgeD1");

$( document ).ready(function() {
	
	 var SHOW_CLASS = 'show',
     HIDE_CLASS = 'hide',
     ACTIVE_CLASS = 'active';
 
 $( '.tabs' ).on( 'click', 'li a', function(e){
   e.preventDefault();
   
   var $tab = $( this ),
        href = $tab.attr( 'href' );
 
    $( '.active' ).removeClass( ACTIVE_CLASS );
    $tab.addClass( ACTIVE_CLASS );
 
    $( '.show' )
       .removeClass( SHOW_CLASS )
       .addClass( HIDE_CLASS )
       .hide();
   
     $(href)
       .removeClass( HIDE_CLASS )
       .addClass( SHOW_CLASS )
       .hide()
       .fadeIn( 550 );
 });
 
 $('#gp').click(function(){
	 $("signinButton").click();
	 
 });
	
});

function signinCallback(authResult) {
	  if (authResult['status']['signed_in']) {
	    // Update the app to reflect a signed in user
	    // Hide the sign-in button now that the user is authorized, for example:
	    document.getElementById('signinButton').setAttribute('style', 'display: none');
	    alert('Signed In Successfully!');
	  } else {
	    // Update the app to reflect a signed out user
	    // Possible error values:
	    //   "user_signed_out" - User is signed-out
	    //   "access_denied" - User denied access to your app
	    //   "immediate_failed" - Could not automatically log in the user
	    console.log('Sign-in state: ' + authResult['error']);
	    
	  }
	}

