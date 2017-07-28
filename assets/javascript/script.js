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
var playerData;
var player1;
var player2;
var player1Snapshot;
var player2Snapshot;
//Getting a snapshot of the local data
//This function allows me to update the page in real-time by adding the 'value' event listener
refPlayers.on('value', function(snapshot){
	//if there are no players then nothing happens
	if(!snapshot.val()) {
		console.log('There is nothing in the database');
	}
	//if both players are in the database then this gets run
	else if(snapshot.val()[1] && snapshot.val()[2]){
		console.log('Player 1 and 2 exists');
		player1Snapshot = snapshot.val()[1];
		player2Snapshot = snapshot.val()[2];
		player1 = true;
		player2 = true;
		$('#panel-player1 h4').html(player1Snapshot.name);
		$('#panel-player2 h4').html(player2Snapshot.name);
		$('#messageToClient  .input-group').empty().removeClass('input-group').addClass('panel panel-default');
	}
	else if(snapshot.val()[1]){
		console.log('Only player 1 exists');
		player1Snapshot = snapshot.val()[1];
		player1 = true;
		$('#panel-player1 h4').html(player1Snapshot.name);
		$('#messageToClient  .input-group').empty().removeClass('input-group').addClass('panel panel-default');
	}
	else {
		console.log('this should not occur')
	}
});
//This function will update the database with the name of the player 
$('#startBtn').on('click', function(event){
	event.preventDefault();
	//This declares playerName to be the input value
	var playerName = $('#playerName').val().trim();
	// I create an object that will hold his info and pass it on to firebase
	if(!player1){
		playerData = {
			1: {
				lossess: 0,
				name: playerName,
				wins: 0
			}
		}
		player1 = true;		
	}
	else if(!player2) {
		playerData = {
			2: {
				lossess: 0,
				name: playerName,
				wins: 0
			}
		}
		player2 = true;
		console.log('creating player 2');
	}
	$('#messageToClient  .input-group').empty().removeClass('input-group').addClass('panel panel-default');
	refPlayers.update(playerData);
})


