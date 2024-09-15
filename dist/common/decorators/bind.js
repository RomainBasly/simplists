"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = void 0;
function bind(target, key, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjustedDescriptor;
}
exports.bind = bind;
