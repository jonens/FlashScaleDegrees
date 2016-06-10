/*
	FlashNotes Keyboard
	Provides basic control functions for games */

/* constructor */
Flash.ScaleDegree.StatusModel = function() {
	this.MAX_LEVEL = 38;
	this.TIER_1 = 2; //max index for key signatures for first tier of play (up to 1 #'s or b's)
	this.TIER_2 = 6; //max index for key signatures for second tier of play (up to 3 #'s or b's)
	this.TIER_3 = 10; //max index for key signatures for third tier of play (up to 5 #'s or b's)
	this.TIER_4 = 14; //max index for key signatures for second tier of play (up to 7 #'s or b's)
	this.MIN_ATTEMPTS = 5;
	this.MIN_PERCENT = 80;
	//this.TIMEOUT = 25;
	this.BONUS = 10;
	this.BONUS_INC = 10;
	this.BONUS_LEVEL = 12;
	this.MAX_LIVES = 5;
	//this.time;
	//this.date;
	//this.date_time;
	this.points = 0;
	this.attempts = 0;
	this.score = 0;
	this.level = 0;
	this.bonus = 0;
	this.lives = 5;
	this.go = false;
	this.timeInterval = this.TIMEOUT;
	this.isTimeOut = false;
	//this.old_score;
	//this.hi_score;
	this.input_code = 0;
	this.value_code = 0;
	this.clef = "treble";
	this.current_ks_index = this.TIER_1;
	this.keyIndex = 0;
	this.key_sigs = {
		0: {spec: "C", majorName: "c_maj", minorName: "a_min", degreeOffset: 0},
		1: {spec: "G", majorName: "g_maj", minorName: "e_min", degreeOffset: 4},
		2: {spec: "F", majorName: "f_maj", minorName: "d_min", degreeOffset: 3},
		3: {spec: "D", majorName: "d_maj", minorName: "b_min", degreeOffset: 1},
		4: {spec: "Bb", majorName: "bf_maj", minorName: "g_min", degreeOffset: 6},
		5: {spec: "A", majorName: "a_maj", minorName: "fs_min", degreeOffset: 5},
		6: {spec: "Eb", majorName: "ef_maj", minorName: "c_min", degreeOffset: 2},
		7: {spec: "E", majorName: "e_maj", minorName: "cs_min", degreeOffset: 2},
		8: {spec: "Ab", majorName: "af_maj", minorName: "f_min", degreeOffset: 5},
		9: {spec: "B", majorName: "b_maj", minorName: "gs_min", degreeOffset: 6},
		10: {spec: "Db", majorName: "df_maj", minorName: "bf_min", degreeOffset: 1},
		11: {spec: "F#", majorName: "fs_maj", minorName: "ds_min", degreeOffset: 3},
		12: {spec: "Gb", majorName: "gf_maj", minorName: "ef_min", degreeOffset: 4},
		13: {spec: "C#", majorName: "cs_maj", minorName: "as_min", degreeOffset: 0},
		14: {spec: "Cb", majorName: "cf_maj", minorName: "af_min", degreeOffset: 0}
	};

	this.scale_degrees = {
		0: {number: 1, solfege: "do", technical: "tonic"},
		1: {number: 2, solfege: "re", technical: "supertonic"},
		2: {number: 3, solfege: "mi", technical: "mediant"},
		3: {number: 4, solfege: "fa", technical: "subdominant"},
		4: {number: 5, solfege: "sol", technical: "dominant"},
		5: {number: 6, solfege: "la", technical: "submediant"},
		6: {number: 7, solfege: "ti", technical: "leading tone"}
	};
	this.temp_sigs = [];
	this.temp_degrees = [];
	this.top_scores = [];
	this.top_times = [];
	this.top_date_strings = [];
	this.top_time_strings = [];

	if (Modernizr.localstorage){
		this.old_score = parseInt(localStorage.getItem("hiscore_degree"));
		this.hi_score = (this.old_score) ? this.old_score : 0;
	}
	else {
		this.hi_score = 0;
	}
}

