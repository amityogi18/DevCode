


jQuery(function($){
	
$('a.mobilemenu').click(function(){
         $('.nav-sup').slideToggle('slow');
});

$('.tophead').find('.details').find('.mobilemenu').on('click', function(){
	$('.mobilemenu').toggleClass('active');
});


$('.header-top .toggle-icon').click(function(){
	$(this).parent().toggleClass('menu-active');
});

var wow = new WOW(
  {
    boxClass:     'wow',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       0,          // distance to the element when triggering the animation (default is 0)
    mobile:       true,       // trigger animations on mobile devices (default is true)
    live:         true,       // act on asynchronously loaded content (default is true)
    callback:     function(box) {
      // the callback is fired every time an animation is started
      // the argument that is passed in is the DOM node being animated
    }
  }
);

wow.init();


// $('.tab-area-module .form-area .form-control').on('focus blur', function(){
// 		$(this).parents('.input-fields').find('label').toggleClass('small-label');	
// });

// $('.header-right-sec .text-field').on("focus blur", function(){
// 	$(this).parents('.input-group').toggleClass('big-width');
// 	$(this).parents('.input-group').find('.text-field').toggleClass('small-label');
// });

// $('.blue-area-module .form-area .form-control').on("focus blur", function(){
// 	$(this).parents('.input-fields').find('label').toggleClass('small-label');
// });

// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
				if (!String.prototype.trim) {
					(function() {
						// Make sure we trim BOM and NBSP
						var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
						String.prototype.trim = function() {
							return this.replace(rtrim, '');
						};
					})();
				}

				[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
					// in case the input is already filled..
					if( inputEl.value.trim() !== '' ) {
						classie.add( inputEl.parentNode, 'input--filled' );
					}

					// events:
					inputEl.addEventListener( 'focus', onInputFocus );
					inputEl.addEventListener( 'blur', onInputBlur );
				} );

				function onInputFocus( ev ) {
					classie.add( ev.target.parentNode, 'input--filled' );
				}

				function onInputBlur( ev ) {
					if( ev.target.value.trim() === '' ) {
						classie.remove( ev.target.parentNode, 'input--filled' );
					}
				}

});
	
	
	
	
	
	
	
	
	
	