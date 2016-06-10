/*
	Flash Key Signatures
	Methods to control the gameplay and properties of a Flash Key Signatures game,
	and to update the StatusModel */

/* constructor   */
Flash.ScaleDegree.GameController = function () {
	var is_max_level = false,
		label_mode;
	this.MAJOR = 0,
	this.MINOR = 1,
	this.BOTH = 2;
	this.SCALE = 1.3;
	//this.stave;
	this.clef_type = "treble";
	this.ks_index = cfg.C;
	this.key_spec = cfg.KEY_SIGS[this.ks_index];
	this.noteSpec = "C";
	this.noteDur = "w";
	this.timeSig = Vex.Flow.TIME4_4;
	this.startx = 115;
	this.timeOut = 25;
	this.prev_labels = ["","",""];
	this.init();
}

/* Initialize game variables to initial state */
Flash.ScaleDegree.GameController.prototype.init = function () {
	statusModel.start(false);
	statusModel.setIsTimeout(false);
	statusModel.setTimeInterval(cfg.TIMEOUT);
	statusModel.setLevel(1);
	statusModel.setPoints(0);
	statusModel.setAttempts(0);
	statusModel.setScore(0);
	statusModel.setLives(statusModel.MAX_LIVES);
	statusModel.setMaxKeyIndex(statusModel.TIER_1);
	statusView.displayTime("#status_timer", 0);
	notationModel.setKeySignature(this.ks_index);
	this.stave = notationController.drawStaff("staff_paper", 10, 15, 250, this.SCALE);
	notationController.drawClef("staff_paper", this.stave, this.clef_type);
	statusModel.setClef(this.clef_type);
	Games.Common.displayScore();
	return this;
}

Flash.ScaleDegree.GameController.prototype.displayGame = function () {
	this.init();
	statusView.initLivesDisplay("game_lives", statusModel.MAX_LIVES);
	statusView.initHitDisplay("hit_light");
	$('#status_level_label').html("Level:");
	$('#status_level').html("1");
	Games.Common.displaySessionAlert(true, false, false);
}

Flash.ScaleDegree.GameController.prototype.startGame = function (timer_id) {
	var start = statusModel.getStart();
	if (!start){
		statusModel.start(true);
		this.keySpec = statusModel.getKeySpec();
		this.noteSpec = statusModel.getNoteSpec();
		this.displayButtonLabels();
		notationController.drawClef("staff_paper", this.stave, this.clef_type);
		notationController.drawKeySignature("staff_paper", this.stave, this.keySpec);
		notationController.hideNote("staff_paper", this.stave);
		notationController.drawNote("staff_paper", this.stave, this.noteSpec,
						this.noteDur, this.timeSig, this.startx);
		this.startTimer(timer_id, this.timeOut);
	}
	else{
		this.stopGame();
	}
}

Flash.ScaleDegree.GameController.prototype.displayButtonLabels = function () {
	var i, id,
		degree_level = statusModel.getLevel() % 6,
		degree_type,
		labels = statusModel.getTempDegrees(),
		type_label;
	switch (degree_level) {
		case 1:
		case 2:
			degree_type = "num";
			break;
		case 3:
		case 4:
			degree_type = "solf";
			break;
		case 5:
		case 0:
			degree_type = "tech";
			break;
		default:
			degree_type = "num";
			break;
	}

	for (i = 0; i < labels.length; i++) {
		type_label = labels[i].solfege;
		if (degree_type === "num") {
			label = labels[i].number;
		}
		else if (degree_type === "solf") {
			label = labels[i].solfege;
		}
		else {
			label = labels[i].technical;
		}
		id = "#" + $('div.input_box button')[i].id;
		$(id).html("" + label);
		$(id).removeClass(this.prev_labels[i]);
		$(id).addClass(type_label);
		this.prev_labels[i] = type_label;
	}

}
Flash.ScaleDegree.GameController.prototype.startTimer = function (timer_id, timeOut) {
	var t, that = this;
	if (timeOut < 0){
		clearTimeout(this.getT);
		statusModel.setIsTimeout(true);
		this.stopGame();
	}
	else{
		t = setTimeout(function () {
			that.updateTimer(timer_id, timeOut, t)}, 1000);
	}
	statusView.displayTime(timer_id, timeOut);
	return this;
}

