import mongoose from "mongoose";

const validateMongodbId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid MongoDB ID");
    }
};

export default validateMongodbId;
