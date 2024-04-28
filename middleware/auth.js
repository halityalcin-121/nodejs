const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../models/user');
const { promisify } = require('util');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new errorResponse('Lütfen giris yapiniz.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'Bu kullanici artik yok.',
                401
            )
        );
    }
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new errorResponse('Sifre degistirilmis lütfen tekrar giris yapiniz.', 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new errorResponse(
                    `Kullanici rolü ${req.user.role} ile yetkiniz yok`,
                    403
                )
            );
        }
        next();
    };
};