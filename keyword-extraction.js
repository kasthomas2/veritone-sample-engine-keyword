module.exports = {

    getOutput: (buffer, configs) => {

        console.log("\n Inside getOutput() ");

        // Private inner method.
        // Pass the chunk buffer (as a string) in, get unduped word-array out:
        let getWordArray = (buffer) => {
            console.log("\n Inside getWordArray() ");

            let text = buffer.replace(/[^0-9a-zA-Z-']+/g, " ");
            let words = text.split(/\s+/);
            let results = [];
            let undupe = {};

            console.log("words: " + words.length);

            words.forEach(word => {
                if (word.length && word.indexOf("-") == 0)
                    return;
                let wordLowerCased = word.toLowerCase();
                if (!(wordLowerCased in undupe) && word.length)
                    undupe[wordLowerCased] = word;
            });

            console.log("We did forEach on words.");

            for (var k in undupe)
                results.push(undupe[k]);
            return results;
        };

        // Private inner method.
        // Pass word array in, get [ keywordObject ] out
        let getVtnObjectArray = (input) => {

            console.log("\n Inside getVtnOutputArray()");

            function KeywordObject(labelValue) {
                this.type = "keyword";
                this.label = labelValue;
            }

            let output = [];
            input.forEach(word => {
                output.push(new KeywordObject(word));
            });

            return output;
        };

        try {
            let words = getWordArray(buffer);
            let vtnObjectArray = getVtnObjectArray(words);
            let output = {
                "validationContracts": [
                    "keyword"
                ],
                "object": vtnObjectArray
            };
            return output;
        } catch (e) {
            console.log("Exception: " + e.toString())
        }
        return ""; // we reach this iff an exception happened
    }

};
