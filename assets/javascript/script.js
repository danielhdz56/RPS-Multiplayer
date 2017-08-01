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
var refChat = database.ref('chat');
var choices = ['Rock', 'Paper', 'Scissors'];
var firstplayer = false;
var secondplayer = false;
var player1;
var player2;
var turns;
var currentPlayer;
var opponent;
var player1Choice;
var player2Choice;
var intervalId;
var status = false;
var disconnected = false;



refPlayers.on('value', function(snapshot) {
	if(!snapshot.child('1').exists()){
		$('#messageToClient').html('<div class="input-group"><input id="playerName" type="text" class="form-control" placeholder="Name"><span class="input-group-btn"><button id="startBtn" class="btn btn-primary" type="button">Start!</button></span></div>');
		
	}
	else if(!snapshot.child('2').exists() && sessionStorage.getItem('player') === null){
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
			sessionStorage.setItem('player', '1');
			sessionStorage.setItem('name', playerName);
			sessionStorage.setItem('losses', '0');
			sessionStorage.setItem('wins', '0');
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
			refTurns.set(1);
			refPlayers.update(playerData);
			sessionStorage.setItem('player', '2');
			sessionStorage.setItem('name', playerName);
			sessionStorage.setItem('losses', '0');
			sessionStorage.setItem('wins', '0');
			$('#messageToClient  .input-group').empty().removeClass('input-group');
			$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + playerName + ' you are Player 2</div>');
			$('#messageToClient .panel-body').append('<br>Waiting on ' + opponent.name + ' to make a move!');

		}
	});



});
refPlayers.on('value', function(snapshot){
	if(snapshot.child('1').exists()){
		firstplayer = true;
		player1 = snapshot.child('1').val();
		$('#panel-player1 .panel-body h4').html(player1.name);
		$('#panel-player1 .panel-footer').html('Wins: ' + player1.wins + ' Losses: ' + player1.losses);
		if(sessionStorage.getItem('player')==='1'){
			$('#panel-player1 .panel-body h3').html(player1.choice);
			console.log('first');
		}
	}
	if(snapshot.child('2').exists()){
		secondplayer = true;
		player2 = snapshot.child('2').val();
		$('#panel-player2 .panel-body h4').html(player2.name);
		$('#panel-player2 .panel-footer').html('Wins: ' + player2.wins + ' Losses: ' + player2.losses);
		if(snapshot.child('2').child('choice').exists()){
			player1Choice = snapshot.child('1').child('choice').val();
			player2Choice = snapshot.child('2').child('choice').val();
		}
		
	}
	if((sessionStorage.getItem('player') !== null) && (!disconnected)){
		currentPlayer = snapshot.child(sessionStorage.getItem('player')).val().name;
		if (!status){
			$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + currentPlayer + ' you are Player ' + sessionStorage.getItem('player') + '</div>');
		}
	}
	
});

