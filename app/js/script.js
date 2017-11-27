$(".menu-btn").click(function(){
	$("nav").slideToggle("show");
});

$('.tv-program-nav-carousel').owlCarousel({
	margin:24,
	nav:true,
	autoplay:false,
	loop: true,
    slideSpeed : 300,
	dots:false,
	autoWidth: true,
	items:3,
	// responsiveClass:true,
	navText : ['<i class="fa fa-angle-left " aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
  });

$(".tv-program-li-link").click(function(e){
	e.preventDefault();
	var w = window.innerWidth;
	if(w <= 991){
		$(".fm-tab-menu").slideToggle();	
	}
});



