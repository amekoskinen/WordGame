const { TheCatAPI } = require("@thatapicompany/thecatapi");
const theCatAPI = new TheCatAPI(process.env.CAT_API_KEY);

const getCatImage = async function() {
    try {
    const image = await theCatAPI.images.searchImages({});
    return image[0].url
    } catch (error) {
        console.log("Problem getting cat photo", error)
    }
}

module.exports = getCatImage