// Text Censoring
// Author: Calcaware

module.exports = class Text {

	constructor(config) {
		this.config = {
			"replacement": "[censored]",
			"replacement_type": "word", // characters
			"inclusions": [ "fuck", "fucker", "shit", "ass", "asshole", "fucking" ],
			"exclusions": [ "puck", "ship", "shirt" ],
			"similar": {
				"enable": false, // Check Edit Distance
				"threshold": 1
			},
			"sentiment": {
				"enable": false,
				"threshold": 1
			}
		};
		if (config)
			this.config = Object.assign(this.config, config);
	}


	// Config

	getConfig() {
		return this.config;
	}

	setConfig(config) {
		if (config)
			this.config = config;
		return this;
	}


	// Replacement

	getReplacement() {
		return this.config.replacement;
	}

	setReplacement(replacement) {
		if (replacement) {
			if (typeof replacement !== 'string')
				throw new Error('Replacement value must be of type string.');
			this.config.replacement = replacement;
		}
		else
			throw new Error('Replacement value not given.');
		return this;
	}

	getReplacementType() {
		return this.config.replacement_type;
	}

	setReplacementType(type) {
		if (type != "word" && type != "characters")
			throw new Error('Valid replacement types are "word" and "characters".');
		this.config.replacement_type = type;
		return this;
	}


	// Inclusions

	getInclusions() {
		return this.config.inclusions;
	}

	setInclusions(inclusions) {
		if (inclusions)
			this.config.inclusions = inclusions;
		return this;
	}

	addInclusion(inclusion) {
		if (typeof inclusion !== 'string')
			throw new Error('Inclusion must be of type string.');
		this.config.inclusions.push(inclusion);
		return this;
	}


	// Exclusions

	getExclusions() {
		return this.config.exclusions;
	}

	setExclusions(exclusions) {
		if (exclusions)
			this.config.exclusions = exclusions;
		return this;
	}

	addExclusion(exclusion) {
		if (typeof exclusion !== 'string')
			throw new Error('Exclusion must be of type string.');
		this.config.exclusions.push(exclusion);
		return this;
	}


	// Similarity

	getSimilar() {
		return this.config.similar.enable;
	}

	setSimilar(similar) {
		if (typeof similar !== 'boolean')
			throw new Error('Similar must be of type boolean.');
		this.config.similar.enable = similar;
		return this;
	}

	getSimilarityThreshold() {
		return this.config.similar.threshold;
	}

	setSimilarityThreshold(threshold) {
		if (typeof threshold !== 'number' || threshold < 1)
			throw new Error('Similarity threshold must be of type number with a value greater than 1.');
		this.config.similar.threshold = threshold;
		return this;
	}


	// Censoring

	censor(text) {
		
		if (typeof text !== 'string')
				throw new Error('No text given to censor.');
		
		let censored = text.split(" ");

		for (let i = 0; i < censored.length; i++) { // For each word in the text

			for (let j = 0; j < this.config.inclusions.length; j++) { // For each word in inclusions

				// Remove Punctuation for Matching
				let cleaned = censored[i].replace(/\W/g, '');
				let was_cleaned = false;
				if (censored[i] != cleaned)
					was_cleaned = true;
				
				if ((this.config.similar.enable && this._editDistance(cleaned, this.config.inclusions[j]) <= this.config.similar.threshold) || (!this.config.similar.enable && cleaned == this.config.inclusions[j])) {

					if (this.config.exclusions.indexOf(censored[i]) !== -1) // If a literal exclusion is found skip this word
						continue;

					if (this.config.replacement_type == "word") {
						if (was_cleaned)
							censored[i] = censored[i].replace(cleaned, this.config.replacement);
						else
							censored[i] = this.config.replacement;
					}
					else if (this.config.replacement_type == "characters") {
						if (was_cleaned)
							censored[i] = censored[i].replace(cleaned, Array(censored[i].length).join(this.config.replacement));
						else
							censored[i] = censored[i].replace(/./g, this.config.replacement);
					}

				}

			}

		}

		return censored.join(" ");
	}


	// Tools

	_editDistance(str1 = '', str2 = '') {
		const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
		for (let i = 0; i <= str1.length; i += 1)
			track[0][i] = i;
		for (let j = 0; j <= str2.length; j += 1)
			track[j][0] = j;
		for (let j = 1; j <= str2.length; j += 1) {
			for (let i = 1; i <= str1.length; i += 1) {
				const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
				track[j][i] = Math.min(
					track[j][i - 1] + 1, // deletion
					track[j - 1][i] + 1, // insertion
					track[j - 1][i - 1] + indicator, // substitution
				);
			}
		}
		return track[str2.length][str1.length];
	}

} 