Flash.ScaleDegree.StatusModel.prototype.getTime = function () {
	return this.time;
}
Flash.ScaleDegree.StatusModel.prototype.setTime = function (t) {
	this.time = t;
}
Flash.ScaleDegree.StatusModel.prototype.setDate = function () {
	this.date = new Date();
	this.date_time = this.date.getTime();
}
Flash.ScaleDegree.StatusModel.prototype.getDateTime = function () {
	return this.date_time;
}
Flash.ScaleDegree.StatusModel.prototype.getDateString = function () {
	var month = "" + (this.date.getMonth() + 1);
	var day = (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate();
	return month + "-" + day + "-" + this.date.getFullYear();
}
Flash.ScaleDegree.StatusModel.prototype.getTimeString = function () {
	var hour = "" + this.date.getHours();
	var minute = (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes();
	var second = (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds();
	return hour + ":" + minute + ":" + second;
}
Flash.ScaleDegree.StatusModel.prototype.addPoint = function () {
	this.points += 1;
}
Flash.ScaleDegree.StatusModel.prototype.setPoints = function (num) {
	this.points = num;
}
Flash.ScaleDegree.StatusModel.prototype.getPoints = function () {
	return this.points;
}
Flash.ScaleDegree.StatusModel.prototype.addAttempt = function () {
	this.attempts += 1;
}
Flash.ScaleDegree.StatusModel.prototype.setAttempts = function (num) {
	this.attempts = num;
}
Flash.ScaleDegree.StatusModel.prototype.getAttempts = function () {
	return this.attempts;
}
Flash.ScaleDegree.StatusModel.prototype.getPercent = function () {
	return Math.floor((this.points / this.attempts) * 100);
}
Flash.ScaleDegree.StatusModel.prototype.calculateScore = function() {
	this.score += (this.points * this.level);
}
Flash.ScaleDegree.StatusModel.prototype.addBonus = function () {
	this.bonus = this.BONUS * this.level;
	this.score += this.bonus;
}
Flash.ScaleDegree.StatusModel.prototype.getBonus = function (){
	return this.bonus;
}
Flash.ScaleDegree.StatusModel.prototype.setScore = function (num) {
	this.score = num;
}
Flash.ScaleDegree.StatusModel.prototype.getScore = function () {
	return this.score;
}
Flash.ScaleDegree.StatusModel.prototype.getHiScore = function () {
	return this.hi_score;
}
Flash.ScaleDegree.StatusModel.prototype.setHiScore = function (num) {
	this.hi_score = num;
	if (Modernizr.localstorage){
		localStorage.setItem("hiscore_degree", this.hi_score);
	}
}
Flash.ScaleDegree.StatusModel.prototype.setLevel = function (lvl) {
	this.level = lvl;
	if (this.level > this.BONUS_LEVEL) {
		this.BONUS += this.BONUS_INC;
	}
}
Flash.ScaleDegree.StatusModel.prototype.getLevel = function () {
	return this.level;
}
Flash.ScaleDegree.StatusModel.prototype.advanceLevel = function () {
	this.setLevel((this.level < this.MAX_LEVEL) ? this.level += 1 : this.MAX_LEVEL);
	return this;
}
Flash.ScaleDegree.StatusModel.prototype.decLives = function () {
	this.lives -= 1;
	if (this.lives < 0){
		this.lives = 0;
	}
}
Flash.ScaleDegree.StatusModel.prototype.setLives = function (num) {
	this.lives = num;
}
Flash.ScaleDegree.StatusModel.prototype.getLives = function () {
	return this.lives;
}
/** @param boolean go Toggles game play  */
Flash.ScaleDegree.StatusModel.prototype.start = function (g) {
	this.go = g;
}
Flash.ScaleDegree.StatusModel.prototype.getStart = function () {
	return this.go;
}
Flash.ScaleDegree.StatusModel.prototype.setTimeInterval = function (num) {
	this.timeInterval = num;
}
Flash.ScaleDegree.StatusModel.prototype.getTimeInterval = function () {
	return this.timeInterval;
}
/* Set a boolean indicating timeOut */
Flash.ScaleDegree.StatusModel.prototype.setIsTimeout = function (to){
	this.isTimeOut = to;
}
/* Get boolean indicating timeOut */
Flash.ScaleDegree.StatusModel.prototype.getIsTimeout = function () {
	return this.isTimeOut;
}

Flash.ScaleDegree.StatusModel.prototype.getMaxKeyIndex = function () {
	return this.current_ks_index;
}

Flash.ScaleDegree.StatusModel.prototype.setMaxKeyIndex = function (index) {
	this.current_ks_index = index;
}

/* Returns the spec for the currently-displayed key signature */
Flash.ScaleDegree.StatusModel.prototype.getKeySpec = function () {
	var shuffled_keys = [], i, j,
		max = this.getMaxKeyIndex();

	//shuffle the key signatures (Fisher�Yates shuffle, inside-out)
	//To initialize an array a of n elements to a randomly shuffled copy of
	//source, both 0-based:
	shuffled_keys[0] = this.key_sigs[0];
	for (i = 1; i <= max; i++) {
		j = Math.round(Math.random() * 100) % (i + 1);
		shuffled_keys[i] = shuffled_keys[j];
		shuffled_keys[j] = this.key_sigs[i];
	}
	for (i = 0; i < 3; i++) {
		this.temp_sigs[i] = shuffled_keys[i];
	}
	j = Math.round(Math.random() * 1000) % 3;
	this.keyIndex = this.temp_sigs[j].degreeOffset;
	this.keySpec = this.temp_sigs[j].spec;
	return this.keySpec;
}

Flash.ScaleDegree.StatusModel.prototype.getTempSigs = function () {
	return this.temp_sigs;
}

/* Returns the spec for the currently-displayed note */
Flash.ScaleDegree.StatusModel.prototype.getNoteSpec = function () {
	var shuffled_degrees = [],
		i, j,
		note_index,
		note_spec,
		octave = Math.round((Math.random() * 1000) % 4) + 2;

	//shuffle the note indices (Fisher�Yates shuffle, inside-out)
	shuffled_degrees[0] = this.scale_degrees[0];
	for (i = 1; i < 7; i++) {
		j = Math.round(Math.random() * 100) % (i + 1);
		shuffled_degrees[i] = shuffled_degrees[j];
		shuffled_degrees[j] = this.scale_degrees[i];
	}
	for (i = 0; i < 3; i++) {
		this.temp_degrees[i] = shuffled_degrees[i];
	}
	j = Math.round(Math.random() * 1000) % 3;
	this.value_code = j;
	note_index = (this.temp_degrees[j].number - 1 + this.keyIndex) % 7;
	switch (this.clef) {
		case "treble":
			if (octave < 4) {
				if (note_index < 6) {
					octave = 4;
				}
				else {
					octave = 3;
				}
			}
			if (octave > 5) octave = 5;
			break;
		case "bass":
			if (octave < 3 && note_index < 1) octave = 3;
			if (octave > 3) {
				if (note_index > 1) {
					octave = 3;
				}
				else octave = 4;
			}
			break;
		case "alto":
			if (octave < 3) octave = 3;
			if (octave > 4) {
				if (note_index > 0 ) octave = 4;
			}
			break;
		case "tenor":
			if (octave < 3) {
				if (note_index < 5) octave = 3;
			}
			if (octave > 4) {
				if (note_index < 6) {
					octave = 4;
				}
				else octave = 3;
			}
			break;
	}
	note_spec = Vex.Flow.integerToNoteLetter(note_index) + "/" + octave;
	return note_spec;
}

Flash.ScaleDegree.StatusModel.prototype.getTempDegrees = function () {
	return this.temp_degrees;
}

Flash.ScaleDegree.StatusModel.prototype.setInputCode = function (code) {
	this.input_code = code;
}

Flash.ScaleDegree.StatusModel.prototype.getMatch = function () {
	return (this.input_code === this.value_code);
}

/** @return true if level advances, false otherwise */
Flash.ScaleDegree.StatusModel.prototype.isLevelAdvance = function () {
	var advance = ((this.getPercent() >= this.MIN_PERCENT) && (this.getIsTimeout()) &&
				(this.getAttempts() >= this.MIN_ATTEMPTS)) ? true : false;
	return advance;
}

Flash.ScaleDegree.StatusModel.prototype.setClef = function (clef) {
	this.clef = clef;
	return this;
}

Flash.ScaleDegree.StatusModel.prototype.getClef = function (clef) {
	return this.clef = clef;
}
