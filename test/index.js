// Censor Test
// Author: Calcaware

const Censor = require("../");
censor = new Censor.Text().setSimilar(true).setSimilarityThreshold(1).setReplacement("*").setReplacementType("characters");

let result = censor.censor("You are a sh1t ass. piece of fucking fucker.")
console.log(result);
