import {ApiError} from "../utils/apiErrorUtility.js";
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    console.error(err); // Log unexpected errors
    res.status(500).json({ success: false, message: "Internal Server Error" });
};

export  {errorMiddleware};
