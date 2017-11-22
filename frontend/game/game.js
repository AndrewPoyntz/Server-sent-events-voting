$(document).ready(() => {
	let xTaken = false;
	let oTaken = false;
	let gameLive = false;
	let source = new EventSource('/gameUpdates');
	let claimXButton = $('#x');
	let claimOButton = $('#o');
	let youAre = $('#youAre');
	let choice = false;
	source.addEventListener('resetGame', (e)=> {
		console.log('reset the game?');
		choice = false;
	});
	source.addEventListener('gameState', (e)=> {
		$('.js-wins').removeClass('active');
		$('.x').removeClass('active');
		$('.o').removeClass('active');
		$('.red-line').removeClass('active');

		let gameState = JSON.parse(e.data);
		console.log(JSON.stringify(gameState));
		xTaken = gameState.xTaken;
		oTaken = gameState.oTaken;
		gameLive = xTaken && oTaken;
		if (gameLive || choice){
			$('.choose').removeClass('active');
		} else {
			$('.choose').addClass('active');
		}
		(xTaken)? claimXButton.hide(): claimXButton.show();
		(oTaken)? claimOButton.hide(): claimOButton.show();
		if (choice){
			youAre.html('You are: '+choice.toUpperCase());
		} else if (gameLive) {
			youAre.html('You are an observer');
		} else {
			youAre.html('Game is waiting for players')
		}

		for (let square in gameState.squares){
			let value = gameState.squares[square];
			let box = $('.box:nth-child('+square+')');
			let xMarker = box.children('.x');
			let oMarker = box.children('.o');
			if (value){
				if (value === 'x'){
					xMarker.addClass('active')
				} else if (value === 'o'){
					oMarker.addClass('active');
				}
			} else {
				xMarker.removeClass('active');
				oMarker.removeClass('active');
			}
		}
		checkForWinners();
	});
	let claim = (value) => {
		$.ajax({
			url: '/claim',
			data: {choice:value},
			success: ()=>{}
		});
	};
	claimXButton.click(function () {
		choice = 'x';
		claim('x');
	});
	claimOButton.click(function () {
		choice ='o';
		claim('o');
	});
	$('.box').click(function() {
		if (choice && gameLive) {
			$.ajax({
				url: '/updateGameState',
				data: {square:$(this).attr('id'), val:choice},
				success: ()=>{}
			});
		}
	});
	checkForWinners = function (){
		let xChild1 = $('.box:nth-child(1)').children('.x').hasClass('active'),
			oChild1 = $('.box:nth-child(1)').children('.o').hasClass('active'),
			xChild2 = $('.box:nth-child(2)').children('.x').hasClass('active'),
			oChild2 = $('.box:nth-child(2)').children('.o').hasClass('active'),
			xChild3 = $('.box:nth-child(3)').children('.x').hasClass('active'),
			oChild3 = $('.box:nth-child(3)').children('.o').hasClass('active'),
			xChild4 = $('.box:nth-child(4)').children('.x').hasClass('active'),
			oChild4 = $('.box:nth-child(4)').children('.o').hasClass('active'),
			xChild5 = $('.box:nth-child(5)').children('.x').hasClass('active'),
			oChild5 = $('.box:nth-child(5)').children('.o').hasClass('active'),
			xChild6 = $('.box:nth-child(6)').children('.x').hasClass('active'),
			oChild6 = $('.box:nth-child(6)').children('.o').hasClass('active'),
			xChild7 = $('.box:nth-child(7)').children('.x').hasClass('active'),
			oChild7 = $('.box:nth-child(7)').children('.o').hasClass('active'),
			xChild8 = $('.box:nth-child(8)').children('.x').hasClass('active'),
			oChild8 = $('.box:nth-child(8)').children('.o').hasClass('active'),
			xChild9 = $('.box:nth-child(9)').children('.x').hasClass('active'),
			oChild9 = $('.box:nth-child(9)').children('.o').hasClass('active');

		if( xChild1 && xChild2 && xChild3 ){
			$('.top-hor').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild1 && oChild2 && oChild3 ){
			$('.top-hor').addClass('active');
			$('.o-wins').addClass('active');
		} else if(  xChild4 && xChild5 && xChild6 ){
			$('.mid-hor').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild4 && oChild5 && oChild6 ){
			$('.mid-hor').addClass('active');
			$('.o-wins').addClass('active');
		} else if(  xChild7 && xChild8 && xChild9 ){
			$('.bottom-hor').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild7 && oChild8 && oChild9 ){
			$('.bottom-hor').addClass('active');
			$('.o-wins').addClass('active');
		} else if(  xChild1 && xChild4 && xChild7 ){
			$('.left-vert').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild1 && oChild4 && oChild7 ){
			$('.left-vert').addClass('active');
			$('.o-wins').addClass('active');
		} else if(  xChild2 && xChild5 && xChild8 ){
			$('.mid-vert').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild2 && oChild5 && oChild8 ){
			$('.mid-vert').addClass('active');
			$('.o-wins').addClass('active');
		} else if(  xChild3 && xChild6 && xChild9 ){
			$('.right-vert').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild3 && oChild6 && oChild9 ){
			$('.right-vert').addClass('active');
			$('.o-wins').addClass('active');
		} else if(  xChild1 && xChild5 && xChild9 ){
			$('.ltr-diag').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild1 && oChild5 && oChild9 ){
			$('.ltr-diag').addClass('active');
			$('.o-wins').addClass('active');
		} else if(  xChild3 && xChild5 && xChild7 ){
			$('.rtl-diag').addClass('active');
			$('.x-wins').addClass('active');
		} else if(  oChild3 && oChild5 && oChild7 ){
			$('.rtl-diag').addClass('active');
			$('.o-wins').addClass('active');
		}
	};
	reset = function (){
		$.ajax({
			url: '/resetGame',
			success: ()=>{}
		});
	};
	$('.reset').on('click', function(){
		reset();
	});

});
