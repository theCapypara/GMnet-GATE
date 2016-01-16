/* GMnet PUNCH
 * Licensed under the MIT license.
 * Please see the LICENSE file for more information.
 */

/**
 * An abstract model used as a base for all models.
 */
abstract class AbstractModel {
    protected data: any = {};

    /**
     * Set custom data
     * @param key
     * @param value
     */
    setData(key : string, value : any) : void {
        this.data[key] = value;
    }

    /**
     * Get previously set data
     * @param key
     * @returns {*}
     */
    getData(key : string) : any {
        return this.data[key];
    }

    /**
     * Return all data set on this model
     * @returns {*}
     */
    getAllData() : any {
        return this.data;
    }

    /**
     * Do something before this model get's deleted.
     */
    beforeDelete() {}
}
export default AbstractModel;
