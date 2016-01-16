/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import * as enums from '../enums';
import {Response} from "../api";
import AbstractController from "../controller/abstractController";

interface ConnectionInstanceInterface {
    respond(response: any, controller: AbstractController, status? : enums.ResponseStatus, errorMessage? : string);
    stop();
}
export default ConnectionInstanceInterface;