// Initialize Firebase
var config = {
apiKey: "AIzaSyDMGmU6sAF0gsqozNxxspZVOmE9I7j-e9Y",
authDomain: "rockpaperscissors-430d4.firebaseapp.com",
databaseURL: "https://rockpaperscissors-430d4.firebaseio.com",
projectId: "rockpaperscissors-430d4",
storageBucket: "",
messagingSenderId: "954071881956"
};
firebase.initializeApp(config);
//Creating an instance of firebase to reference
var database = firebase.database();
var refPlayers = database.ref('players');
var refTurns = database.ref('turn');
var choices = ['Rock', 'Paper', 'Scissors'];
var firstplayer = false;
var secondplayer = false;
var player1;
var player2;
var turns;
var currentPlayer;
var opponent;
var oddTurn = false;
var evenTurn = false;
var player1Choice;
var player2Choice;



refPlayers.on('value', function(snapshot) {
	if(!snapshot.child('1').exists()){
		$('#messageToClient').html('<div class="input-group"><input id="playerName" type="text" class="form-control" placeholder="Name"><span class="input-group-btn"><button id="startBtn" class="btn btn-primary" type="button">Start!</button></span></div>');
		
	}
	else if(!snapshot.child('2').exists() && sessionStorage.getItem('player') === null){
		console.log('hello');
		$('#messageToClient').html('<div class="input-group"><input id="playerName" type="text" class="form-control" placeholder="Name"><span class="input-group-btn"><button id="startBtn" class="btn btn-primary" type="button">Start!</button></span></div>');
		
	}

	$(document).on('click', '#startBtn', function(event){
		event.preventDefault();
		//This declares playerName to be the input value
		if (!firstplayer) {
			var playerName = $('#playerName').val().trim();
			playerData = {
				1: {
					losses: 0,
					name: playerName,
					wins: 0
				}
			}
			firstplayer = true;
			refPlayers.update(playerData);
			console.log('This should only run if I click submit');
			sessionStorage.setItem('player', '1');
			$('#messageToClient  .input-group').empty().removeClass('input-group');
			$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + playerName + ' you are Player 1</div>');
		}
		else if (!secondplayer){
			var playerName = $('#playerName').val().trim();
			playerData = {
				2: {
					losses: 0,
					name: playerName,
					wins: 0
				}
			}
			secondplayer = true;
			//maybe place turns in here as well
			refTurns.set(1);
			refPlayers.update(playerData);
			console.log('This should only run if I click submit');
			sessionStorage.setItem('player', '2');
			$('#messageToClient  .input-group').empty().removeClass('input-group');
			$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + playerName + ' you are Player 2</div>');
		}
	});



});
refPlayers.on('value', function(snapshot){
	if(snapshot.child('1').exists()){
		firstplayer = true;
		player1 = snapshot.child('1').val();
		$('#panel-player1 .panel-body h4').html(player1.name);
		$('#panel-player1 .panel-footer').html('Wins: ' + player1.wins + ' Losses: ' + player1.losses);
		if(snapshot.child('1').child('choice').exists()){
			oddTurn = true;
		}
	}
	if(snapshot.child('2').exists()){
		secondplayer = true;
		player2 = snapshot.child('2').val();
		$('#panel-player2 .panel-body h4').html(player2.name);
		$('#panel-player2 .panel-footer').html('Wins: ' + player2.wins + ' Losses: ' + player2.losses);
		if(snapshot.child('2').child('choice').exists()){
			evenTurn = true;
			player1Choice = snapshot.child('1').child('choice').val();
			player2Choice = snapshot.child('2').child('choice').val();
			console.log(player1Choice);
		}
		
	}
	if(sessionStorage.getItem('player') !== null){
		currentPlayer = snapshot.child(sessionStorage.getItem('player')).val().name;
		$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + currentPlayer + ' you are Player ' + sessionStorage.getItem('player') + '</div>');

	}
	
});

refTurns.on('value', function(snapshot){
	turns = snapshot.val();
	console.log(turns);
	if(Number(sessionStorage.getItem('player'))%2===1){
		opponent = player2;
	}
	else{
		opponent = player1;
	}
	if(Number(sessionStorage.getItem('player'))%2===turns%2){
		$('#messageToClient .panel-body').append('<br>My Turn');
		if(oddTurn&&evenTurn){
			$('#panel-player1').find('.panel-body').append('<h3>' + player1Choice + '</h3>')
			$('#panel-player2').find('.panel-body').append('<h3>' + player2Choice + '</h3>')

		}
		else{
			$('#panel-player' + sessionStorage.getItem('player')).find('.panel-body').append('<div id="choices" class="btn-group-vertical" role="group"></div>');
			for(i=0; i<choices.length;i++){
				$('#choices').append('<div class="btn-group" role="group"><button type="button" class="btn btn-default choices">' + choices[i] + '</button></div>');
			}
		}
	}
	else {
		$('#messageToClient .panel-body').append('<br>Waiting on ' + opponent.name + ' to make a move!');
		if(oddTurn&&evenTurn){
			$('#panel-player1').find('.panel-body').append('<h3>' + player1Choice + '</h3>')
			$('#panel-player2').find('.panel-body').append('<h3>' + player2Choice + '</h3>')

		}
	}
	$(document).on('click', '.choices', function(event){
		event.preventDefault();
		playerChoice = $(this).html();
		$(this).closest('#choices').parent().append('<h3>' + playerChoice + '</h3>');
		$(this).closest('#choices').remove();
		if(sessionStorage.getItem('player') ==='1' && turns%2===1){
			refPlayers.child(1).update({choice: playerChoice});
			oddTurn = true;
			turns++;
		}
		else if(sessionStorage.getItem('player') ==='2' && turns%2===0) {
			console.log('This should only appear after second player picks');
			refPlayers.child(2).update({choice: playerChoice});
			evenTurn = true;
			turns++;

		}
		refTurns.set(turns);
		console.log('hey');
	})
});

