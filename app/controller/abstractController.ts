/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import {ConnectionInfo} from "../api";
import {Request} from "../api";
import * as enums from "../enums";

/**
 * An abstract Controller to use as a base for all controllers.
 */
abstract class AbstractController {
    protected connectionInfo: ConnectionInfo;
    protected originalRequestData: Request;

    setConnectionInfo(connectionInfo : ConnectionInfo) : void {
        this.connectionInfo = connectionInfo;
    }

    /**
     * Get information about the client that called this controller
     * @returns {ConnectionInfo}
     */
    getConnectionInfo() : ConnectionInfo {
        return this.connectionInfo;
    }

    setOriginalRequestData(originalRequestData : Request) : void {
        this.originalRequestData = originalRequestData;
    }

    /**
     * Get the information provided with the request
     * @returns {ConnectionInfo}
     */
    getOriginalRequestData() : Request {
        return this.originalRequestData;
    }

    /**
     * Shortcut to the connectionInstance respond method
     * Sends a message to the connected client
     */
    respond(response: any, status? : enums.ResponseStatus, errorMessage? : string) : void {
        this.getConnectionInfo().connectionInstance.respond(response, this, status, errorMessage);
    }

    /**
     * @todo
     */
    preDispatch() {
        return true;
    }
}
export default AbstractController;
