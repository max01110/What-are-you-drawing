const slugW = require("random-word-slugs");

function randomWord () {
    const slug = slugW.generateSlug(1, {
        format: "camel",
        partsOfSpeech: ["noun"],
    });
    return slug;
}

module.exports = {
    randomWord
}