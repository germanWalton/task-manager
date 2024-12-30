"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidationErrors = formatValidationErrors;
function formatValidationErrors(errors) {
    return errors.array().map(error => error.msg).join(", ");
}