refTurns.on('value', function(snapshot){
	if(snapshot.exists()){
		turns = snapshot.val();
		if(Number(sessionStorage.getItem('player'))%2===1){
			opponent = player2;
		}
		else{
			opponent = player1;
		}
		if(Number(sessionStorage.getItem('player'))===turns){
			if(turns===1 || turns===2){
				$('#panel-player' + sessionStorage.getItem('player')).find('.panel-body h3').html('');
				$('#panel-player' + sessionStorage.getItem('player')).find('.panel-body').append('<div id="choices" class="btn-group-vertical" role="group"></div>');
				for(i=0; i<choices.length;i++){
					$('#choices').append('<div class="btn-group" role="group"><button type="button" class="btn btn-default choices">' + choices[i] + '</button></div>');
				}
				$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + sessionStorage.getItem('name') + ' you are Player ' + sessionStorage.getItem('player') + '</div>');
				$('#messageToClient .panel-body').append('<br>My Turn');
				status = true;
			}
		}
		else if(snapshot.exists()){
			$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + sessionStorage.getItem('name') + ' you are Player ' + sessionStorage.getItem('player') + '</div>');
			$('#messageToClient .panel-body').append('<br>Waiting on ' + opponent.name + ' to make a move!');
		}
		if(turns===3){
			$('#panel-player1').find('h3').html(player1Choice);
			$('#panel-player2').find('h3').html(player2Choice);
			checkMoves();
		}

		$(document).on('click', '.choices', function(event){
			event.preventDefault();
			playerChoice = $(this).html();
			$(this).closest('#choices').parent().find('h3').html(playerChoice);
			$(this).closest('#choices').remove();
			if(sessionStorage.getItem('player') ==='1' && turns===1){
				refPlayers.child(1).update({choice: playerChoice});
				refTurns.set(2);
			}
			else if(sessionStorage.getItem('player') ==='2' && turns===2) {
				refPlayers.child(2).update({choice: playerChoice});
				refTurns.set(3);
			}
		})
	}
	else if(sessionStorage.getItem('player')){
		$('#messageToClient').addClass('panel panel-default').html('<div class="panel-body text-center">Hi ' + sessionStorage.getItem('name') + ' you are Player ' + sessionStorage.getItem('player') + '</div>');
		$('#messageToClient .panel-body').append('<br>Waiting for another player to join.');
		$('#panel-player2').find('h4').html('Waiting for Player 2');
		$('#choices').remove();
	}
	
});
refChat.on('child_added', function(snapshot){
	$('#panel-chat').find('.panel-body').append('<p>'+snapshot.val()+'</p>');
	$("#panel-chat .panel-body").scrollTop($("#panel-chat .panel-body")[0].scrollHeight);
});
$(document).on('click', '#chatBtn', function(){
	event.preventDefault();
	var messenger = sessionStorage.getItem('name');
	var chatMessage = $('#chatMessage').val().trim();
	console.log(messenger + ": " + chatMessage)
	var messageToSend = messenger + ": " + chatMessage;
	refChat.push(messageToSend);
})



function checkMoves(){
	var player1Outcome;
	var player1Wins = player1.wins;
	var player1Losses = player1.losses;
	var player2Wins = player2.wins;
	var player2Losses = player2.losses;
	if(player1.choice === player2.choice){
		$('#panel-outcome').find('h4').html('TIE');
	}
	else if(player1.choice === 'Rock'){
		if(player2.choice === 'Paper'){
			player1Outcome = false;
		}
		else {
			player1Outcome = true;
		}
	}
	else if(player1.choice === 'Paper'){
		if(player2.choice === 'Scissors'){
			player1Outcome = false;
		}
		else {
			player1Outcome = true;
		}
	}
	else {
		if(player2.choice === 'Rock'){
			player1Outcome = false;
		}
		else {
			player1Outcome = true;
		}
	}
	if(player1Outcome && player1.choice !== player2.choice){
		player1Wins++;
		player2Losses++;
		$('#panel-outcome').find('h4').html(player1.name + ' Wins');
		refPlayers.child(1).update({wins: player1Wins});
		refPlayers.child(2).update({losses: player2Losses});
	}
	else if(player1.choice !== player2.choice) {
		player2Wins++
		player1Losses++
		$('#panel-outcome').find('h4').html(player2.name + ' Wins');
		refPlayers.child(2).update({wins: player2Wins});
		refPlayers.child(1).update({losses: player1Losses});
	}
	if(sessionStorage.getItem('player')==='1'){
		sessionStorage.setItem('wins', player1.wins)
		sessionStorage.setItem('losses', player1.losses)
	}
	else if(sessionStorage.getItem('player')==='2'){
		sessionStorage.setItem('wins', player2.wins)
		sessionStorage.setItem('losses', player2.losses)
	}

	setTimeout(function(){
		refTurns.set(1);
		$('#panel-player1').find('h3').html('');
		$('#panel-outcome').find('h4').html('')
		$('#panel-player2').find('h3').html('');
	}, 5000)
}

refPlayers.child(2).onDisconnect().remove();
refTurns.onDisconnect().remove();

refPlayers.on('child_removed', function(snapshot){
	var playerName = sessionStorage.getItem('name');
	var playerLosses = Number(sessionStorage.getItem('losses'));
	var playerWins = Number(sessionStorage.getItem('wins'));
	sessionStorage.setItem('player', '1')
	playerName = 
	playerData = {
		1: {
			losses: playerLosses,
			name: playerName,
			wins: playerWins
		}
	}
	refPlayers.update(playerData);
})

