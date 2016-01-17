/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

import AbstractModel from "./abstractModel";

export default class ServerModel extends AbstractModel {
    public static maximumInstances = 1;

    public setTest(youSaid : any) {
        this.setData('Test', {"testMsg":'It work\'s!',"youSaid":youSaid});
    }
}
