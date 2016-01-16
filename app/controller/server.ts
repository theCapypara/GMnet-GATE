/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import ServerModel from "../model/server";
import AbstractRegisterableController from "./abstractRegisterableController";

export default class ServerController extends AbstractRegisterableController {
    getModelName() : string {
        return 'server';
    }

    testModelAction(args: any) {
        var model : ServerModel = this.getRegisteredModel();
        model.setTest(args);
        this.respond({"Test": this.getRegisteredModel().getData('Test')});
    }
}