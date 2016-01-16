/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as enums from './enums';

/**
 * An error thrown by GMnet GATE
 * Extended with errorCode/reponseCode
 */
export default class GateError extends Error {
    constructor(public message: string, public errorCode: enums.ResponseStatus) {
        super(message);
    }
}