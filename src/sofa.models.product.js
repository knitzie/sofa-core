'use strict';
/**
 * @name Product
 * @namespace sofa.models.Product
 *
 * @description
 * A model that represents a Product object and adds convenient methods to it.
 */
sofa.define('sofa.models.Product', function () {});

/**
 * @method getImage
 * @memberof sofa.models.Product
 *
 * @description
 * Returns the url to the product image by a given size. If no image exists in that
 * size, it returns a placeholder image url.
 *
 * @param {string} size Image size identifier.
 *
 * @return {string} Image url.
 */
sofa.models.Product.prototype.getImage = function (size) {
    for (var i = 0; i < this.images.length; i++) {
        if (this.images[i].sizeName.toLowerCase() === size) {
            return this.images[i].url;
        }
    }

    return sofa.Config.mediaPlaceholder;
};

/**
 * @method getAllImages
 * @memberof sofa.models.Product
 *
 * @description
 * Returns all images of the product in size 'large'.
 *
 * @return {array} Arraz of image urls.
 */
sofa.models.Product.prototype.getAllImages = function () {

    if (!this._allImages) {
        this._allImages = [{ url: this.getImage('large') }].concat(this.imagesAlt);
    }

    return this._allImages;
};

/**
 * @method hasMultipleImages
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if a product supports multiple images.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasMultipleImages = function () {
    return this.getAllImages().length > 0;
};

/**
 * @method getBasePriceInfo
 * @memberof sofa.models.Product
 *
 * @description
 * Returns some additional information about the product.
 * TODO: This is pure shit. I need to talk to Felix got get that clean
 * It's only in here to keep some German clients happy that rely on it.
 * We need to make it more flexibile & localizable
 */
sofa.models.Product.prototype.getBasePriceInfo = function () {
    if (this.custom1 > 0) {
        if (this.custom3 === 'kg') {
            return 'entspricht ' + sofa.Util.toFixed(this.custom1, 2) + ' € pro 1 Kilogramm (kg)';
        } else if (this.custom3 === 'St') {
            return 'entpricht ' + sofa.Util.toFixed(this.custom1, 2) + ' € pro 1 Stück (St)';
        } else if (this.custom3 === 'L') {
            return 'entpricht ' + sofa.Util.toFixed(this.custom1, 2) + ' € pro 1 Liter (l)';
        } else if (sofa.Util.isString(this.custom3) && this.custom3.length > 0) {
            return 'entpricht ' + sofa.Util.toFixed(this.custom1, 2) + ' € pro ' + this.custom3;
        }
    }

    return '';
};

/**
 * @method hasOldPrice
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if the product has an old price.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasOldPrice = function () {
    return sofa.Util.isNumeric(this.priceOld) && this.priceOld > 0;
};

/**
 * @method hasVariants
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if the product supports variants.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasVariants = function () {
    return !!(this.variants && this.variants.length > 0);
};

/**
 * @method isOutOfStock
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if the product is currently out of stock.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.isOutOfStock = function () {

    //this means, it's always in stock
    if (this.qty === undefined || this.qty === null) {
        return false;
    }

    // a product is considered out of stock if:

    // -it has no variants and the qty is less or equal zero
    // -it has variants and all of them have a stock of less or equal zero

    return (!this.hasVariants() && this.qty <= 0) || this.areAllVariantsOutOfStock();
};

/**
 * @method areAllVariantsOutOfStock
 * @memberof sofa.models.Product
 *
 * @description
 * Requests if all variants of the product are out of stock.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.areAllVariantsOutOfStock = function () {
    if (this.hasVariants()) {
        return sofa.Util.every(this.variants, function (variant) {
            return variant.stock <= 0;
        });
    }

    return false;
};