Flash.ScaleDegree.GameController.prototype.updateTimer = function (timer_id, time, t) {
	if (statusModel.getStart()) {
		time -= 1;
		statusModel.setTime(time);
		statusModel.setTimeInterval(time);
		this.startTimer(timer_id, time, t);
	}
}

Flash.ScaleDegree.GameController.prototype.continueGame = function (code) {
	var lives, match,
		start = statusModel.getStart(),
		level = statusModel.getLevel();
	statusModel.setInputCode(parseInt(code));
	match = statusModel.getMatch();
	if (match) {
		statusView.updateHitDisplay(true);
	}
	else {
		statusView.updateHitDisplay(false);
		statusModel.decLives();
		lives = statusModel.getLives();
		statusView.updateLivesDisplay();
	}
	if (start && match){
		this.keySpec = statusModel.getKeySpec();
		this.noteSpec = statusModel.getNoteSpec();
		notationController.drawClef("staff_paper", this.stave, this.clef_type);
		notationController.drawKeySignature("staff_paper", this.stave, this.keySpec);
		notationController.hideNote("staff_paper", this.stave);
		notationController.drawNote("staff_paper", this.stave, this.noteSpec,
						this.noteDur, this.timeSig, this.startx);
		this.displayButtonLabels();
		statusModel.addPoint();
		statusModel.calculateScore();
	}
	if (start){
		statusModel.addAttempt();
		Games.Common.displayScore();
	}
}

Flash.ScaleDegree.GameController.prototype.stopGame = function () {
	var next_level, level, game_over;
	statusModel.start(false);
	next_level = statusModel.isLevelAdvance();
	game_over = (statusModel.getLives() > 0) ? false : true;
	if (next_level){
		statusModel.advanceLevel();
		statusModel.addBonus();
	}
	Games.Common.displaySessionAlert(false, game_over, next_level);
	return this;
}

/* Call this function only after a timeout (not after user presses stop button) */
Flash.ScaleDegree.GameController.prototype.resetGame = function () {
	statusModel.setIsTimeout(false);
	statusModel.setTimeInterval(this.timeOut);
	statusModel.setPoints(0);
	statusModel.setAttempts(0);
	this.clef_type = "treble";
	Games.Common.displayScore();
}

Flash.ScaleDegree.GameController.prototype.getStart = function() {
	return statusModel.getStart();
}

/* Use this method to update the game to the next level when in GAME mode,
	ONLY after stopGame() */
Flash.ScaleDegree.GameController.prototype.updateLevel = function () {
	var level = statusModel.getLevel(),
		tier,
		index,
		clef_types = ["treble", "bass", "alto", "tenor"];
	if (statusModel.getIsTimeout()){
		this.resetGame();
	}
	if (level < 25) {
		this.clef_type = ((level % 2) === 1) ? "treble" : "bass" ;
		statusModel.setClef(this.clef_type);
	}
	if (level >= 25 && level < 37) {
		this.clef_type = ((level % 2) === 1) ? "alto" : "tenor";
		statusModel.setClef(this.clef_type);
	}
	if (level >= 37) {
		index = Math.round((Math.random() * 1000)) % 4;
		this.clef_type = clef_types[index];
		statusModel.setClef(this.clef_type);
	}
	if (level < 7) {
		tier = statusModel.TIER_1;
	}
	if ((level >= 7 && level < 13) || (level >= 25 && level < 31)) {
		tier = statusModel.TIER_2;
	}
	if ((level >= 13 && level < 19) || (level >= 31 && level < 37)) {
		tier = statusModel.TIER_3;
	}
	if ((level >= 19 && level < 25) || level >= 37) {
		tier = statusModel.TIER_4;
	}
	statusModel.setMaxKeyIndex(tier);
	Games.Common.displayScore();
	Games.Common.displaySessionAlert(true, false, false);
}
