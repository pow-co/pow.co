"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperChat = void 0;
const scrypt_ts_1 = require("scrypt-ts");
class SuperChat extends scrypt_ts_1.SmartContract {
    constructor(message) {
        super(...arguments);
        this.message = message;
    }
    cancel() {
        (0, scrypt_ts_1.assert)(true);
    }
    static fromMessage(message) {
        return new SuperChat((0, scrypt_ts_1.toByteString)(message, true));
    }
}
__decorate([
    (0, scrypt_ts_1.prop)()
], SuperChat.prototype, "message", void 0);
__decorate([
    (0, scrypt_ts_1.method)()
], SuperChat.prototype, "cancel", null);
exports.SuperChat = SuperChat;
//# sourceMappingURL=superChat.js.map