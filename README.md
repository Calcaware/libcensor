# libcensor
A very functional, yet simple and light censoring library with no required dependencies.

### Usage:
```
// Censor by Similarity with Replacement Word
const Censor = require("libcensor");
const textCensor = Censor.Text()
    .setSimilarity(true)
    .setSimilarityThreshold(1)
    .setInclusions([ "fart", "poop", "badword" ])
    .setExclusions([ "p0op"])
    .setReplacementType("word")
    .setReplacement("[censored]");
var result = textCensor.censor("I have to f4rt. It is not cool.");
// I have to [censored]. It is not cool.
```

```
// Censor Literally with Replacement Characters
const Censor = require("libcensor");
const textCensor = Censor.Text()
    .setSimilarity(false) // Default
    .setSimilarityThreshold(1)
    .setInclusions([ "fart", "poop", "badword" ])
    .setExclusions([ "p0op"])
    .setReplacementType("characters")
    .setReplacement("*");
var result = textCensor.censor("I have to fart. It is not cool.");
// I have to ****. It is not cool.
```
Feel free to use this list: https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/blob/master/en
