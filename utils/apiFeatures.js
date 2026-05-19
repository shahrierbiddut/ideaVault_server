class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        if (this.queryString.search) {
            this.query = this.query.find({
                title: { $regex: this.queryString.search, $options: "i" },
            });
        }
        return this;
    }

    filterByCategory() {
        if (this.queryString.category) {
            this.query = this.query.find({ category: this.queryString.category });
        }
        return this;
    }

    filterByDateRange() {
        const createdAt = {};
        if (this.queryString.startDate) {
            createdAt.$gte = new Date(this.queryString.startDate);
        }
        if (this.queryString.endDate) {
            createdAt.$lte = new Date(this.queryString.endDate);
        }

        if (Object.keys(createdAt).length > 0) {
            this.query = this.query.find({ createdAt });
        }
        return this;
    }

    sort() {
        const sortMap = {
            newest: "-createdAt",
            oldest: "createdAt",
            popular: "-likesCount -commentsCount",
            commented: "-commentsCount -likesCount",
        };

        const sortBy = sortMap[this.queryString.sort] || "-createdAt";
        this.query = this.query.sort(sortBy);
        return this;
    }

    paginate() {
        const page = Math.max(Number(this.queryString.page) || 1, 1);
        const limit = Math.max(Number(this.queryString.limit) || 6, 1);
        const skip = (page - 1) * limit;

        this.paginationResult = { page, limit, skip };
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;