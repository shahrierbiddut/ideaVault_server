const APIFeatures = require("../utils/apiFeatures");

const buildIdeaListQuery = (baseQuery, queryString) => {
    const features = new APIFeatures(baseQuery, queryString)
        .search()
        .filterByCategory()
        .filterByDateRange()
        .sort()
        .paginate();

    return features;
};

module.exports = { buildIdeaListQuery };