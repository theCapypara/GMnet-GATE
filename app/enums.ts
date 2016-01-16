/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

/**
 * This module contains constants and enums.
 */

/**
 * The last mayor version number of GMnet PUNCH
 * supported by GMnet GATE.
 * @type {number}
 */
export const VERSION_MAYOR : number = 1400;

/**
 * Version of GMnet GATE
 * @type {string}
 */
export const VERSION : string = '1.4.0';

/**
 * TCP and UDP constants
 */
export const enum ConnectionType {
    TCP, UDP
}

/**
 * Response status codes
 */
export const enum ResponseStatus {
    SUCCESS = 0,
    GENERIC_ERROR = 1,
    METHOD_NOT_FOUND = 2,
    MODEL_ERROR = 3,
    MODEL_NOT_FOUND = 4,
    INVALID_METHOD = 5,
    CONTROLLER_INVALID = 6,
    CONTROLLER_NOT_FOUND = 7,
    NO_MODEL_FOR_CONTROLLER = 8,
    MODEL_INVALID = 9,
    MODEL_CLASS_NOT_FOUND = 10,
    MODEL_REGISTRATION_OVER_UDP = 11

}

export const GAME_MAKER_STRING_SEPARATOR = 0;