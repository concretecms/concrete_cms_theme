/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap */ "bootstrap");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _frontend_locations_country_data_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./frontend/locations/country-data-link */ "./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend/locations/country-data-link.js");
/* harmony import */ var _frontend_locations_country_data_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_frontend_locations_country_data_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _frontend_locations_country_stateprovince_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./frontend/locations/country-stateprovince-link */ "./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend/locations/country-stateprovince-link.js");
/* harmony import */ var _frontend_locations_country_stateprovince_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_frontend_locations_country_stateprovince_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _assets_cms_js_vue_Manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../assets/cms/js/vue/Manager */ "./node_modules/@concretecms/bedrock/assets/cms/js/vue/Manager.js");


// We will be refactoring this, also it causes problems with installation.
// import './frontend/async-thumbnail-builder'



// Let us use Vue with our theme JS

_assets_cms_js_vue_Manager__WEBPACK_IMPORTED_MODULE_4__["default"].bindToWindow(window);
window.$ = window.jQuery = (jquery__WEBPACK_IMPORTED_MODULE_0___default());

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend/locations/country-data-link.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend/locations/country-data-link.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var USE_MUTATIONOBSERVER = !!(window.MutationObserver && window.MutationObserver.prototype && window.MutationObserver.prototype.observe);
function loadDataForCountry(countryCode, callback) {
  if (typeof countryCode !== 'string' || $.trim(countryCode) === '') {
    callback(countryCode, {
      statesProvices: {},
      addressUsedFields: []
    });
    return;
  }
  if (Object.prototype.hasOwnProperty.call(loadDataForCountry.cache, countryCode)) {
    callback(countryCode, loadDataForCountry.cache[countryCode]);
    return;
  }
  callback(countryCode, {
    statesProvices: {},
    addressUsedFields: []
  });
  $.ajax({
    cache: true,
    // Needed because we may change the current locale
    data: {
      countryCode: countryCode,
      activeLocale: CCM_ACTIVE_LOCALE
    },
    dataType: 'json',
    method: 'GET',
    url: CCM_DISPATCHER_FILENAME + '/ccm/system/country-data-link/all'
  }).done(function (data) {
    var statesProvinces = {};
    if (data.statesProvices instanceof Object) {
      statesProvinces = data.statesProvices;
    }
    var addressUsedFields = [];
    if (data.addressUsedFields instanceof Array) {
      addressUsedFields = data.addressUsedFields;
    }
    loadDataForCountry.cache[countryCode] = {
      statesProvices: statesProvinces,
      addressUsedFields: addressUsedFields
    };
  }).fail(function (xhr, status, error) {
    if (window.console && window.console.error) {
      window.console.error(xhr.responseJSON || error);
    }
    loadDataForCountry.cache[countryCode] = {
      statesProvices: {},
      addressUsedFields: []
    };
  }).always(function () {
    callback(countryCode, loadDataForCountry.cache[countryCode]);
  });
}
loadDataForCountry.cache = {};
function TextReplacer($text) {
  var me = this;
  me.enabled = false;
  me.$text = $text;
  me.$select = $('<select />');
  if (USE_MUTATIONOBSERVER) {
    me.mutationObserver = new window.MutationObserver(function (records) {
      me.updateSelectAttributes();
      me.$text.hide();
      me.$select.show();
    });
  } else {
    me.mutationObserver = null;
  }
  me.originalFocus = me.$text[0].focus;
  me.$text[0].focus = function () {
    if (me.enabled) {
      me.$select.focus();
    } else {
      me.originalFocus.apply(me.$text[0]);
    }
  };
}
TextReplacer.prototype = {
  updateSelectAttributes: function updateSelectAttributes() {
    var me = this;
    $.each(['class', 'style', 'required'], function (index, attributeName) {
      var attributeValue = me.$text.attr(attributeName);
      if (typeof attributeValue === 'string') {
        me.$select.attr(attributeName, attributeValue);
      }
    });
  },
  setEnabled: function setEnabled(enable) {
    var me = this;
    enable = !!enable;
    if (enable === me.enabled) {
      return;
    }
    if (enable) {
      me.updateSelectAttributes();
      me.$text.before(me.$select);
      me.$text.hide();
      me.enabled = true;
      if (me.mutationObserver !== null) {
        setTimeout(function () {
          if (me.enabled !== true) {
            return;
          }
          me.mutationObserver.disconnect();
          me.mutationObserver.observe(me.$text[0], {
            attributes: true
          });
        }, 0);
      }
    } else {
      if (me.mutationObserver !== null) {
        me.mutationObserver.disconnect();
      }
      me.enabled = false;
      me.$select.detach();
      me.$text.show();
    }
  }
};
function Link($country, $stateprovince, config) {
  var me = this;
  me.$country = $country;
  me.$stateprovinceWrapper = $stateprovince;
  if ($stateprovince.is('input')) {
    me.$stateprovince = $stateprovince;
  } else {
    me.$stateprovince = $stateprovince.find('input:first');
  }
  me.config = config;
  me.replacer = new TextReplacer(me.$stateprovince);
  me.$stateprovinceSelect = me.replacer.$select;
  me.$country.on('change', function () {
    me.countryChanged();
  });
  me.$stateprovinceSelect.on('change', function () {
    me.$stateprovince.val(me.$stateprovinceSelect.val()).trigger('change');
  });
  me.countryChanged(true);
}
Link.prototype = {
  countryChanged: function countryChanged(initializing) {
    var me = this;
    loadDataForCountry(me.$country.val(), function (countryCode, countryData) {
      if (me.$country.val() !== countryCode) {
        return;
      }
      me.$stateprovinceSelect.empty();
      if (!initializing && me.config.clearStateProvinceOnChange) {
        me.$stateprovince.val('');
      }
      if (me.config.hideUnusedStateProvinceField) {
        if (countryData.addressUsedFields.indexOf('state_province') > -1) {
          me.$stateprovinceWrapper.show();
        } else {
          me.$stateprovinceWrapper.hide();
        }
      }
      var n = Object.keys(countryData.statesProvices).length;
      if (n === 0) {
        me.replacer.setEnabled(false);
      } else {
        var selectedStateprovince = $.trim(me.$stateprovince.val());
        me.$stateprovinceSelect.append($('<option value="" selected="selected" />').text(''));
        $.each(countryData.statesProvices, function (spCode, name) {
          var $o = $('<option />').val(spCode).text(name);
          if (spCode === selectedStateprovince) {
            $o.attr('selected', 'selected');
          }
          me.$stateprovinceSelect.append($o);
        });
        me.replacer.setEnabled(true);
      }
      me.$country.trigger('country-data', [countryData]);
    });
  }
};
Link.withCountryField = function ($country, config) {
  config = $.extend({
    hideUnusedStateProvinceField: false,
    clearStateProvinceOnChange: false
  }, config);
  var $parent = $country.closest('form');
  if ($parent.length === 0) {
    $parent = $(document.body);
  }
  var result = [];
  $parent.find('[data-countryfield="' + $country.attr('id') + '"]').each(function () {
    result.push(new Link($country, $(this), config));
  });
  switch (result.length) {
    case 0:
      return null;
    case 1:
      return result[0];
    default:
      return result;
  }
};
__webpack_require__.g.ConcreteCountryDataLink = Link;

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend/locations/country-stateprovince-link.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend/locations/country-stateprovince-link.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var USE_MUTATIONOBSERVER = !!(window.MutationObserver && window.MutationObserver.prototype && window.MutationObserver.prototype.observe);
function loadStateprovincesForCountry(countryCode, callback) {
  if (typeof countryCode !== 'string' || $.trim(countryCode) === '') {
    callback(countryCode, []);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(loadStateprovincesForCountry.cache, countryCode)) {
    callback(countryCode, loadStateprovincesForCountry.cache[countryCode]);
    return;
  }
  callback(countryCode, []);
  $.ajax({
    cache: true,
    // Needed because we may change the current locale
    data: {
      countryCode: countryCode,
      activeLocale: CCM_ACTIVE_LOCALE
    },
    dataType: 'json',
    method: 'GET',
    url: CCM_DISPATCHER_FILENAME + '/ccm/system/country-stateprovince-link/get_stateprovinces'
  }).fail(function (xhr, status, error) {
    if (window.console && window.console.error) {
      window.console.error(xhr.responseJSON || error);
    }
    loadStateprovincesForCountry.cache[countryCode] = [];
  }).success(function (data) {
    loadStateprovincesForCountry.cache[countryCode] = data instanceof Array ? data : [];
  }).always(function () {
    callback(countryCode, loadStateprovincesForCountry.cache[countryCode]);
  });
}
loadStateprovincesForCountry.cache = {};
function TextReplacer($text) {
  var me = this;
  me.enabled = false;
  me.$text = $text;
  me.$select = $('<select />');
  if (USE_MUTATIONOBSERVER) {
    me.mutationObserver = new window.MutationObserver(function (records) {
      me.updateSelectAttributes();
      me.$text.hide();
      me.$select.show();
    });
  } else {
    me.mutationObserver = null;
  }
  me.originalFocus = me.$text[0].focus;
  me.$text[0].focus = function () {
    if (me.enabled) {
      me.$select.focus();
    } else {
      me.originalFocus.apply(me.$text[0]);
    }
  };
}
TextReplacer.prototype = {
  updateSelectAttributes: function updateSelectAttributes() {
    var me = this;
    $.each(['class', 'style', 'required'], function (index, attributeName) {
      var attributeValue = me.$text.attr(attributeName);
      if (typeof attributeValue === 'string') {
        me.$select.attr(attributeName, attributeValue);
      }
    });
  },
  setEnabled: function setEnabled(enable) {
    var me = this;
    enable = !!enable;
    if (enable === me.enabled) {
      return;
    }
    if (enable) {
      me.updateSelectAttributes();
      me.$text.before(me.$select);
      me.$text.hide();
      me.enabled = true;
      if (me.mutationObserver !== null) {
        setTimeout(function () {
          if (me.enabled !== true) {
            return;
          }
          me.mutationObserver.disconnect();
          me.mutationObserver.observe(me.$text[0], {
            attributes: true
          });
        }, 0);
      }
    } else {
      if (me.mutationObserver !== null) {
        me.mutationObserver.disconnect();
      }
      me.enabled = false;
      me.$select.detach();
      me.$text.show();
    }
  }
};
function Link($country, $stateprovince) {
  var me = this;
  me.$country = $country;
  me.$stateprovince = $stateprovince;
  me.replacer = new TextReplacer(me.$stateprovince);
  me.$stateprovinceSelect = me.replacer.$select;
  me.$country.on('change', function () {
    me.countryChanged();
  }).trigger('change');
  me.$stateprovinceSelect.on('change', function () {
    me.$stateprovince.val(me.$stateprovinceSelect.val()).trigger('change');
  });
}
Link.prototype = {
  countryChanged: function countryChanged() {
    var me = this;
    loadStateprovincesForCountry(me.$country.val(), function (countryCode, stateprovinceList) {
      if (me.$country.val() !== countryCode) {
        return;
      }
      me.$stateprovinceSelect.empty();
      var n = stateprovinceList.length;
      if (n === 0) {
        me.replacer.setEnabled(false);
      } else {
        var selectedStateprovince = $.trim(me.$stateprovince.val());
        me.$stateprovinceSelect.append($('<option value="" selected="selected" />').text(''));
        for (var i = 0, $o; i < n; i++) {
          $o = $('<option />').val(stateprovinceList[i][0]).text(stateprovinceList[i][1]);
          if (stateprovinceList[i][0] === selectedStateprovince) {
            $o.attr('selected', 'selected');
          }
          me.$stateprovinceSelect.append($o);
        }
        me.replacer.setEnabled(true);
      }
    });
  }
};
Link.withCountryField = function ($country) {
  var $parent = $country.closest('form');
  if ($parent.length === 0) {
    $parent = $(document.body);
  }
  var result = [];
  $parent.find('input[data-countryfield="' + $country.attr('id') + '"]').each(function () {
    result.push(new Link($country, $(this)));
  });
  switch (result.length) {
    case 0:
      return null;
    case 1:
      return result[0];
    default:
      return result;
  }
};
__webpack_require__.g.ConcreteCountryStateprovinceLink = Link;

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/js/vue/Manager.js":
/*!************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/js/vue/Manager.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Manager)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


/**
 * Typescript interface
 *\/
 interface Context {
    [key: String]: {} | Component
}
 /**/
var Manager = /*#__PURE__*/function () {
  /**
   * Create a new Manager
   *
   * @param {{[key: String]: Context}} contexts A list of component lists keyed by context name
   */
  function Manager(contexts) {
    _classCallCheck(this, Manager);
    this.contexts = contexts || {};
  }

  /**
   * Ensures that our Concrete.Vue manager is available on the window object.
   * Note: Do NOT call this before the global Concrete object is created in the CMS context.
   *
   * @param {Window} window
   */
  _createClass(Manager, [{
    key: "getContext",
    value:
    /**
     * Returns a list of components for the current string `context`
     *
     * @param {String} context
     * @returns {{[key: String]: {}}} A list of components keyed by their handle
     */
    function getContext(context) {
      return this.contexts[context] || {};
    }

    /**
     * Actives a particular context (and its components) for a particular selector.
     *
     * @param {String} context
     * @param {Function} callback (Vue, options) => new Vue(options)
     */
  }, {
    key: "activateContext",
    value: function activateContext(context, callback) {
      var _this = this;
      // This is stupid but sometimes activateContext and extendContext are called essentially simultaneously and we need this to fire after
      setTimeout(function () {
        return callback((vue__WEBPACK_IMPORTED_MODULE_0___default()), {
          components: _this.getContext(context)
        });
      }, 10);
    }

    /**
     * For a given string `context`, adds the passed components to make them available within that context.
     *
     * @param {String} context The name of the context to extend
     * @param {{[key: String]: {}}} components A list of component objects to add into the context
     * @param {String} newContext The new name of the context if different from context
     */
  }, {
    key: "extendContext",
    value: function extendContext(context, components, newContext) {
      newContext = newContext || context;
      this.contexts[newContext] = _objectSpread(_objectSpread({}, this.getContext(context)), components);
    }

    /**
     * Creates a Context object that has access to the specified components. If `fromContext` is passed, the new
     * context object will be created with the same components as the `fromContext` object.
     *
     * @param context
     * @param components
     * @param fromContext
     */
  }, {
    key: "createContext",
    value: function createContext(context, components, fromContext) {
      this.extendContext(fromContext, components, context);
    }
  }], [{
    key: "bindToWindow",
    value: function bindToWindow(window) {
      window.Concrete = window.Concrete || {};
      if (!window.Concrete.Vue) {
        window.Concrete.Vue = new Manager();
        window.dispatchEvent(new CustomEvent('concrete.vue.ready', {
          detail: window.Concrete.Vue
        }));
      }
    }
  }]);
  return Manager;
}();


/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/imagery/js/frontend.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var magnific_popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! magnific-popup */ "./node_modules/magnific-popup/dist/jquery.magnific-popup.js");
/* harmony import */ var magnific_popup__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(magnific_popup__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _frontend_lightbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frontend/lightbox */ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/lightbox.js");
/* harmony import */ var _frontend_lightbox__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_frontend_lightbox__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _frontend_responsive_slides__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./frontend/responsive-slides */ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/responsive-slides.js");
/* harmony import */ var _frontend_responsive_slides__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_frontend_responsive_slides__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _frontend_gallery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./frontend/gallery */ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/gallery.js");
/* harmony import */ var _frontend_gallery__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_frontend_gallery__WEBPACK_IMPORTED_MODULE_3__);




window.$ = window.jQuery = jQuery;

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/gallery.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/gallery.js ***!
  \*********************************************************************************/
/***/ (() => {

$('[data-gallery-lightbox=true]').magnificPopup({
  type: 'image',
  gallery: {
    enabled: true
  },
  image: {
    titleSrc: function titleSrc(item) {
      var $wrapper = $('<div />');
      var caption = item.el.attr('data-caption');
      $wrapper.append(caption);
      var downloadLink = item.el.attr('data-download-link');
      if (downloadLink.length) {
        var $a = $('<a></a>');
        $a.attr('href', downloadLink);
        $a.attr('target', '_blank');
        $a.attr('class', 'ms-2');
        $a.html('Download');
        $wrapper.append($a);
      }
      return $wrapper.html();
    }
  }
});

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/lightbox.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/lightbox.js ***!
  \**********************************************************************************/
/***/ (() => {

$('a[data-concrete-link-lightbox=image],a[data-concrete5-link-lightbox=image]').each(function () {
  var me = $(this);
  me.magnificPopup({
    type: 'image',
    removalDelay: 500,
    // delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function beforeOpen() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
        this.st.mainClass = 'mfp-zoom-in';
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });
});

$('a[data-concrete-link-lightbox=iframe],a[data-concrete5-link-lightbox=iframe]').each(function () {
  var me = $(this);
  var width = 500;
  var height = 400;
  if ($(this).attr('data-concrete-link-lightbox-width') && $(this).attr('data-concrete-link-lightbox-height')) {
    width = $(this).attr('data-concrete-link-lightbox-width');
    height = $(this).attr('data-concrete-link-lightbox-height');
  } else {
    // Legacy support
    if ($(this).attr('data-concrete5-link-lightbox-width') && $(this).attr('data-concrete5-link-lightbox-height')) {
      width = $(this).attr('data-concrete5-link-lightbox-width');
      height = $(this).attr('data-concrete5-link-lightbox-height');
    }
  }
  me.magnificPopup({
    type: 'iframe',
    callbacks: {
      beforeOpen: function beforeOpen() {
        this.st.iframe.markup = this.st.iframe.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
        this.st.mainClass = 'mfp-zoom-in';
        var magnificPopup = $.magnificPopup.instance;
        $(magnificPopup.contentContainer).css('maxWidth', width + 'px').css('maxHeight', height + 'px');
      }
    },
    iframe: {
      patterns: {
        website: {
          index: '',
          src: '%id%'
        }
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });
});

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/responsive-slides.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/imagery/js/frontend/responsive-slides.js ***!
  \*******************************************************************************************/
/***/ (() => {

/*! ResponsiveSlides.js v1.55
 * http://responsiveslides.com
 * http://viljamis.com
 *
 * Copyright (c) 2011-2012 @viljamis
 * Available under the MIT license
 */

/* jslint browser: true, sloppy: true, vars: true, plusplus: true, indent: 2 */

(function ($, window, i) {
  $.fn.responsiveSlides = function (options) {
    // Default settings
    var settings = $.extend({
      auto: true,
      // Boolean: Animate automatically, true or false
      speed: 500,
      // Integer: Speed of the transition, in milliseconds
      timeout: 4000,
      // Integer: Time between slide transitions, in milliseconds
      pager: false,
      // Boolean: Show pager, true or false
      nav: false,
      // Boolean: Show navigation, true or false
      random: false,
      // Boolean: Randomize the order of the slides, true or false
      pause: false,
      // Boolean: Pause on hover, true or false
      pauseControls: true,
      // Boolean: Pause when hovering controls, true or false
      prevText: 'Previous',
      // String: Text for the "previous" button
      nextText: 'Next',
      // String: Text for the "next" button
      maxwidth: '',
      // Integer: Max-width of the slideshow, in pixels
      navContainer: '',
      // Selector: Where auto generated controls should be appended to, default is after the <ul>
      manualControls: '',
      // Selector: Declare custom pager navigation
      namespace: 'rslides',
      // String: change the default namespace used
      before: $.noop,
      // Function: Before callback
      after: $.noop // Function: After callback
    }, options);
    return this.each(function () {
      // Index for namespacing
      i++;
      var $this = $(this);

      // Local variables
      var vendor;
      var selectTab;
      var startCycle;
      var restartCycle;
      var rotate;
      var $tabs;

      // Helpers
      var index = 0;
      var $slide = $this.children();
      var length = $slide.length;
      var fadeTime = parseFloat(settings.speed);
      var waitTime = parseFloat(settings.timeout);
      var maxw = parseFloat(settings.maxwidth);

      // Namespacing
      var namespace = settings.namespace;
      var namespaceIdx = namespace + i;

      // Classes
      var navClass = namespace + '_nav ' + namespaceIdx + '_nav';
      var activeClass = namespace + '_here';
      var visibleClass = namespaceIdx + '_on';
      var slideClassPrefix = namespaceIdx + '_s';

      // Pager
      var $pager = $("<ul class='" + namespace + '_tabs ' + namespaceIdx + "_tabs' />");

      // Styles for visible and hidden slides
      var visible = {
        "float": 'left',
        position: 'relative',
        opacity: 1,
        zIndex: 2
      };
      var hidden = {
        "float": 'none',
        position: 'absolute',
        opacity: 0,
        zIndex: 1
      };

      // Detect transition support
      var supportsTransitions = function () {
        var docBody = document.body || document.documentElement;
        var styles = docBody.style;
        var prop = 'transition';
        if (typeof styles[prop] === 'string') {
          return true;
        }
        // Tests for vendor specific prop
        vendor = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
        prop = prop.charAt(0).toUpperCase() + prop.substr(1);
        var i;
        for (i = 0; i < vendor.length; i++) {
          if (typeof styles[vendor[i] + prop] === 'string') {
            return true;
          }
        }
        return false;
      }();

      // Fading animation
      var slideTo = function slideTo(idx) {
        settings.before(idx);
        // If CSS3 transitions are supported
        if (supportsTransitions) {
          $slide.removeClass(visibleClass).css(hidden).eq(idx).addClass(visibleClass).css(visible);
          index = idx;
          setTimeout(function () {
            settings.after(idx);
          }, fadeTime);
          // If not, use jQuery fallback
        } else {
          $slide.stop().fadeOut(fadeTime, function () {
            $(this).removeClass(visibleClass).css(hidden).css('opacity', 1);
          }).eq(idx).fadeIn(fadeTime, function () {
            $(this).addClass(visibleClass).css(visible);
            settings.after(idx);
            index = idx;
          });
        }
      };

      // Random order
      if (settings.random) {
        $slide.sort(function () {
          return Math.round(Math.random()) - 0.5;
        });
        $this.empty().append($slide);
      }

      // Add ID's to each slide
      $slide.each(function (i) {
        this.id = slideClassPrefix + i;
      });

      // Add max-width and classes
      $this.addClass(namespace + ' ' + namespaceIdx);
      if (options && options.maxwidth) {
        $this.css('max-width', maxw);
      }

      // Hide all slides, then show first one
      $slide.hide().css(hidden).eq(0).addClass(visibleClass).css(visible).show();

      // CSS transitions
      if (supportsTransitions) {
        $slide.show().css({
          // -ms prefix isn't needed as IE10 uses prefix free version
          '-webkit-transition': 'opacity ' + fadeTime + 'ms ease-in-out',
          '-moz-transition': 'opacity ' + fadeTime + 'ms ease-in-out',
          '-o-transition': 'opacity ' + fadeTime + 'ms ease-in-out',
          transition: 'opacity ' + fadeTime + 'ms ease-in-out'
        });
      }

      // Only run if there's more than one slide
      if ($slide.length > 1) {
        // Make sure the timeout is at least 100ms longer than the fade
        if (waitTime < fadeTime + 100) {
          return;
        }

        // Pager
        if (settings.pager && !settings.manualControls) {
          var tabMarkup = [];
          $slide.each(function (i) {
            var n = i + 1;
            tabMarkup += '<li>' + "<a href='#' class='" + slideClassPrefix + n + "'>" + n + '</a>' + '</li>';
          });
          $pager.append(tabMarkup);

          // Inject pager
          if (options.navContainer) {
            $(settings.navContainer).append($pager);
          } else {
            $this.after($pager);
          }
        }

        // Manual pager controls
        if (settings.manualControls) {
          $pager = $(settings.manualControls);
          $pager.addClass(namespace + '_tabs ' + namespaceIdx + '_tabs');
        }

        // Add pager slide class prefixes
        if (settings.pager || settings.manualControls) {
          $pager.find('li').each(function (i) {
            $(this).addClass(slideClassPrefix + (i + 1));
          });
        }

        // If we have a pager, we need to set up the selectTab function
        if (settings.pager || settings.manualControls) {
          $tabs = $pager.find('a');

          // Select pager item
          selectTab = function selectTab(idx) {
            $tabs.closest('li').removeClass(activeClass).eq(idx).addClass(activeClass);
          };
        }

        // Auto cycle
        if (settings.auto) {
          startCycle = function startCycle() {
            rotate = setInterval(function () {
              // Clear the event queue
              $slide.stop(true, true);
              var idx = index + 1 < length ? index + 1 : 0;

              // Remove active state and set new if pager is set
              if (settings.pager || settings.manualControls) {
                selectTab(idx);
              }
              slideTo(idx);
            }, waitTime);
          };

          // Init cycle
          startCycle();
        }

        // Restarting cycle
        restartCycle = function restartCycle() {
          if (settings.auto) {
            // Stop
            clearInterval(rotate);
            // Restart
            startCycle();
          }
        };

        // Pause on hover
        if (settings.pause) {
          $this.hover(function () {
            clearInterval(rotate);
          }, function () {
            restartCycle();
          });
        }

        // Pager click event handler
        if (settings.pager || settings.manualControls) {
          $tabs.bind('click', function (e) {
            e.preventDefault();
            if (!settings.pauseControls) {
              restartCycle();
            }

            // Get index of clicked tab
            var idx = $tabs.index(this);

            // Break if element is already active or currently animated
            if (index === idx || $('.' + visibleClass).queue('fx').length) {
              return;
            }

            // Remove active state from old tab and set new one
            selectTab(idx);

            // Do the animation
            slideTo(idx);
          }).eq(0).closest('li').addClass(activeClass);

          // Pause when hovering pager
          if (settings.pauseControls) {
            $tabs.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

        // Navigation
        if (settings.nav) {
          var navMarkup = "<a href='#' class='" + navClass + " prev'>" + settings.prevText + '</a>' + "<a href='#' class='" + navClass + " next'>" + settings.nextText + '</a>';

          // Inject navigation
          if (options.navContainer) {
            $(settings.navContainer).append(navMarkup);
          } else {
            $this.after(navMarkup);
          }
          var $trigger = $('.' + namespaceIdx + '_nav');
          var $prev = $trigger.filter('.prev');

          // Click event handler
          $trigger.bind('click', function (e) {
            e.preventDefault();
            var $visibleClass = $('.' + visibleClass);

            // Prevent clicking if currently animated
            if ($visibleClass.queue('fx').length) {
              return;
            }

            //  Adds active class during slide animation
            //  $(this)
            //    .addClass(namespace + "_active")
            //    .delay(fadeTime)
            //    .queue(function (next) {
            //      $(this).removeClass(namespace + "_active");
            //      next();
            //  });

            // Determine where to slide
            var idx = $slide.index($visibleClass);
            var prevIdx = idx - 1;
            var nextIdx = idx + 1 < length ? index + 1 : 0;

            // Go to slide
            slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            if (settings.pager || settings.manualControls) {
              selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            }
            if (!settings.pauseControls) {
              restartCycle();
            }
          });

          // Pause when hovering navigation
          if (settings.pauseControls) {
            $trigger.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }
      }

      // Max-width fallback
      if (typeof document.body.style.maxWidth === 'undefined' && options.maxwidth) {
        var widthSupport = function widthSupport() {
          $this.css('width', '100%');
          if ($this.width() > maxw) {
            $this.css('width', maxw);
          }
        };

        // Init fallback
        widthSupport();
        $(window).bind('resize', function () {
          widthSupport();
        });
      }
    });
  };
})(jQuery, window, 0);

/***/ }),

/***/ "./node_modules/@pnotify/bootstrap4/dist/PNotifyBootstrap4.js":
/*!********************************************************************!*\
  !*** ./node_modules/@pnotify/bootstrap4/dist/PNotifyBootstrap4.js ***!
  \********************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
!function (t, n) {
  "object" == ( false ? 0 : _typeof(exports)) && "undefined" != "object" ? n(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (n),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : 0;
}(this, function (t) {
  "use strict";

  function n(t) {
    return (n = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return _typeof(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
    })(t);
  }
  function e(t, n) {
    if (!(t instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function r(t, n) {
    for (var e = 0; e < n.length; e++) {
      var r = n[e];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
    }
  }
  function o(t) {
    return (o = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    })(t);
  }
  function i(t, n) {
    return (i = Object.setPrototypeOf || function (t, n) {
      return t.__proto__ = n, t;
    })(t, n);
  }
  function u(t) {
    if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return t;
  }
  function f(t, n) {
    return !n || "object" != _typeof(n) && "function" != typeof n ? u(t) : n;
  }
  function a(t) {
    var n = function () {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
      } catch (t) {
        return !1;
      }
    }();
    return function () {
      var e,
        r = o(t);
      if (n) {
        var i = o(this).constructor;
        e = Reflect.construct(r, arguments, i);
      } else e = r.apply(this, arguments);
      return f(this, e);
    };
  }
  function c(t) {
    return function (t) {
      if (Array.isArray(t)) return l(t);
    }(t) || function (t) {
      if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
    }(t) || function (t, n) {
      if (!t) return;
      if ("string" == typeof t) return l(t, n);
      var e = Object.prototype.toString.call(t).slice(8, -1);
      "Object" === e && t.constructor && (e = t.constructor.name);
      if ("Map" === e || "Set" === e) return Array.from(t);
      if ("Arguments" === e || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)) return l(t, n);
    }(t) || function () {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function l(t, n) {
    (null == n || n > t.length) && (n = t.length);
    for (var e = 0, r = new Array(n); e < n; e++) r[e] = t[e];
    return r;
  }
  function s() {}
  function p(t) {
    return t();
  }
  function y() {
    return Object.create(null);
  }
  function d(t) {
    t.forEach(p);
  }
  function b(t) {
    return "function" == typeof t;
  }
  function h(t, e) {
    return t != t ? e == e : t !== e || t && "object" === n(t) || "function" == typeof t;
  }
  function m(t) {
    t.parentNode.removeChild(t);
  }
  function g(t) {
    return Array.from(t.childNodes);
  }
  var v;
  function $(t) {
    v = t;
  }
  var _ = [],
    x = [],
    O = [],
    j = [],
    w = Promise.resolve(),
    S = !1;
  function k(t) {
    O.push(t);
  }
  var P = !1,
    A = new Set();
  function E() {
    if (!P) {
      P = !0;
      do {
        for (var t = 0; t < _.length; t += 1) {
          var n = _[t];
          $(n), R(n.$$);
        }
        for ($(null), _.length = 0; x.length;) x.pop()();
        for (var e = 0; e < O.length; e += 1) {
          var r = O[e];
          A.has(r) || (A.add(r), r());
        }
        O.length = 0;
      } while (_.length);
      for (; j.length;) j.pop()();
      S = !1, P = !1, A.clear();
    }
  }
  function R(t) {
    if (null !== t.fragment) {
      t.update(), d(t.before_update);
      var n = t.dirty;
      t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, n), t.after_update.forEach(k);
    }
  }
  var T = new Set();
  function C(t, n) {
    t && t.i && (T["delete"](t), t.i(n));
  }
  function I(t, n, e) {
    var r = t.$$,
      o = r.fragment,
      i = r.on_mount,
      u = r.on_destroy,
      f = r.after_update;
    o && o.m(n, e), k(function () {
      var n = i.map(p).filter(b);
      u ? u.push.apply(u, c(n)) : d(n), t.$$.on_mount = [];
    }), f.forEach(k);
  }
  function M(t, n) {
    -1 === t.$$.dirty[0] && (_.push(t), S || (S = !0, w.then(E)), t.$$.dirty.fill(0)), t.$$.dirty[n / 31 | 0] |= 1 << n % 31;
  }
  var N = function (t) {
    !function (t, n) {
      if ("function" != typeof n && null !== n) throw new TypeError("Super expression must either be null or a function");
      t.prototype = Object.create(n && n.prototype, {
        constructor: {
          value: t,
          writable: !0,
          configurable: !0
        }
      }), n && i(t, n);
    }(r, t);
    var n = a(r);
    function r(t) {
      var o;
      return e(this, r), function (t, n, e, r, o, i) {
        var u = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : [-1],
          f = v;
        $(t);
        var a = n.props || {},
          c = t.$$ = {
            fragment: null,
            ctx: null,
            props: i,
            update: s,
            not_equal: o,
            bound: y(),
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(f ? f.$$.context : []),
            callbacks: y(),
            dirty: u,
            skip_bound: !1
          },
          l = !1;
        if (c.ctx = e ? e(t, a, function (n, e) {
          var r = !(arguments.length <= 2) && arguments.length - 2 ? arguments.length <= 2 ? void 0 : arguments[2] : e;
          return c.ctx && o(c.ctx[n], c.ctx[n] = r) && (!c.skip_bound && c.bound[n] && c.bound[n](r), l && M(t, n)), e;
        }) : [], c.update(), l = !0, d(c.before_update), c.fragment = !!r && r(c.ctx), n.target) {
          if (n.hydrate) {
            var p = g(n.target);
            c.fragment && c.fragment.l(p), p.forEach(m);
          } else c.fragment && c.fragment.c();
          n.intro && C(t.$$.fragment), I(t, n.target, n.anchor), E();
        }
        $(f);
      }(u(o = n.call(this)), t, null, null, h, {}), o;
    }
    return r;
  }(function () {
    function t() {
      e(this, t);
    }
    var n, o, i;
    return n = t, (o = [{
      key: "$destroy",
      value: function value() {
        var t, n;
        t = 1, null !== (n = this.$$).fragment && (d(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []), this.$destroy = s;
      }
    }, {
      key: "$on",
      value: function value(t, n) {
        var e = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
        return e.push(n), function () {
          var t = e.indexOf(n);
          -1 !== t && e.splice(t, 1);
        };
      }
    }, {
      key: "$set",
      value: function value(t) {
        var n;
        this.$$set && (n = t, 0 !== Object.keys(n).length) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
      }
    }]) && r(n.prototype, o), i && r(n, i), t;
  }());
  t["default"] = N, t.defaults = {}, t.init = function (t) {
    t.defaults.styling = {
      prefix: "bootstrap4",
      container: "alert",
      notice: "alert-warning",
      info: "alert-info",
      success: "alert-success",
      error: "alert-danger",
      "action-bar": "bootstrap4-ml",
      "prompt-bar": "bootstrap4-ml",
      btn: "btn mx-1",
      "btn-primary": "btn-primary",
      "btn-secondary": "btn-secondary",
      input: "form-control"
    };
  }, t.position = "PrependContainer", Object.defineProperty(t, "__esModule", {
    value: !0
  });
});

/***/ }),

/***/ "./node_modules/@pnotify/core/dist/PNotify.js":
/*!****************************************************!*\
  !*** ./node_modules/@pnotify/core/dist/PNotify.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
!function (t, e) {
  "object" == ( false ? 0 : _typeof(exports)) && "undefined" != "object" ? e(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : 0;
}(this, function (t) {
  "use strict";

  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return _typeof(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
    })(t);
  }
  function n(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
  }
  function i(t, e) {
    for (var n = 0; n < e.length; n++) {
      var i = e[n];
      i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
    }
  }
  function o(t, e, n) {
    return e && i(t.prototype, e), n && i(t, n), t;
  }
  function r(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : t[e] = n, t;
  }
  function s(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(t);
      e && (i = i.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })), n.push.apply(n, i);
    }
    return n;
  }
  function a(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = null != arguments[e] ? arguments[e] : {};
      e % 2 ? s(Object(n), !0).forEach(function (e) {
        r(t, e, n[e]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : s(Object(n)).forEach(function (e) {
        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
      });
    }
    return t;
  }
  function c(t) {
    return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    })(t);
  }
  function l(t, e) {
    return (l = Object.setPrototypeOf || function (t, e) {
      return t.__proto__ = e, t;
    })(t, e);
  }
  function u() {
    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" == typeof Proxy) return !0;
    try {
      return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
    } catch (t) {
      return !1;
    }
  }
  function f(t, e, n) {
    return (f = u() ? Reflect.construct : function (t, e, n) {
      var i = [null];
      i.push.apply(i, e);
      var o = new (Function.bind.apply(t, i))();
      return n && l(o, n.prototype), o;
    }).apply(null, arguments);
  }
  function d(t) {
    if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return t;
  }
  function h(t, e) {
    return !e || "object" != _typeof(e) && "function" != typeof e ? d(t) : e;
  }
  function p(t, e) {
    return function (t) {
      if (Array.isArray(t)) return t;
    }(t) || function (t, e) {
      if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t))) return;
      var n = [],
        i = !0,
        o = !1,
        r = void 0;
      try {
        for (var s, a = t[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !e || n.length !== e); i = !0);
      } catch (t) {
        o = !0, r = t;
      } finally {
        try {
          i || null == a["return"] || a["return"]();
        } finally {
          if (o) throw r;
        }
      }
      return n;
    }(t, e) || v(t, e) || function () {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function m(t) {
    return function (t) {
      if (Array.isArray(t)) return y(t);
    }(t) || function (t) {
      if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
    }(t) || v(t) || function () {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function v(t, e) {
    if (t) {
      if ("string" == typeof t) return y(t, e);
      var n = Object.prototype.toString.call(t).slice(8, -1);
      return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? y(t, e) : void 0;
    }
  }
  function y(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
    return i;
  }
  function g() {}
  function $(t, e) {
    for (var n in e) t[n] = e[n];
    return t;
  }
  function _(t) {
    return t();
  }
  function k() {
    return Object.create(null);
  }
  function x(t) {
    t.forEach(_);
  }
  function b(t) {
    return "function" == typeof t;
  }
  function w(t, n) {
    return t != t ? n == n : t !== n || t && "object" === e(t) || "function" == typeof t;
  }
  function O(t, e) {
    t.appendChild(e);
  }
  function C(t, e, n) {
    t.insertBefore(e, n || null);
  }
  function M(t) {
    t.parentNode.removeChild(t);
  }
  function T(t) {
    return document.createElement(t);
  }
  function H(t) {
    return document.createTextNode(t);
  }
  function E() {
    return H(" ");
  }
  function S() {
    return H("");
  }
  function N(t, e, n, i) {
    return t.addEventListener(e, n, i), function () {
      return t.removeEventListener(e, n, i);
    };
  }
  function P(t, e, n) {
    null == n ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
  }
  function A(t) {
    return Array.from(t.childNodes);
  }
  function L(t, e) {
    e = "" + e, t.wholeText !== e && (t.data = e);
  }
  var j,
    R = function () {
      function t() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        n(this, t), this.a = e, this.e = this.n = null;
      }
      return o(t, [{
        key: "m",
        value: function value(t, e) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
          this.e || (this.e = T(e.nodeName), this.t = e, this.h(t)), this.i(n);
        }
      }, {
        key: "h",
        value: function value(t) {
          this.e.innerHTML = t, this.n = Array.from(this.e.childNodes);
        }
      }, {
        key: "i",
        value: function value(t) {
          for (var e = 0; e < this.n.length; e += 1) C(this.t, this.n[e], t);
        }
      }, {
        key: "p",
        value: function value(t) {
          this.d(), this.h(t), this.i(this.a);
        }
      }, {
        key: "d",
        value: function value() {
          this.n.forEach(M);
        }
      }]), t;
    }();
  function W(t) {
    j = t;
  }
  function I() {
    if (!j) throw new Error("Function called outside component initialization");
    return j;
  }
  function D() {
    var t = I();
    return function (e, n) {
      var i = t.$$.callbacks[e];
      if (i) {
        var o = function (t, e) {
          var n = document.createEvent("CustomEvent");
          return n.initCustomEvent(t, !1, !1, e), n;
        }(e, n);
        i.slice().forEach(function (e) {
          e.call(t, o);
        });
      }
    };
  }
  function F(t, e) {
    var n = t.$$.callbacks[e.type];
    n && n.slice().forEach(function (t) {
      return t(e);
    });
  }
  var q = [],
    B = [],
    z = [],
    U = [],
    G = Promise.resolve(),
    J = !1;
  function K() {
    J || (J = !0, G.then(Z));
  }
  function Q() {
    return K(), G;
  }
  function V(t) {
    z.push(t);
  }
  var X = !1,
    Y = new Set();
  function Z() {
    if (!X) {
      X = !0;
      do {
        for (var t = 0; t < q.length; t += 1) {
          var e = q[t];
          W(e), tt(e.$$);
        }
        for (W(null), q.length = 0; B.length;) B.pop()();
        for (var n = 0; n < z.length; n += 1) {
          var i = z[n];
          Y.has(i) || (Y.add(i), i());
        }
        z.length = 0;
      } while (q.length);
      for (; U.length;) U.pop()();
      J = !1, X = !1, Y.clear();
    }
  }
  function tt(t) {
    if (null !== t.fragment) {
      t.update(), x(t.before_update);
      var e = t.dirty;
      t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(V);
    }
  }
  var et,
    nt = new Set();
  function it() {
    et = {
      r: 0,
      c: [],
      p: et
    };
  }
  function ot() {
    et.r || x(et.c), et = et.p;
  }
  function rt(t, e) {
    t && t.i && (nt["delete"](t), t.i(e));
  }
  function st(t, e, n, i) {
    if (t && t.o) {
      if (nt.has(t)) return;
      nt.add(t), et.c.push(function () {
        nt["delete"](t), i && (n && t.d(1), i());
      }), t.o(e);
    }
  }
  var at = "undefined" != typeof window ? window : "undefined" != typeof globalThis ? globalThis : __webpack_require__.g;
  function ct(t, e) {
    st(t, 1, 1, function () {
      e["delete"](t.key);
    });
  }
  function lt(t, e, n, i, o, r, s, a, c, l, u, f) {
    for (var d = t.length, h = r.length, p = d, m = {}; p--;) m[t[p].key] = p;
    var v = [],
      y = new Map(),
      g = new Map();
    for (p = h; p--;) {
      var $ = f(o, r, p),
        _ = n($),
        k = s.get(_);
      k ? i && k.p($, e) : (k = l(_, $)).c(), y.set(_, v[p] = k), _ in m && g.set(_, Math.abs(p - m[_]));
    }
    var x = new Set(),
      b = new Set();
    function w(t) {
      rt(t, 1), t.m(a, u), s.set(t.key, t), u = t.first, h--;
    }
    for (; d && h;) {
      var O = v[h - 1],
        C = t[d - 1],
        M = O.key,
        T = C.key;
      O === C ? (u = O.first, d--, h--) : y.has(T) ? !s.has(M) || x.has(M) ? w(O) : b.has(T) ? d-- : g.get(M) > g.get(T) ? (b.add(M), w(O)) : (x.add(T), d--) : (c(C, s), d--);
    }
    for (; d--;) {
      var H = t[d];
      y.has(H.key) || c(H, s);
    }
    for (; h;) w(v[h - 1]);
    return v;
  }
  function ut(t, e) {
    for (var n = {}, i = {}, o = {
        $$scope: 1
      }, r = t.length; r--;) {
      var s = t[r],
        a = e[r];
      if (a) {
        for (var c in s) c in a || (i[c] = 1);
        for (var l in a) o[l] || (n[l] = a[l], o[l] = 1);
        t[r] = a;
      } else for (var u in s) o[u] = 1;
    }
    for (var f in i) f in n || (n[f] = void 0);
    return n;
  }
  function ft(t) {
    return "object" === e(t) && null !== t ? t : {};
  }
  function dt(t) {
    t && t.c();
  }
  function ht(t, e, n) {
    var i = t.$$,
      o = i.fragment,
      r = i.on_mount,
      s = i.on_destroy,
      a = i.after_update;
    o && o.m(e, n), V(function () {
      var e = r.map(_).filter(b);
      s ? s.push.apply(s, m(e)) : x(e), t.$$.on_mount = [];
    }), a.forEach(V);
  }
  function pt(t, e) {
    var n = t.$$;
    null !== n.fragment && (x(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
  }
  function mt(t, e) {
    -1 === t.$$.dirty[0] && (q.push(t), K(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
  }
  var vt = function () {
      function t() {
        n(this, t);
      }
      return o(t, [{
        key: "$destroy",
        value: function value() {
          pt(this, 1), this.$destroy = g;
        }
      }, {
        key: "$on",
        value: function value(t, e) {
          var n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
          return n.push(e), function () {
            var t = n.indexOf(e);
            -1 !== t && n.splice(t, 1);
          };
        }
      }, {
        key: "$set",
        value: function value(t) {
          var e;
          this.$$set && (e = t, 0 !== Object.keys(e).length) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
        }
      }]), t;
    }(),
    yt = function () {
      function t(e) {
        if (n(this, t), Object.assign(this, {
          dir1: null,
          dir2: null,
          firstpos1: null,
          firstpos2: null,
          spacing1: 25,
          spacing2: 25,
          push: "bottom",
          maxOpen: 1,
          maxStrategy: "wait",
          maxClosureCausesWait: !0,
          modal: "ish",
          modalishFlash: !0,
          overlayClose: !0,
          overlayClosesPinned: !1,
          positioned: !0,
          context: window && document.body || null
        }, e), "ish" === this.modal && 1 !== this.maxOpen) throw new Error("A modalish stack must have a maxOpen value of 1.");
        if ("ish" === this.modal && !this.dir1) throw new Error("A modalish stack must have a direction.");
        if ("top" === this.push && "ish" === this.modal && "close" !== this.maxStrategy) throw new Error("A modalish stack that pushes to the top must use the close maxStrategy.");
        this._noticeHead = {
          notice: null,
          prev: null,
          next: null
        }, this._noticeTail = {
          notice: null,
          prev: this._noticeHead,
          next: null
        }, this._noticeHead.next = this._noticeTail, this._noticeMap = new WeakMap(), this._length = 0, this._addpos2 = 0, this._animation = !0, this._posTimer = null, this._openNotices = 0, this._listener = null, this._overlayOpen = !1, this._overlayInserted = !1, this._collapsingModalState = !1, this._leader = null, this._leaderOff = null, this._masking = null, this._maskingOff = null, this._swapping = !1, this._callbacks = {};
      }
      return o(t, [{
        key: "forEach",
        value: function value(t) {
          var e,
            n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            i = n.start,
            o = void 0 === i ? "oldest" : i,
            r = n.dir,
            s = void 0 === r ? "newer" : r,
            a = n.skipModuleHandled,
            c = void 0 !== a && a;
          if ("head" === o || "newest" === o && "top" === this.push || "oldest" === o && "bottom" === this.push) e = this._noticeHead.next;else if ("tail" === o || "newest" === o && "bottom" === this.push || "oldest" === o && "top" === this.push) e = this._noticeTail.prev;else {
            if (!this._noticeMap.has(o)) throw new Error("Invalid start param.");
            e = this._noticeMap.get(o);
          }
          for (; e.notice;) {
            var l = e.notice;
            if ("prev" === s || "top" === this.push && "newer" === s || "bottom" === this.push && "older" === s) e = e.prev;else {
              if (!("next" === s || "top" === this.push && "older" === s || "bottom" === this.push && "newer" === s)) throw new Error("Invalid dir param.");
              e = e.next;
            }
            if (!(c && l.getModuleHandled() || !1 !== t(l))) break;
          }
        }
      }, {
        key: "close",
        value: function value(t) {
          this.forEach(function (e) {
            return e.close(t, !1, !1);
          });
        }
      }, {
        key: "open",
        value: function value(t) {
          this.forEach(function (e) {
            return e.open(t);
          });
        }
      }, {
        key: "openLast",
        value: function value() {
          this.forEach(function (t) {
            if (-1 === ["opening", "open", "waiting"].indexOf(t.getState())) return t.open(), !1;
          }, {
            start: "newest",
            dir: "older"
          });
        }
      }, {
        key: "swap",
        value: function value(t, e) {
          var n = this,
            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            o = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
          return -1 === ["open", "opening", "closing"].indexOf(t.getState()) ? Promise.reject() : (this._swapping = e, t.close(i, !1, o).then(function () {
            return e.open(i);
          })["finally"](function () {
            n._swapping = !1;
          }));
        }
      }, {
        key: "on",
        value: function value(t, e) {
          var n = this;
          return t in this._callbacks || (this._callbacks[t] = []), this._callbacks[t].push(e), function () {
            n._callbacks[t].splice(n._callbacks[t].indexOf(e), 1);
          };
        }
      }, {
        key: "fire",
        value: function value(t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          e.stack = this, t in this._callbacks && this._callbacks[t].forEach(function (t) {
            return t(e);
          });
        }
      }, {
        key: "position",
        value: function value() {
          var t = this;
          this.positioned && this._length > 0 ? (this.fire("beforePosition"), this._resetPositionData(), this.forEach(function (e) {
            t._positionNotice(e);
          }, {
            start: "head",
            dir: "next",
            skipModuleHandled: !0
          }), this.fire("afterPosition")) : (delete this._nextpos1, delete this._nextpos2);
        }
      }, {
        key: "queuePosition",
        value: function value() {
          var t = this,
            e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10;
          this._posTimer && clearTimeout(this._posTimer), this._posTimer = setTimeout(function () {
            return t.position();
          }, e);
        }
      }, {
        key: "_resetPositionData",
        value: function value() {
          this._nextpos1 = this.firstpos1, this._nextpos2 = this.firstpos2, this._addpos2 = 0;
        }
      }, {
        key: "_positionNotice",
        value: function value(t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t === this._masking;
          if (this.positioned) {
            var n = t.refs.elem;
            if (n && (n.classList.contains("pnotify-in") || n.classList.contains("pnotify-initial") || e)) {
              var i = [this.firstpos1, this.firstpos2, this._nextpos1, this._nextpos2, this._addpos2],
                o = i[0],
                r = i[1],
                s = i[2],
                a = i[3],
                c = i[4];
              n.getBoundingClientRect(), !this._animation || e || this._collapsingModalState ? t._setMoveClass("") : t._setMoveClass("pnotify-move");
              var l,
                u = this.context === document.body ? window.innerHeight : this.context.scrollHeight,
                f = this.context === document.body ? window.innerWidth : this.context.scrollWidth;
              if (this.dir1) {
                var d;
                switch (l = {
                  down: "top",
                  up: "bottom",
                  left: "right",
                  right: "left"
                }[this.dir1], this.dir1) {
                  case "down":
                    d = n.offsetTop;
                    break;
                  case "up":
                    d = u - n.scrollHeight - n.offsetTop;
                    break;
                  case "left":
                    d = f - n.scrollWidth - n.offsetLeft;
                    break;
                  case "right":
                    d = n.offsetLeft;
                }
                null == o && (s = o = d);
              }
              if (this.dir1 && this.dir2) {
                var h,
                  p = {
                    down: "top",
                    up: "bottom",
                    left: "right",
                    right: "left"
                  }[this.dir2];
                switch (this.dir2) {
                  case "down":
                    h = n.offsetTop;
                    break;
                  case "up":
                    h = u - n.scrollHeight - n.offsetTop;
                    break;
                  case "left":
                    h = f - n.scrollWidth - n.offsetLeft;
                    break;
                  case "right":
                    h = n.offsetLeft;
                }
                if (null == r && (a = r = h), !e) {
                  var m = s + n.offsetHeight + this.spacing1,
                    v = s + n.offsetWidth + this.spacing1;
                  (("down" === this.dir1 || "up" === this.dir1) && m > u || ("left" === this.dir1 || "right" === this.dir1) && v > f) && (s = o, a += c + this.spacing2, c = 0);
                }
                switch (null != a && (n.style[p] = "".concat(a, "px"), this._animation || n.style[p]), this.dir2) {
                  case "down":
                  case "up":
                    n.offsetHeight + (parseFloat(n.style.marginTop, 10) || 0) + (parseFloat(n.style.marginBottom, 10) || 0) > c && (c = n.offsetHeight);
                    break;
                  case "left":
                  case "right":
                    n.offsetWidth + (parseFloat(n.style.marginLeft, 10) || 0) + (parseFloat(n.style.marginRight, 10) || 0) > c && (c = n.offsetWidth);
                }
              } else if (this.dir1) {
                var y, g;
                switch (this.dir1) {
                  case "down":
                  case "up":
                    g = ["left", "right"], y = this.context.scrollWidth / 2 - n.offsetWidth / 2;
                    break;
                  case "left":
                  case "right":
                    g = ["top", "bottom"], y = u / 2 - n.offsetHeight / 2;
                }
                n.style[g[0]] = "".concat(y, "px"), n.style[g[1]] = "auto", this._animation || n.style[g[0]];
              }
              if (this.dir1) switch (null != s && (n.style[l] = "".concat(s, "px"), this._animation || n.style[l]), this.dir1) {
                case "down":
                case "up":
                  s += n.offsetHeight + this.spacing1;
                  break;
                case "left":
                case "right":
                  s += n.offsetWidth + this.spacing1;
              } else {
                var $ = f / 2 - n.offsetWidth / 2,
                  _ = u / 2 - n.offsetHeight / 2;
                n.style.left = "".concat($, "px"), n.style.top = "".concat(_, "px"), this._animation || n.style.left;
              }
              e || (this.firstpos1 = o, this.firstpos2 = r, this._nextpos1 = s, this._nextpos2 = a, this._addpos2 = c);
            }
          }
        }
      }, {
        key: "_addNotice",
        value: function value(t) {
          var e = this;
          this.fire("beforeAddNotice", {
            notice: t
          });
          var n = function n() {
              if (e.fire("beforeOpenNotice", {
                notice: t
              }), t.getModuleHandled()) e.fire("afterOpenNotice", {
                notice: t
              });else {
                if (e._openNotices++, ("ish" !== e.modal || !e._overlayOpen) && e.maxOpen !== 1 / 0 && e._openNotices > e.maxOpen && "close" === e.maxStrategy) {
                  var n = e._openNotices - e.maxOpen;
                  e.forEach(function (t) {
                    if (-1 !== ["opening", "open"].indexOf(t.getState())) return t.close(!1, !1, e.maxClosureCausesWait), t === e._leader && e._setLeader(null), !! --n;
                  });
                }
                !0 === e.modal && e._insertOverlay(), "ish" !== e.modal || e._leader && -1 !== ["opening", "open", "closing"].indexOf(e._leader.getState()) || e._setLeader(t), "ish" === e.modal && e._overlayOpen && t._preventTimerClose(!0), e.fire("afterOpenNotice", {
                  notice: t
                });
              }
            },
            i = {
              notice: t,
              prev: null,
              next: null,
              beforeOpenOff: t.on("pnotify:beforeOpen", n),
              afterCloseOff: t.on("pnotify:afterClose", function () {
                if (e.fire("beforeCloseNotice", {
                  notice: t
                }), t.getModuleHandled()) e.fire("afterCloseNotice", {
                  notice: t
                });else {
                  if (e._openNotices--, "ish" === e.modal && t === e._leader && (e._setLeader(null), e._masking && e._setMasking(null)), !e._swapping && e.maxOpen !== 1 / 0 && e._openNotices < e.maxOpen) {
                    var n = !1,
                      i = function i(_i) {
                        if (_i !== t && "waiting" === _i.getState() && (_i.open()["catch"](function () {}), e._openNotices >= e.maxOpen)) return n = !0, !1;
                      };
                    "wait" === e.maxStrategy ? (e.forEach(i, {
                      start: t,
                      dir: "next"
                    }), n || e.forEach(i, {
                      start: t,
                      dir: "prev"
                    })) : "close" === e.maxStrategy && e.maxClosureCausesWait && (e.forEach(i, {
                      start: t,
                      dir: "older"
                    }), n || e.forEach(i, {
                      start: t,
                      dir: "newer"
                    }));
                  }
                  e._openNotices <= 0 ? (e._openNotices = 0, e._resetPositionData(), e._overlayOpen && !e._swapping && e._removeOverlay()) : e._collapsingModalState || e.queuePosition(0), e.fire("afterCloseNotice", {
                    notice: t
                  });
                }
              })
            };
          if ("top" === this.push ? (i.next = this._noticeHead.next, i.prev = this._noticeHead, i.next.prev = i, i.prev.next = i) : (i.prev = this._noticeTail.prev, i.next = this._noticeTail, i.prev.next = i, i.next.prev = i), this._noticeMap.set(t, i), this._length++, this._listener || (this._listener = function () {
            return e.position();
          }, this.context.addEventListener("pnotify:position", this._listener)), -1 !== ["open", "opening", "closing"].indexOf(t.getState())) n();else if ("ish" === this.modal && this.modalishFlash && this._shouldNoticeWait(t)) var o = t.on("pnotify:mount", function () {
            o(), t._setMasking(!0, !1, function () {
              t._setMasking(!1);
            }), e._resetPositionData(), e._positionNotice(e._leader), window.requestAnimationFrame(function () {
              e._positionNotice(t, !0);
            });
          });
          this.fire("afterAddNotice", {
            notice: t
          });
        }
      }, {
        key: "_removeNotice",
        value: function value(t) {
          if (this._noticeMap.has(t)) {
            this.fire("beforeRemoveNotice", {
              notice: t
            });
            var e = this._noticeMap.get(t);
            this._leader === t && this._setLeader(null), this._masking === t && this._setMasking(null), e.prev.next = e.next, e.next.prev = e.prev, e.prev = null, e.next = null, e.beforeOpenOff(), e.beforeOpenOff = null, e.afterCloseOff(), e.afterCloseOff = null, this._noticeMap["delete"](t), this._length--, !this._length && this._listener && (this.context.removeEventListener("pnotify:position", this._listener), this._listener = null), !this._length && this._overlayOpen && this._removeOverlay(), -1 !== ["open", "opening", "closing"].indexOf(t.getState()) && this._handleNoticeClosed(t), this.fire("afterRemoveNotice", {
              notice: t
            });
          }
        }
      }, {
        key: "_setLeader",
        value: function value(t) {
          var e = this;
          if (this.fire("beforeSetLeader", {
            leader: t
          }), this._leaderOff && (this._leaderOff(), this._leaderOff = null), this._leader = t, this._leader) {
            var n,
              i = function i() {
                var t = null;
                e._overlayOpen && (e._collapsingModalState = !0, e.forEach(function (n) {
                  n._preventTimerClose(!1), n !== e._leader && -1 !== ["opening", "open"].indexOf(n.getState()) && (t || (t = n), n.close(n === t, !1, !0));
                }, {
                  start: e._leader,
                  dir: "next",
                  skipModuleHandled: !0
                }), e._removeOverlay()), o && (clearTimeout(o), o = null), e.forEach(function (n) {
                  if (n !== e._leader) return "waiting" === n.getState() || n === t ? (e._setMasking(n, !!t), !1) : void 0;
                }, {
                  start: e._leader,
                  dir: "next",
                  skipModuleHandled: !0
                });
              },
              o = null,
              r = function r() {
                o && (clearTimeout(o), o = null), o = setTimeout(function () {
                  o = null, e._setMasking(null);
                }, 750);
              };
            this._leaderOff = (n = [this._leader.on("mouseenter", i), this._leader.on("focusin", i), this._leader.on("mouseleave", r), this._leader.on("focusout", r)], function () {
              return n.map(function (t) {
                return t();
              });
            }), this.fire("afterSetLeader", {
              leader: t
            });
          } else this.fire("afterSetLeader", {
            leader: t
          });
        }
      }, {
        key: "_setMasking",
        value: function value(t, e) {
          var n = this;
          if (this._masking) {
            if (this._masking === t) return;
            this._masking._setMasking(!1, e);
          }
          if (this._maskingOff && (this._maskingOff(), this._maskingOff = null), this._masking = t, this._masking) {
            this._resetPositionData(), this._leader && this._positionNotice(this._leader), this._masking._setMasking(!0, e), window.requestAnimationFrame(function () {
              n._masking && n._positionNotice(n._masking);
            });
            var i,
              o = function o() {
                "ish" === n.modal && (n._insertOverlay(), n._setMasking(null, !0), n.forEach(function (t) {
                  t._preventTimerClose(!0), "waiting" === t.getState() && t.open();
                }, {
                  start: n._leader,
                  dir: "next",
                  skipModuleHandled: !0
                }));
              };
            this._maskingOff = (i = [this._masking.on("mouseenter", o), this._masking.on("focusin", o)], function () {
              return i.map(function (t) {
                return t();
              });
            });
          }
        }
      }, {
        key: "_shouldNoticeWait",
        value: function value(t) {
          return this._swapping !== t && !("ish" === this.modal && this._overlayOpen) && this.maxOpen !== 1 / 0 && this._openNotices >= this.maxOpen && "wait" === this.maxStrategy;
        }
      }, {
        key: "_insertOverlay",
        value: function value() {
          var t = this;
          this._overlay || (this._overlay = document.createElement("div"), this._overlay.classList.add("pnotify-modal-overlay"), this.dir1 && this._overlay.classList.add("pnotify-modal-overlay-".concat(this.dir1)), this.overlayClose && this._overlay.classList.add("pnotify-modal-overlay-closes"), this.context !== document.body && (this._overlay.style.height = "".concat(this.context.scrollHeight, "px"), this._overlay.style.width = "".concat(this.context.scrollWidth, "px")), this._overlay.addEventListener("click", function (e) {
            if (t.overlayClose) {
              if (t.fire("overlayClose", {
                clickEvent: e
              }), e.defaultPrevented) return;
              t._leader && t._setLeader(null), t.forEach(function (e) {
                -1 === ["closed", "closing", "waiting"].indexOf(e.getState()) && (e.hide || t.overlayClosesPinned ? e.close() : e.hide || "ish" !== t.modal || (t._leader ? e.close(!1, !1, !0) : t._setLeader(e)));
              }, {
                skipModuleHandled: !0
              }), t._overlayOpen && t._removeOverlay();
            }
          })), this._overlay.parentNode !== this.context && (this.fire("beforeAddOverlay"), this._overlay.classList.remove("pnotify-modal-overlay-in"), this._overlay = this.context.insertBefore(this._overlay, this.context.firstChild), this._overlayOpen = !0, this._overlayInserted = !0, window.requestAnimationFrame(function () {
            t._overlay.classList.add("pnotify-modal-overlay-in"), t.fire("afterAddOverlay");
          })), this._collapsingModalState = !1;
        }
      }, {
        key: "_removeOverlay",
        value: function value() {
          var t = this;
          this._overlay.parentNode && (this.fire("beforeRemoveOverlay"), this._overlay.classList.remove("pnotify-modal-overlay-in"), this._overlayOpen = !1, setTimeout(function () {
            t._overlayInserted = !1, t._overlay.parentNode && (t._overlay.parentNode.removeChild(t._overlay), t.fire("afterRemoveOverlay"));
          }, 250), setTimeout(function () {
            t._collapsingModalState = !1;
          }, 400));
        }
      }, {
        key: "notices",
        get: function get() {
          var t = [];
          return this.forEach(function (e) {
            return t.push(e);
          }), t;
        }
      }, {
        key: "length",
        get: function get() {
          return this._length;
        }
      }, {
        key: "leader",
        get: function get() {
          return this._leader;
        }
      }]), t;
    }(),
    gt = function gt() {
      for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
      return f(Jt, e);
    };
  var $t = at.Map;
  function _t(t, e, n) {
    var i = t.slice();
    return i[109] = e[n][0], i[110] = e[n][1], i;
  }
  function kt(t, e, n) {
    var i = t.slice();
    return i[109] = e[n][0], i[110] = e[n][1], i;
  }
  function xt(t, e, n) {
    var i = t.slice();
    return i[109] = e[n][0], i[110] = e[n][1], i;
  }
  function bt(t, e, n) {
    var i = t.slice();
    return i[109] = e[n][0], i[110] = e[n][1], i;
  }
  function wt(t, e) {
    var n,
      _i2,
      o,
      r,
      s = [{
        self: e[42]
      }, e[110]],
      a = e[109]["default"];
    function c(t) {
      for (var e = {}, n = 0; n < s.length; n += 1) e = $(e, s[n]);
      return {
        props: e
      };
    }
    return a && (_i2 = new a(c())), {
      key: t,
      first: null,
      c: function c() {
        n = S(), _i2 && dt(_i2.$$.fragment), o = S(), this.first = n;
      },
      m: function m(t, e) {
        C(t, n, e), _i2 && ht(_i2, t, e), C(t, o, e), r = !0;
      },
      p: function p(t, e) {
        var n = 2176 & e[1] ? ut(s, [2048 & e[1] && {
          self: t[42]
        }, 128 & e[1] && ft(t[110])]) : {};
        if (a !== (a = t[109]["default"])) {
          if (_i2) {
            it();
            var r = _i2;
            st(r.$$.fragment, 1, 0, function () {
              pt(r, 1);
            }), ot();
          }
          a ? (dt((_i2 = new a(c())).$$.fragment), rt(_i2.$$.fragment, 1), ht(_i2, o.parentNode, o)) : _i2 = null;
        } else a && _i2.$set(n);
      },
      i: function i(t) {
        r || (_i2 && rt(_i2.$$.fragment, t), r = !0);
      },
      o: function o(t) {
        _i2 && st(_i2.$$.fragment, t), r = !1;
      },
      d: function d(t) {
        t && M(n), t && M(o), _i2 && pt(_i2, t);
      }
    };
  }
  function Ot(t) {
    var e, n, i, o, r, s;
    return {
      c: function c() {
        e = T("div"), P(n = T("span"), "class", t[22]("closer")), P(e, "class", i = "pnotify-closer ".concat(t[21]("closer"), " ").concat(t[17] && !t[26] || t[28] ? "pnotify-hidden" : "")), P(e, "role", "button"), P(e, "tabindex", "0"), P(e, "title", o = t[20].close);
      },
      m: function m(i, o) {
        C(i, e, o), O(e, n), r || (s = N(e, "click", t[81]), r = !0);
      },
      p: function p(t, n) {
        335675392 & n[0] && i !== (i = "pnotify-closer ".concat(t[21]("closer"), " ").concat(t[17] && !t[26] || t[28] ? "pnotify-hidden" : "")) && P(e, "class", i), 1048576 & n[0] && o !== (o = t[20].close) && P(e, "title", o);
      },
      d: function d(t) {
        t && M(e), r = !1, s();
      }
    };
  }
  function Ct(t) {
    var e, n, i, o, r, s, a, c;
    return {
      c: function c() {
        e = T("div"), P(n = T("span"), "class", i = "".concat(t[22]("sticker"), " ").concat(t[3] ? t[22]("unstuck") : t[22]("stuck"))), P(e, "class", o = "pnotify-sticker ".concat(t[21]("sticker"), " ").concat(t[19] && !t[26] || t[28] ? "pnotify-hidden" : "")), P(e, "role", "button"), P(e, "aria-pressed", r = !t[3]), P(e, "tabindex", "0"), P(e, "title", s = t[3] ? t[20].stick : t[20].unstick);
      },
      m: function m(i, o) {
        C(i, e, o), O(e, n), a || (c = N(e, "click", t[82]), a = !0);
      },
      p: function p(t, a) {
        8 & a[0] && i !== (i = "".concat(t[22]("sticker"), " ").concat(t[3] ? t[22]("unstuck") : t[22]("stuck"))) && P(n, "class", i), 336068608 & a[0] && o !== (o = "pnotify-sticker ".concat(t[21]("sticker"), " ").concat(t[19] && !t[26] || t[28] ? "pnotify-hidden" : "")) && P(e, "class", o), 8 & a[0] && r !== (r = !t[3]) && P(e, "aria-pressed", r), 1048584 & a[0] && s !== (s = t[3] ? t[20].stick : t[20].unstick) && P(e, "title", s);
      },
      d: function d(t) {
        t && M(e), a = !1, c();
      }
    };
  }
  function Mt(t) {
    var e, n, i;
    return {
      c: function c() {
        e = T("div"), P(n = T("span"), "class", i = !0 === t[13] ? t[22](t[4]) : t[13]), P(e, "class", "pnotify-icon ".concat(t[21]("icon")));
      },
      m: function m(i, o) {
        C(i, e, o), O(e, n), t[83](e);
      },
      p: function p(t, e) {
        8208 & e[0] && i !== (i = !0 === t[13] ? t[22](t[4]) : t[13]) && P(n, "class", i);
      },
      d: function d(n) {
        n && M(e), t[83](null);
      }
    };
  }
  function Tt(t, e) {
    var n,
      _i3,
      o,
      r,
      s = [{
        self: e[42]
      }, e[110]],
      a = e[109]["default"];
    function c(t) {
      for (var e = {}, n = 0; n < s.length; n += 1) e = $(e, s[n]);
      return {
        props: e
      };
    }
    return a && (_i3 = new a(c())), {
      key: t,
      first: null,
      c: function c() {
        n = S(), _i3 && dt(_i3.$$.fragment), o = S(), this.first = n;
      },
      m: function m(t, e) {
        C(t, n, e), _i3 && ht(_i3, t, e), C(t, o, e), r = !0;
      },
      p: function p(t, e) {
        var n = 2304 & e[1] ? ut(s, [2048 & e[1] && {
          self: t[42]
        }, 256 & e[1] && ft(t[110])]) : {};
        if (a !== (a = t[109]["default"])) {
          if (_i3) {
            it();
            var r = _i3;
            st(r.$$.fragment, 1, 0, function () {
              pt(r, 1);
            }), ot();
          }
          a ? (dt((_i3 = new a(c())).$$.fragment), rt(_i3.$$.fragment, 1), ht(_i3, o.parentNode, o)) : _i3 = null;
        } else a && _i3.$set(n);
      },
      i: function i(t) {
        r || (_i3 && rt(_i3.$$.fragment, t), r = !0);
      },
      o: function o(t) {
        _i3 && st(_i3.$$.fragment, t), r = !1;
      },
      d: function d(t) {
        t && M(n), t && M(o), _i3 && pt(_i3, t);
      }
    };
  }
  function Ht(t) {
    var e,
      n = !t[34] && Et(t);
    return {
      c: function c() {
        e = T("div"), n && n.c(), P(e, "class", "pnotify-title ".concat(t[21]("title")));
      },
      m: function m(i, o) {
        C(i, e, o), n && n.m(e, null), t[84](e);
      },
      p: function p(t, i) {
        t[34] ? n && (n.d(1), n = null) : n ? n.p(t, i) : ((n = Et(t)).c(), n.m(e, null));
      },
      d: function d(i) {
        i && M(e), n && n.d(), t[84](null);
      }
    };
  }
  function Et(t) {
    var e;
    function n(t, e) {
      return t[6] ? Nt : St;
    }
    var i = n(t),
      o = i(t);
    return {
      c: function c() {
        o.c(), e = S();
      },
      m: function m(t, n) {
        o.m(t, n), C(t, e, n);
      },
      p: function p(t, r) {
        i === (i = n(t)) && o ? o.p(t, r) : (o.d(1), (o = i(t)) && (o.c(), o.m(e.parentNode, e)));
      },
      d: function d(t) {
        o.d(t), t && M(e);
      }
    };
  }
  function St(t) {
    var e, n;
    return {
      c: function c() {
        e = T("span"), n = H(t[5]), P(e, "class", "pnotify-pre-line");
      },
      m: function m(t, i) {
        C(t, e, i), O(e, n);
      },
      p: function p(t, e) {
        32 & e[0] && L(n, t[5]);
      },
      d: function d(t) {
        t && M(e);
      }
    };
  }
  function Nt(t) {
    var e, n;
    return {
      c: function c() {
        n = S(), e = new R(n);
      },
      m: function m(i, o) {
        e.m(t[5], i, o), C(i, n, o);
      },
      p: function p(t, n) {
        32 & n[0] && e.p(t[5]);
      },
      d: function d(t) {
        t && M(n), t && e.d();
      }
    };
  }
  function Pt(t) {
    var e,
      n,
      i = !t[35] && At(t);
    return {
      c: function c() {
        e = T("div"), i && i.c(), P(e, "class", n = "pnotify-text ".concat(t[21]("text"), " ").concat("" === t[33] ? "" : "pnotify-text-with-max-height")), P(e, "style", t[33]), P(e, "role", "alert");
      },
      m: function m(n, o) {
        C(n, e, o), i && i.m(e, null), t[85](e);
      },
      p: function p(t, o) {
        t[35] ? i && (i.d(1), i = null) : i ? i.p(t, o) : ((i = At(t)).c(), i.m(e, null)), 4 & o[1] && n !== (n = "pnotify-text ".concat(t[21]("text"), " ").concat("" === t[33] ? "" : "pnotify-text-with-max-height")) && P(e, "class", n), 4 & o[1] && P(e, "style", t[33]);
      },
      d: function d(n) {
        n && M(e), i && i.d(), t[85](null);
      }
    };
  }
  function At(t) {
    var e;
    function n(t, e) {
      return t[8] ? jt : Lt;
    }
    var i = n(t),
      o = i(t);
    return {
      c: function c() {
        o.c(), e = S();
      },
      m: function m(t, n) {
        o.m(t, n), C(t, e, n);
      },
      p: function p(t, r) {
        i === (i = n(t)) && o ? o.p(t, r) : (o.d(1), (o = i(t)) && (o.c(), o.m(e.parentNode, e)));
      },
      d: function d(t) {
        o.d(t), t && M(e);
      }
    };
  }
  function Lt(t) {
    var e, n;
    return {
      c: function c() {
        e = T("span"), n = H(t[7]), P(e, "class", "pnotify-pre-line");
      },
      m: function m(t, i) {
        C(t, e, i), O(e, n);
      },
      p: function p(t, e) {
        128 & e[0] && L(n, t[7]);
      },
      d: function d(t) {
        t && M(e);
      }
    };
  }
  function jt(t) {
    var e, n;
    return {
      c: function c() {
        n = S(), e = new R(n);
      },
      m: function m(i, o) {
        e.m(t[7], i, o), C(i, n, o);
      },
      p: function p(t, n) {
        128 & n[0] && e.p(t[7]);
      },
      d: function d(t) {
        t && M(n), t && e.d();
      }
    };
  }
  function Rt(t, e) {
    var n,
      _i4,
      o,
      r,
      s = [{
        self: e[42]
      }, e[110]],
      a = e[109]["default"];
    function c(t) {
      for (var e = {}, n = 0; n < s.length; n += 1) e = $(e, s[n]);
      return {
        props: e
      };
    }
    return a && (_i4 = new a(c())), {
      key: t,
      first: null,
      c: function c() {
        n = S(), _i4 && dt(_i4.$$.fragment), o = S(), this.first = n;
      },
      m: function m(t, e) {
        C(t, n, e), _i4 && ht(_i4, t, e), C(t, o, e), r = !0;
      },
      p: function p(t, e) {
        var n = 2560 & e[1] ? ut(s, [2048 & e[1] && {
          self: t[42]
        }, 512 & e[1] && ft(t[110])]) : {};
        if (a !== (a = t[109]["default"])) {
          if (_i4) {
            it();
            var r = _i4;
            st(r.$$.fragment, 1, 0, function () {
              pt(r, 1);
            }), ot();
          }
          a ? (dt((_i4 = new a(c())).$$.fragment), rt(_i4.$$.fragment, 1), ht(_i4, o.parentNode, o)) : _i4 = null;
        } else a && _i4.$set(n);
      },
      i: function i(t) {
        r || (_i4 && rt(_i4.$$.fragment, t), r = !0);
      },
      o: function o(t) {
        _i4 && st(_i4.$$.fragment, t), r = !1;
      },
      d: function d(t) {
        t && M(n), t && M(o), _i4 && pt(_i4, t);
      }
    };
  }
  function Wt(t, e) {
    var n,
      _i5,
      o,
      r,
      s = [{
        self: e[42]
      }, e[110]],
      a = e[109]["default"];
    function c(t) {
      for (var e = {}, n = 0; n < s.length; n += 1) e = $(e, s[n]);
      return {
        props: e
      };
    }
    return a && (_i5 = new a(c())), {
      key: t,
      first: null,
      c: function c() {
        n = S(), _i5 && dt(_i5.$$.fragment), o = S(), this.first = n;
      },
      m: function m(t, e) {
        C(t, n, e), _i5 && ht(_i5, t, e), C(t, o, e), r = !0;
      },
      p: function p(t, e) {
        var n = 3072 & e[1] ? ut(s, [2048 & e[1] && {
          self: t[42]
        }, 1024 & e[1] && ft(t[110])]) : {};
        if (a !== (a = t[109]["default"])) {
          if (_i5) {
            it();
            var r = _i5;
            st(r.$$.fragment, 1, 0, function () {
              pt(r, 1);
            }), ot();
          }
          a ? (dt((_i5 = new a(c())).$$.fragment), rt(_i5.$$.fragment, 1), ht(_i5, o.parentNode, o)) : _i5 = null;
        } else a && _i5.$set(n);
      },
      i: function i(t) {
        r || (_i5 && rt(_i5.$$.fragment, t), r = !0);
      },
      o: function o(t) {
        _i5 && st(_i5.$$.fragment, t), r = !1;
      },
      d: function d(t) {
        t && M(n), t && M(o), _i5 && pt(_i5, t);
      }
    };
  }
  function It(t) {
    for (var e, n, i, o, r, s, a, _c, l, u, f, d, h, _p, _m, v, y, $ = [], _ = new $t(), k = [], w = new $t(), H = [], S = new $t(), A = [], L = new $t(), j = t[38], R = function R(t) {
        return t[109];
      }, W = 0; W < j.length; W += 1) {
      var I = bt(t, j, W),
        D = R(I);
      _.set(D, $[W] = wt(D, I));
    }
    for (var F = t[16] && !t[36] && Ot(t), q = t[18] && !t[36] && Ct(t), B = !1 !== t[13] && Mt(t), z = t[39], U = function U(t) {
        return t[109];
      }, G = 0; G < z.length; G += 1) {
      var J = xt(t, z, G),
        K = U(J);
      w.set(K, k[G] = Tt(K, J));
    }
    for (var Q = !1 !== t[5] && Ht(t), V = !1 !== t[7] && Pt(t), X = t[40], Y = function Y(t) {
        return t[109];
      }, Z = 0; Z < X.length; Z += 1) {
      var tt = kt(t, X, Z),
        et = Y(tt);
      S.set(et, H[Z] = Rt(et, tt));
    }
    for (var nt = t[41], at = function at(t) {
        return t[109];
      }, ut = 0; ut < nt.length; ut += 1) {
      var ft = _t(t, nt, ut),
        dt = at(ft);
      L.set(dt, A[ut] = Wt(dt, ft));
    }
    return {
      c: function c() {
        e = T("div"), n = T("div");
        for (var m = 0; m < $.length; m += 1) $[m].c();
        i = E(), F && F.c(), o = E(), q && q.c(), r = E(), B && B.c(), s = E(), a = T("div");
        for (var v = 0; v < k.length; v += 1) k[v].c();
        _c = E(), Q && Q.c(), l = E(), V && V.c(), u = E();
        for (var y = 0; y < H.length; y += 1) H[y].c();
        f = E();
        for (var g = 0; g < A.length; g += 1) A[g].c();
        P(a, "class", "pnotify-content ".concat(t[21]("content"))), P(n, "class", d = "pnotify-container ".concat(t[21]("container"), " ").concat(t[21](t[4]), " ").concat(t[15] ? "pnotify-shadow" : "", " ").concat(t[27].container.join(" "))), P(n, "style", h = "".concat(t[31], " ").concat(t[32])), P(n, "role", "alert"), P(e, "data-pnotify", ""), P(e, "class", _p = "pnotify ".concat(!t[0] || t[0].positioned ? "pnotify-positioned" : "", " ").concat(!1 !== t[13] ? "pnotify-with-icon" : "", " ").concat(t[21]("elem"), " pnotify-mode-").concat(t[9], " ").concat(t[10], " ").concat(t[24], " ").concat(t[25], " ").concat(t[37], " ").concat("fade" === t[2] ? "pnotify-fade-".concat(t[14]) : "", " ").concat(t[30] ? "pnotify-modal ".concat(t[11]) : t[12], " ").concat(t[28] ? "pnotify-masking" : "", " ").concat(t[29] ? "pnotify-masking-in" : "", " ").concat(t[27].elem.join(" "))), P(e, "aria-live", "assertive"), P(e, "role", "alertdialog");
      },
      m: function m(d, h) {
        C(d, e, h), O(e, n);
        for (var p = 0; p < $.length; p += 1) $[p].m(n, null);
        O(n, i), F && F.m(n, null), O(n, o), q && q.m(n, null), O(n, r), B && B.m(n, null), O(n, s), O(n, a);
        for (var _ = 0; _ < k.length; _ += 1) k[_].m(a, null);
        O(a, _c), Q && Q.m(a, null), O(a, l), V && V.m(a, null), O(a, u);
        for (var x = 0; x < H.length; x += 1) H[x].m(a, null);
        t[86](a), O(n, f);
        for (var w = 0; w < A.length; w += 1) A[w].m(n, null);
        var M;
        t[87](n), t[88](e), _m = !0, v || (y = [(M = t[43].call(null, e), M && b(M.destroy) ? M.destroy : g), N(e, "mouseenter", t[44]), N(e, "mouseleave", t[45]), N(e, "focusin", t[44]), N(e, "focusout", t[45])], v = !0);
      },
      p: function p(t, f) {
        if (2176 & f[1]) {
          var v = t[38];
          it(), $ = lt($, f, R, 1, t, v, _, n, ct, wt, i, bt), ot();
        }
        if (t[16] && !t[36] ? F ? F.p(t, f) : ((F = Ot(t)).c(), F.m(n, o)) : F && (F.d(1), F = null), t[18] && !t[36] ? q ? q.p(t, f) : ((q = Ct(t)).c(), q.m(n, r)) : q && (q.d(1), q = null), !1 !== t[13] ? B ? B.p(t, f) : ((B = Mt(t)).c(), B.m(n, s)) : B && (B.d(1), B = null), 2304 & f[1]) {
          var y = t[39];
          it(), k = lt(k, f, U, 1, t, y, w, a, ct, Tt, _c, xt), ot();
        }
        if (!1 !== t[5] ? Q ? Q.p(t, f) : ((Q = Ht(t)).c(), Q.m(a, l)) : Q && (Q.d(1), Q = null), !1 !== t[7] ? V ? V.p(t, f) : ((V = Pt(t)).c(), V.m(a, u)) : V && (V.d(1), V = null), 2560 & f[1]) {
          var g = t[40];
          it(), H = lt(H, f, Y, 1, t, g, S, a, ct, Rt, null, kt), ot();
        }
        if (3072 & f[1]) {
          var x = t[41];
          it(), A = lt(A, f, at, 1, t, x, L, n, ct, Wt, null, _t), ot();
        }
        (!_m || 134250512 & f[0] && d !== (d = "pnotify-container ".concat(t[21]("container"), " ").concat(t[21](t[4]), " ").concat(t[15] ? "pnotify-shadow" : "", " ").concat(t[27].container.join(" ")))) && P(n, "class", d), (!_m || 3 & f[1] && h !== (h = "".concat(t[31], " ").concat(t[32]))) && P(n, "style", h), (!_m || 2063629829 & f[0] | 64 & f[1] && _p !== (_p = "pnotify ".concat(!t[0] || t[0].positioned ? "pnotify-positioned" : "", " ").concat(!1 !== t[13] ? "pnotify-with-icon" : "", " ").concat(t[21]("elem"), " pnotify-mode-").concat(t[9], " ").concat(t[10], " ").concat(t[24], " ").concat(t[25], " ").concat(t[37], " ").concat("fade" === t[2] ? "pnotify-fade-".concat(t[14]) : "", " ").concat(t[30] ? "pnotify-modal ".concat(t[11]) : t[12], " ").concat(t[28] ? "pnotify-masking" : "", " ").concat(t[29] ? "pnotify-masking-in" : "", " ").concat(t[27].elem.join(" ")))) && P(e, "class", _p);
      },
      i: function i(t) {
        if (!_m) {
          for (var e = 0; e < j.length; e += 1) rt($[e]);
          for (var n = 0; n < z.length; n += 1) rt(k[n]);
          for (var i = 0; i < X.length; i += 1) rt(H[i]);
          for (var o = 0; o < nt.length; o += 1) rt(A[o]);
          _m = !0;
        }
      },
      o: function o(t) {
        for (var e = 0; e < $.length; e += 1) st($[e]);
        for (var n = 0; n < k.length; n += 1) st(k[n]);
        for (var i = 0; i < H.length; i += 1) st(H[i]);
        for (var o = 0; o < A.length; o += 1) st(A[o]);
        _m = !1;
      },
      d: function d(n) {
        n && M(e);
        for (var i = 0; i < $.length; i += 1) $[i].d();
        F && F.d(), q && q.d(), B && B.d();
        for (var o = 0; o < k.length; o += 1) k[o].d();
        Q && Q.d(), V && V.d();
        for (var r = 0; r < H.length; r += 1) H[r].d();
        t[86](null);
        for (var s = 0; s < A.length; s += 1) A[s].d();
        t[87](null), t[88](null), v = !1, x(y);
      }
    };
  }
  function Dt(t, n) {
    "object" !== e(t) && (t = {
      text: t
    }), n && (t.type = n);
    var i = document.body;
    return "stack" in t && t.stack && t.stack.context && (i = t.stack.context), {
      target: i,
      props: t
    };
  }
  var Ft,
    qt = new yt({
      dir1: "down",
      dir2: "left",
      firstpos1: 25,
      firstpos2: 25,
      spacing1: 36,
      spacing2: 36,
      push: "bottom"
    }),
    Bt = new Map(),
    zt = {
      type: "notice",
      title: !1,
      titleTrusted: !1,
      text: !1,
      textTrusted: !1,
      styling: "brighttheme",
      icons: "brighttheme",
      mode: "no-preference",
      addClass: "",
      addModalClass: "",
      addModelessClass: "",
      autoOpen: !0,
      width: "360px",
      minHeight: "16px",
      maxTextHeight: "200px",
      icon: !0,
      animation: "fade",
      animateSpeed: "normal",
      shadow: !0,
      hide: !0,
      delay: 8e3,
      mouseReset: !0,
      closer: !0,
      closerHover: !0,
      sticker: !0,
      stickerHover: !0,
      labels: {
        close: "Close",
        stick: "Pin",
        unstick: "Unpin"
      },
      remove: !0,
      destroy: !0,
      stack: qt,
      modules: Bt
    };
  function Ut() {
    qt.context || (qt.context = document.body), window.addEventListener("resize", function () {
      Ft && clearTimeout(Ft), Ft = setTimeout(function () {
        var t = new Event("pnotify:position");
        document.body.dispatchEvent(t), Ft = null;
      }, 10);
    });
  }
  function Gt(t, e, n) {
    var i = I(),
      o = D(),
      r = function (t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          n = ["focus", "blur", "fullscreenchange", "fullscreenerror", "scroll", "cut", "copy", "paste", "keydown", "keypress", "keyup", "auxclick", "click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "pointerlockchange", "pointerlockerror", "select", "wheel", "drag", "dragend", "dragenter", "dragstart", "dragleave", "dragover", "drop", "touchcancel", "touchend", "touchmove", "touchstart", "pointerover", "pointerenter", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerout", "pointerleave", "gotpointercapture", "lostpointercapture"].concat(m(e));
        function i(e) {
          F(t, e);
        }
        return function (t) {
          for (var e = [], o = 0; o < n.length; o++) e.push(N(t, n[o], i));
          return {
            destroy: function destroy() {
              for (var t = 0; t < e.length; t++) e[t]();
            }
          };
        };
      }(i, ["pnotify:init", "pnotify:mount", "pnotify:update", "pnotify:beforeOpen", "pnotify:afterOpen", "pnotify:enterModal", "pnotify:leaveModal", "pnotify:beforeClose", "pnotify:afterClose", "pnotify:beforeDestroy", "pnotify:afterDestroy", "focusin", "focusout", "animationend", "transitionend"]),
      s = e.modules,
      c = void 0 === s ? new Map(zt.modules) : s,
      l = e.stack,
      u = void 0 === l ? zt.stack : l,
      f = {
        elem: null,
        container: null,
        content: null,
        iconContainer: null,
        titleContainer: null,
        textContainer: null
      },
      d = a({}, zt);
    Qt("init", {
      notice: i,
      defaults: d
    });
    var h,
      v = e.type,
      y = void 0 === v ? d.type : v,
      g = e.title,
      $ = void 0 === g ? d.title : g,
      _ = e.titleTrusted,
      k = void 0 === _ ? d.titleTrusted : _,
      x = e.text,
      b = void 0 === x ? d.text : x,
      w = e.textTrusted,
      O = void 0 === w ? d.textTrusted : w,
      C = e.styling,
      M = void 0 === C ? d.styling : C,
      T = e.icons,
      H = void 0 === T ? d.icons : T,
      E = e.mode,
      S = void 0 === E ? d.mode : E,
      P = e.addClass,
      A = void 0 === P ? d.addClass : P,
      L = e.addModalClass,
      j = void 0 === L ? d.addModalClass : L,
      R = e.addModelessClass,
      W = void 0 === R ? d.addModelessClass : R,
      q = e.autoOpen,
      z = void 0 === q ? d.autoOpen : q,
      U = e.width,
      G = void 0 === U ? d.width : U,
      J = e.minHeight,
      K = void 0 === J ? d.minHeight : J,
      V = e.maxTextHeight,
      X = void 0 === V ? d.maxTextHeight : V,
      Y = e.icon,
      Z = void 0 === Y ? d.icon : Y,
      tt = e.animation,
      et = void 0 === tt ? d.animation : tt,
      nt = e.animateSpeed,
      it = void 0 === nt ? d.animateSpeed : nt,
      ot = e.shadow,
      rt = void 0 === ot ? d.shadow : ot,
      st = e.hide,
      at = void 0 === st ? d.hide : st,
      ct = e.delay,
      lt = void 0 === ct ? d.delay : ct,
      ut = e.mouseReset,
      ft = void 0 === ut ? d.mouseReset : ut,
      dt = e.closer,
      ht = void 0 === dt ? d.closer : dt,
      pt = e.closerHover,
      mt = void 0 === pt ? d.closerHover : pt,
      vt = e.sticker,
      yt = void 0 === vt ? d.sticker : vt,
      gt = e.stickerHover,
      $t = void 0 === gt ? d.stickerHover : gt,
      _t = e.labels,
      kt = void 0 === _t ? d.labels : _t,
      xt = e.remove,
      bt = void 0 === xt ? d.remove : xt,
      wt = e.destroy,
      Ot = void 0 === wt ? d.destroy : wt,
      Ct = "closed",
      Mt = null,
      Tt = null,
      Ht = null,
      Et = !1,
      St = "",
      Nt = "",
      Pt = !1,
      At = !1,
      Lt = {
        elem: [],
        container: []
      },
      jt = !1,
      Rt = !1,
      Wt = !1,
      It = !1,
      Dt = null,
      Ft = at,
      qt = null,
      Bt = null,
      Ut = u && (!0 === u.modal || "ish" === u.modal && "prevented" === Mt),
      Gt = NaN,
      Jt = null,
      Kt = null;
    function Qt(t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = a({
          notice: i
        }, e);
      "init" === t && Array.from(c).forEach(function (t) {
        var e = p(t, 2),
          i = e[0];
        e[1];
        return "init" in i && i.init(n);
      });
      var r = f.elem || u && u.context || document.body;
      if (!r) return o("pnotify:".concat(t), n), !0;
      var s = new Event("pnotify:".concat(t), {
        bubbles: "init" === t || "mount" === t,
        cancelable: t.startsWith("before")
      });
      return s.detail = n, r.dispatchEvent(s), !s.defaultPrevented;
    }
    function Vt() {
      var t = u && u.context || document.body;
      if (!t) throw new Error("No context to insert this notice into.");
      if (!f.elem) throw new Error("Trying to insert notice before element is available.");
      f.elem.parentNode !== t && t.appendChild(f.elem);
    }
    function Xt() {
      f.elem && f.elem.parentNode.removeChild(f.elem);
    }
    h = function h() {
      Qt("mount"), z && Zt()["catch"](function () {});
    }, I().$$.on_mount.push(h), function (t) {
      I().$$.before_update.push(t);
    }(function () {
      Qt("update"), "closed" !== Ct && "waiting" !== Ct && at !== Ft && (at ? Ft || ae() : se()), "closed" !== Ct && "closing" !== Ct && u && !u._collapsingModalState && u.queuePosition(), Ft = at;
    });
    var Yt = e.open,
      Zt = void 0 === Yt ? function (t) {
        if ("opening" === Ct) return qt;
        if ("open" === Ct) return at && ae(), Promise.resolve();
        if (!jt && u && u._shouldNoticeWait(i)) return Ct = "waiting", Promise.reject();
        if (!Qt("beforeOpen", {
          immediate: t
        })) return Promise.reject();
        var e, o;
        Ct = "opening", n(28, Wt = !1), n(24, St = "pnotify-initial pnotify-hidden");
        var r = new Promise(function (t, n) {
          e = t, o = n;
        });
        qt = r;
        var s = function s() {
          at && ae(), Ct = "open", Qt("afterOpen", {
            immediate: t
          }), qt = null, e();
        };
        return Rt ? (s(), Promise.resolve()) : (Vt(), window.requestAnimationFrame(function () {
          if ("opening" !== Ct) return o(), void (qt = null);
          u && (n(0, u._animation = !1, u), "top" === u.push && u._resetPositionData(), u._positionNotice(i), u.queuePosition(0), n(0, u._animation = !0, u)), ie(s, t);
        }), r);
      } : Yt,
      te = e.close,
      ee = void 0 === te ? function (t, e, o) {
        if ("closing" === Ct) return Bt;
        if ("closed" === Ct) return Promise.resolve();
        var r,
          s = function s() {
            Qt("beforeDestroy") && (u && u._removeNotice(i), i.$destroy(), Qt("afterDestroy"));
          };
        if ("waiting" === Ct) return o || (Ct = "closed", Ot && !o && s()), Promise.resolve();
        if (!Qt("beforeClose", {
          immediate: t,
          timerHide: e,
          waitAfterward: o
        })) return Promise.reject();
        Ct = "closing", Pt = !!e, Mt && "prevented" !== Mt && clearTimeout && clearTimeout(Mt), Mt = null;
        var a = new Promise(function (t, e) {
          r = t;
        });
        return Bt = a, re(function () {
          n(26, At = !1), Pt = !1, Ct = o ? "waiting" : "closed", Qt("afterClose", {
            immediate: t,
            timerHide: e,
            waitAfterward: o
          }), Bt = null, r(), o || (Ot ? s() : bt && Xt());
        }, t), a;
      } : te,
      ne = e.animateIn,
      ie = void 0 === ne ? function (t, e) {
        Et = "in";
        var i = function e(n) {
          if (!(n && f.elem && n.target !== f.elem || (f.elem && f.elem.removeEventListener("transitionend", e), Tt && clearTimeout(Tt), "in" !== Et))) {
            var i = Rt;
            if (!i && f.elem) {
              var o = f.elem.getBoundingClientRect();
              for (var r in o) if (o[r] > 0) {
                i = !0;
                break;
              }
            }
            i ? (t && t.call(), Et = !1) : Tt = setTimeout(e, 40);
          }
        };
        if ("fade" !== et || e) {
          var o = et;
          n(2, et = "none"), n(24, St = "pnotify-in ".concat("fade" === o ? "pnotify-fade-in" : "")), Q().then(function () {
            n(2, et = o), i();
          });
        } else f.elem && f.elem.addEventListener("transitionend", i), n(24, St = "pnotify-in"), Q().then(function () {
          n(24, St = "pnotify-in pnotify-fade-in"), Tt = setTimeout(i, 650);
        });
      } : ne,
      oe = e.animateOut,
      re = void 0 === oe ? function (t, e) {
        Et = "out";
        var i = function e(i) {
          if (!(i && f.elem && i.target !== f.elem || (f.elem && f.elem.removeEventListener("transitionend", e), Ht && clearTimeout(Ht), "out" !== Et))) {
            var o = Rt;
            if (!o && f.elem) {
              var r = f.elem.getBoundingClientRect();
              for (var s in r) if (r[s] > 0) {
                o = !0;
                break;
              }
            }
            f.elem && f.elem.style.opacity && "0" !== f.elem.style.opacity && o ? Ht = setTimeout(e, 40) : (n(24, St = ""), t && t.call(), Et = !1);
          }
        };
        "fade" !== et || e ? (n(24, St = ""), Q().then(function () {
          i();
        })) : (f.elem && f.elem.addEventListener("transitionend", i), n(24, St = "pnotify-in"), Ht = setTimeout(i, 650));
      } : oe;
    function se() {
      Mt && "prevented" !== Mt && (clearTimeout(Mt), Mt = null), Ht && clearTimeout(Ht), "closing" === Ct && (Ct = "open", Et = !1, n(24, St = "fade" === et ? "pnotify-in pnotify-fade-in" : "pnotify-in"));
    }
    function ae() {
      "prevented" !== Mt && (se(), lt !== 1 / 0 && (Mt = setTimeout(function () {
        return ee(!1, !0);
      }, isNaN(lt) ? 0 : lt)));
    }
    var ce, le, ue, fe, de, he, pe, me, ve, ye, ge;
    return t.$$set = function (t) {
      "modules" in t && n(46, c = t.modules), "stack" in t && n(0, u = t.stack), "type" in t && n(4, y = t.type), "title" in t && n(5, $ = t.title), "titleTrusted" in t && n(6, k = t.titleTrusted), "text" in t && n(7, b = t.text), "textTrusted" in t && n(8, O = t.textTrusted), "styling" in t && n(47, M = t.styling), "icons" in t && n(48, H = t.icons), "mode" in t && n(9, S = t.mode), "addClass" in t && n(10, A = t.addClass), "addModalClass" in t && n(11, j = t.addModalClass), "addModelessClass" in t && n(12, W = t.addModelessClass), "autoOpen" in t && n(49, z = t.autoOpen), "width" in t && n(50, G = t.width), "minHeight" in t && n(51, K = t.minHeight), "maxTextHeight" in t && n(52, X = t.maxTextHeight), "icon" in t && n(13, Z = t.icon), "animation" in t && n(2, et = t.animation), "animateSpeed" in t && n(14, it = t.animateSpeed), "shadow" in t && n(15, rt = t.shadow), "hide" in t && n(3, at = t.hide), "delay" in t && n(53, lt = t.delay), "mouseReset" in t && n(54, ft = t.mouseReset), "closer" in t && n(16, ht = t.closer), "closerHover" in t && n(17, mt = t.closerHover), "sticker" in t && n(18, yt = t.sticker), "stickerHover" in t && n(19, $t = t.stickerHover), "labels" in t && n(20, kt = t.labels), "remove" in t && n(55, bt = t.remove), "destroy" in t && n(56, Ot = t.destroy), "open" in t && n(59, Zt = t.open), "close" in t && n(23, ee = t.close), "animateIn" in t && n(60, ie = t.animateIn), "animateOut" in t && n(61, re = t.animateOut);
    }, t.$$.update = function () {
      524288 & t.$$.dirty[1] && n(31, ce = "string" == typeof G ? "width: ".concat(G, ";") : ""), 1048576 & t.$$.dirty[1] && n(32, le = "string" == typeof K ? "min-height: ".concat(K, ";") : ""), 2097152 & t.$$.dirty[1] && n(33, ue = "string" == typeof X ? "max-height: ".concat(X, ";") : ""), 32 & t.$$.dirty[0] && n(34, fe = $ instanceof HTMLElement), 128 & t.$$.dirty[0] && n(35, de = b instanceof HTMLElement), 1 & t.$$.dirty[0] | 1792 & t.$$.dirty[3] && Gt !== u && (Gt && (Gt._removeNotice(i), n(30, Ut = !1), Jt(), Kt()), u && (u._addNotice(i), n(102, Jt = u.on("beforeAddOverlay", function () {
        n(30, Ut = !0), Qt("enterModal");
      })), n(103, Kt = u.on("afterRemoveOverlay", function () {
        n(30, Ut = !1), Qt("leaveModal");
      }))), n(101, Gt = u)), 1073748992 & t.$$.dirty[0] && n(36, he = A.match(/\bnonblock\b/) || j.match(/\bnonblock\b/) && Ut || W.match(/\bnonblock\b/) && !Ut), 1 & t.$$.dirty[0] && n(37, pe = u && u.dir1 ? "pnotify-stack-".concat(u.dir1) : ""), 32768 & t.$$.dirty[1] && n(38, me = Array.from(c).filter(function (t) {
        var e = p(t, 2),
          n = e[0];
        e[1];
        return "PrependContainer" === n.position;
      })), 32768 & t.$$.dirty[1] && n(39, ve = Array.from(c).filter(function (t) {
        var e = p(t, 2),
          n = e[0];
        e[1];
        return "PrependContent" === n.position;
      })), 32768 & t.$$.dirty[1] && n(40, ye = Array.from(c).filter(function (t) {
        var e = p(t, 2),
          n = e[0];
        e[1];
        return "AppendContent" === n.position;
      })), 32768 & t.$$.dirty[1] && n(41, ge = Array.from(c).filter(function (t) {
        var e = p(t, 2),
          n = e[0];
        e[1];
        return "AppendContainer" === n.position;
      })), 34 & t.$$.dirty[0] | 8 & t.$$.dirty[1] && fe && f.titleContainer && f.titleContainer.appendChild($), 130 & t.$$.dirty[0] | 16 & t.$$.dirty[1] && de && f.textContainer && f.textContainer.appendChild(b);
    }, [u, f, et, at, y, $, k, b, O, S, A, j, W, Z, it, rt, ht, mt, yt, $t, kt, function (t) {
      return "string" == typeof M ? "".concat(M, "-").concat(t) : t in M ? M[t] : "".concat(M.prefix, "-").concat(t);
    }, function (t) {
      return "string" == typeof H ? "".concat(H, "-icon-").concat(t) : t in H ? H[t] : "".concat(H.prefix, "-icon-").concat(t);
    }, ee, St, Nt, At, Lt, Wt, It, Ut, ce, le, ue, fe, de, he, pe, me, ve, ye, ge, i, r, function (t) {
      if (n(26, At = !0), ft && "closing" === Ct) {
        if (!Pt) return;
        se();
      }
      at && ft && se();
    }, function (t) {
      n(26, At = !1), at && ft && "out" !== Et && -1 !== ["open", "opening"].indexOf(Ct) && ae();
    }, c, M, H, z, G, K, X, lt, ft, bt, Ot, function () {
      return Ct;
    }, function () {
      return Mt;
    }, Zt, ie, re, se, ae, function (t) {
      t ? (se(), Mt = "prevented") : "prevented" === Mt && (Mt = null, "open" === Ct && at && ae());
    }, function () {
      return i.$on.apply(i, arguments);
    }, function () {
      return i.$set.apply(i, arguments);
    }, function (t, e) {
      o(t, e);
    }, function (t) {
      for (var e = 0; e < (arguments.length <= 1 ? 0 : arguments.length - 1); e++) {
        var i = e + 1 < 1 || arguments.length <= e + 1 ? void 0 : arguments[e + 1];
        -1 === Lt[t].indexOf(i) && Lt[t].push(i);
      }
      n(27, Lt);
    }, function (t) {
      for (var e = 0; e < (arguments.length <= 1 ? 0 : arguments.length - 1); e++) {
        var i = e + 1 < 1 || arguments.length <= e + 1 ? void 0 : arguments[e + 1],
          o = Lt[t].indexOf(i);
        -1 !== o && Lt[t].splice(o, 1);
      }
      n(27, Lt);
    }, function (t) {
      for (var e = 0; e < (arguments.length <= 1 ? 0 : arguments.length - 1); e++) {
        var n = e + 1 < 1 || arguments.length <= e + 1 ? void 0 : arguments[e + 1];
        if (-1 === Lt[t].indexOf(n)) return !1;
      }
      return !0;
    }, function () {
      return jt;
    }, function (t) {
      return jt = t;
    }, function () {
      return Rt;
    }, function (t) {
      return Rt = t;
    }, function (t) {
      return Et = t;
    }, function () {
      return St;
    }, function (t) {
      return n(24, St = t);
    }, function () {
      return Nt;
    }, function (t) {
      return n(25, Nt = t);
    }, function (t, e, i) {
      if (Dt && clearTimeout(Dt), Wt !== t) if (t) n(28, Wt = !0), n(29, It = !!e), Vt(), Q().then(function () {
        window.requestAnimationFrame(function () {
          if (Wt) if (e && i) i();else {
            n(29, It = !0);
            var t = function t() {
              f.elem && f.elem.removeEventListener("transitionend", t), Dt && clearTimeout(Dt), It && i && i();
            };
            f.elem && f.elem.addEventListener("transitionend", t), Dt = setTimeout(t, 650);
          }
        });
      });else if (e) n(28, Wt = !1), n(29, It = !1), bt && -1 === ["open", "opening", "closing"].indexOf(Ct) && Xt(), i && i();else {
        var o = function t() {
          f.elem && f.elem.removeEventListener("transitionend", t), Dt && clearTimeout(Dt), It || (n(28, Wt = !1), bt && -1 === ["open", "opening", "closing"].indexOf(Ct) && Xt(), i && i());
        };
        n(29, It = !1), f.elem && f.elem.addEventListener("transitionend", o), f.elem && f.elem.style.opacity, Dt = setTimeout(o, 650);
      }
    }, function () {
      return ee(!1);
    }, function () {
      return n(3, at = !at);
    }, function (t) {
      B[t ? "unshift" : "push"](function () {
        f.iconContainer = t, n(1, f);
      });
    }, function (t) {
      B[t ? "unshift" : "push"](function () {
        f.titleContainer = t, n(1, f);
      });
    }, function (t) {
      B[t ? "unshift" : "push"](function () {
        f.textContainer = t, n(1, f);
      });
    }, function (t) {
      B[t ? "unshift" : "push"](function () {
        f.content = t, n(1, f);
      });
    }, function (t) {
      B[t ? "unshift" : "push"](function () {
        f.container = t, n(1, f);
      });
    }, function (t) {
      B[t ? "unshift" : "push"](function () {
        f.elem = t, n(1, f);
      });
    }];
  }
  window && document.body ? Ut() : document.addEventListener("DOMContentLoaded", Ut);
  var Jt = function (t) {
    !function (t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
      t.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: t,
          writable: !0,
          configurable: !0
        }
      }), e && l(t, e);
    }(s, t);
    var e,
      i,
      r = (e = s, i = u(), function () {
        var t,
          n = c(e);
        if (i) {
          var o = c(this).constructor;
          t = Reflect.construct(n, arguments, o);
        } else t = n.apply(this, arguments);
        return h(this, t);
      });
    function s(t) {
      var e;
      return n(this, s), function (t, e, n, i, o, r) {
        var s = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : [-1],
          a = j;
        W(t);
        var c = e.props || {},
          l = t.$$ = {
            fragment: null,
            ctx: null,
            props: r,
            update: g,
            not_equal: o,
            bound: k(),
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(a ? a.$$.context : []),
            callbacks: k(),
            dirty: s,
            skip_bound: !1
          },
          u = !1;
        if (l.ctx = n ? n(t, c, function (e, n) {
          var i = !(arguments.length <= 2) && arguments.length - 2 ? arguments.length <= 2 ? void 0 : arguments[2] : n;
          return l.ctx && o(l.ctx[e], l.ctx[e] = i) && (!l.skip_bound && l.bound[e] && l.bound[e](i), u && mt(t, e)), n;
        }) : [], l.update(), u = !0, x(l.before_update), l.fragment = !!i && i(l.ctx), e.target) {
          if (e.hydrate) {
            var f = A(e.target);
            l.fragment && l.fragment.l(f), f.forEach(M);
          } else l.fragment && l.fragment.c();
          e.intro && rt(t.$$.fragment), ht(t, e.target, e.anchor), Z();
        }
        W(a);
      }(d(e = r.call(this)), t, Gt, It, w, {
        modules: 46,
        stack: 0,
        refs: 1,
        type: 4,
        title: 5,
        titleTrusted: 6,
        text: 7,
        textTrusted: 8,
        styling: 47,
        icons: 48,
        mode: 9,
        addClass: 10,
        addModalClass: 11,
        addModelessClass: 12,
        autoOpen: 49,
        width: 50,
        minHeight: 51,
        maxTextHeight: 52,
        icon: 13,
        animation: 2,
        animateSpeed: 14,
        shadow: 15,
        hide: 3,
        delay: 53,
        mouseReset: 54,
        closer: 16,
        closerHover: 17,
        sticker: 18,
        stickerHover: 19,
        labels: 20,
        remove: 55,
        destroy: 56,
        getState: 57,
        getTimer: 58,
        getStyle: 21,
        getIcon: 22,
        open: 59,
        close: 23,
        animateIn: 60,
        animateOut: 61,
        cancelClose: 62,
        queueClose: 63,
        _preventTimerClose: 64,
        on: 65,
        update: 66,
        fire: 67,
        addModuleClass: 68,
        removeModuleClass: 69,
        hasModuleClass: 70,
        getModuleHandled: 71,
        setModuleHandled: 72,
        getModuleOpen: 73,
        setModuleOpen: 74,
        setAnimating: 75,
        getAnimatingClass: 76,
        setAnimatingClass: 77,
        _getMoveClass: 78,
        _setMoveClass: 79,
        _setMasking: 80
      }, [-1, -1, -1, -1]), e;
    }
    return o(s, [{
      key: "modules",
      get: function get() {
        return this.$$.ctx[46];
      },
      set: function set(t) {
        this.$set({
          modules: t
        }), Z();
      }
    }, {
      key: "stack",
      get: function get() {
        return this.$$.ctx[0];
      },
      set: function set(t) {
        this.$set({
          stack: t
        }), Z();
      }
    }, {
      key: "refs",
      get: function get() {
        return this.$$.ctx[1];
      }
    }, {
      key: "type",
      get: function get() {
        return this.$$.ctx[4];
      },
      set: function set(t) {
        this.$set({
          type: t
        }), Z();
      }
    }, {
      key: "title",
      get: function get() {
        return this.$$.ctx[5];
      },
      set: function set(t) {
        this.$set({
          title: t
        }), Z();
      }
    }, {
      key: "titleTrusted",
      get: function get() {
        return this.$$.ctx[6];
      },
      set: function set(t) {
        this.$set({
          titleTrusted: t
        }), Z();
      }
    }, {
      key: "text",
      get: function get() {
        return this.$$.ctx[7];
      },
      set: function set(t) {
        this.$set({
          text: t
        }), Z();
      }
    }, {
      key: "textTrusted",
      get: function get() {
        return this.$$.ctx[8];
      },
      set: function set(t) {
        this.$set({
          textTrusted: t
        }), Z();
      }
    }, {
      key: "styling",
      get: function get() {
        return this.$$.ctx[47];
      },
      set: function set(t) {
        this.$set({
          styling: t
        }), Z();
      }
    }, {
      key: "icons",
      get: function get() {
        return this.$$.ctx[48];
      },
      set: function set(t) {
        this.$set({
          icons: t
        }), Z();
      }
    }, {
      key: "mode",
      get: function get() {
        return this.$$.ctx[9];
      },
      set: function set(t) {
        this.$set({
          mode: t
        }), Z();
      }
    }, {
      key: "addClass",
      get: function get() {
        return this.$$.ctx[10];
      },
      set: function set(t) {
        this.$set({
          addClass: t
        }), Z();
      }
    }, {
      key: "addModalClass",
      get: function get() {
        return this.$$.ctx[11];
      },
      set: function set(t) {
        this.$set({
          addModalClass: t
        }), Z();
      }
    }, {
      key: "addModelessClass",
      get: function get() {
        return this.$$.ctx[12];
      },
      set: function set(t) {
        this.$set({
          addModelessClass: t
        }), Z();
      }
    }, {
      key: "autoOpen",
      get: function get() {
        return this.$$.ctx[49];
      },
      set: function set(t) {
        this.$set({
          autoOpen: t
        }), Z();
      }
    }, {
      key: "width",
      get: function get() {
        return this.$$.ctx[50];
      },
      set: function set(t) {
        this.$set({
          width: t
        }), Z();
      }
    }, {
      key: "minHeight",
      get: function get() {
        return this.$$.ctx[51];
      },
      set: function set(t) {
        this.$set({
          minHeight: t
        }), Z();
      }
    }, {
      key: "maxTextHeight",
      get: function get() {
        return this.$$.ctx[52];
      },
      set: function set(t) {
        this.$set({
          maxTextHeight: t
        }), Z();
      }
    }, {
      key: "icon",
      get: function get() {
        return this.$$.ctx[13];
      },
      set: function set(t) {
        this.$set({
          icon: t
        }), Z();
      }
    }, {
      key: "animation",
      get: function get() {
        return this.$$.ctx[2];
      },
      set: function set(t) {
        this.$set({
          animation: t
        }), Z();
      }
    }, {
      key: "animateSpeed",
      get: function get() {
        return this.$$.ctx[14];
      },
      set: function set(t) {
        this.$set({
          animateSpeed: t
        }), Z();
      }
    }, {
      key: "shadow",
      get: function get() {
        return this.$$.ctx[15];
      },
      set: function set(t) {
        this.$set({
          shadow: t
        }), Z();
      }
    }, {
      key: "hide",
      get: function get() {
        return this.$$.ctx[3];
      },
      set: function set(t) {
        this.$set({
          hide: t
        }), Z();
      }
    }, {
      key: "delay",
      get: function get() {
        return this.$$.ctx[53];
      },
      set: function set(t) {
        this.$set({
          delay: t
        }), Z();
      }
    }, {
      key: "mouseReset",
      get: function get() {
        return this.$$.ctx[54];
      },
      set: function set(t) {
        this.$set({
          mouseReset: t
        }), Z();
      }
    }, {
      key: "closer",
      get: function get() {
        return this.$$.ctx[16];
      },
      set: function set(t) {
        this.$set({
          closer: t
        }), Z();
      }
    }, {
      key: "closerHover",
      get: function get() {
        return this.$$.ctx[17];
      },
      set: function set(t) {
        this.$set({
          closerHover: t
        }), Z();
      }
    }, {
      key: "sticker",
      get: function get() {
        return this.$$.ctx[18];
      },
      set: function set(t) {
        this.$set({
          sticker: t
        }), Z();
      }
    }, {
      key: "stickerHover",
      get: function get() {
        return this.$$.ctx[19];
      },
      set: function set(t) {
        this.$set({
          stickerHover: t
        }), Z();
      }
    }, {
      key: "labels",
      get: function get() {
        return this.$$.ctx[20];
      },
      set: function set(t) {
        this.$set({
          labels: t
        }), Z();
      }
    }, {
      key: "remove",
      get: function get() {
        return this.$$.ctx[55];
      },
      set: function set(t) {
        this.$set({
          remove: t
        }), Z();
      }
    }, {
      key: "destroy",
      get: function get() {
        return this.$$.ctx[56];
      },
      set: function set(t) {
        this.$set({
          destroy: t
        }), Z();
      }
    }, {
      key: "getState",
      get: function get() {
        return this.$$.ctx[57];
      }
    }, {
      key: "getTimer",
      get: function get() {
        return this.$$.ctx[58];
      }
    }, {
      key: "getStyle",
      get: function get() {
        return this.$$.ctx[21];
      }
    }, {
      key: "getIcon",
      get: function get() {
        return this.$$.ctx[22];
      }
    }, {
      key: "open",
      get: function get() {
        return this.$$.ctx[59];
      },
      set: function set(t) {
        this.$set({
          open: t
        }), Z();
      }
    }, {
      key: "close",
      get: function get() {
        return this.$$.ctx[23];
      },
      set: function set(t) {
        this.$set({
          close: t
        }), Z();
      }
    }, {
      key: "animateIn",
      get: function get() {
        return this.$$.ctx[60];
      },
      set: function set(t) {
        this.$set({
          animateIn: t
        }), Z();
      }
    }, {
      key: "animateOut",
      get: function get() {
        return this.$$.ctx[61];
      },
      set: function set(t) {
        this.$set({
          animateOut: t
        }), Z();
      }
    }, {
      key: "cancelClose",
      get: function get() {
        return this.$$.ctx[62];
      }
    }, {
      key: "queueClose",
      get: function get() {
        return this.$$.ctx[63];
      }
    }, {
      key: "_preventTimerClose",
      get: function get() {
        return this.$$.ctx[64];
      }
    }, {
      key: "on",
      get: function get() {
        return this.$$.ctx[65];
      }
    }, {
      key: "update",
      get: function get() {
        return this.$$.ctx[66];
      }
    }, {
      key: "fire",
      get: function get() {
        return this.$$.ctx[67];
      }
    }, {
      key: "addModuleClass",
      get: function get() {
        return this.$$.ctx[68];
      }
    }, {
      key: "removeModuleClass",
      get: function get() {
        return this.$$.ctx[69];
      }
    }, {
      key: "hasModuleClass",
      get: function get() {
        return this.$$.ctx[70];
      }
    }, {
      key: "getModuleHandled",
      get: function get() {
        return this.$$.ctx[71];
      }
    }, {
      key: "setModuleHandled",
      get: function get() {
        return this.$$.ctx[72];
      }
    }, {
      key: "getModuleOpen",
      get: function get() {
        return this.$$.ctx[73];
      }
    }, {
      key: "setModuleOpen",
      get: function get() {
        return this.$$.ctx[74];
      }
    }, {
      key: "setAnimating",
      get: function get() {
        return this.$$.ctx[75];
      }
    }, {
      key: "getAnimatingClass",
      get: function get() {
        return this.$$.ctx[76];
      }
    }, {
      key: "setAnimatingClass",
      get: function get() {
        return this.$$.ctx[77];
      }
    }, {
      key: "_getMoveClass",
      get: function get() {
        return this.$$.ctx[78];
      }
    }, {
      key: "_setMoveClass",
      get: function get() {
        return this.$$.ctx[79];
      }
    }, {
      key: "_setMasking",
      get: function get() {
        return this.$$.ctx[80];
      }
    }]), s;
  }(vt);
  t.Stack = yt, t.alert = function (t) {
    return gt(Dt(t));
  }, t["default"] = Jt, t.defaultModules = Bt, t.defaultStack = qt, t.defaults = zt, t.error = function (t) {
    return gt(Dt(t, "error"));
  }, t.info = function (t) {
    return gt(Dt(t, "info"));
  }, t.notice = function (t) {
    return gt(Dt(t, "notice"));
  }, t.success = function (t) {
    return gt(Dt(t, "success"));
  }, Object.defineProperty(t, "__esModule", {
    value: !0
  });
});

/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js":
/*!******************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js ***!
  \******************************************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);
      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }
      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names

  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/magnific-popup/dist/jquery.magnific-popup.js":
/*!*******************************************************************!*\
  !*** ./node_modules/magnific-popup/dist/jquery.magnific-popup.js ***!
  \*******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;
(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module. 
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  /*>>core*/
  /**
   * 
   * Magnific Popup Core JS file
   * 
   */

  /**
   * Private static constants
   */
  var CLOSE_EVENT = 'Close',
    BEFORE_CLOSE_EVENT = 'BeforeClose',
    AFTER_CLOSE_EVENT = 'AfterClose',
    BEFORE_APPEND_EVENT = 'BeforeAppend',
    MARKUP_PARSE_EVENT = 'MarkupParse',
    OPEN_EVENT = 'Open',
    CHANGE_EVENT = 'Change',
    NS = 'mfp',
    EVENT_NS = '.' + NS,
    READY_CLASS = 'mfp-ready',
    REMOVING_CLASS = 'mfp-removing',
    PREVENT_CLOSE_CLASS = 'mfp-prevent-close';

  /**
   * Private vars 
   */
  /*jshint -W079 */
  var mfp,
    // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
    MagnificPopup = function MagnificPopup() {},
    _isJQ = !!window.jQuery,
    _prevStatus,
    _window = $(window),
    _document,
    _prevContentType,
    _wrapClasses,
    _currPopupType;

  /**
   * Private functions
   */
  var _mfpOn = function _mfpOn(name, f) {
      mfp.ev.on(NS + name + EVENT_NS, f);
    },
    _getEl = function _getEl(className, appendTo, html, raw) {
      var el = document.createElement('div');
      el.className = 'mfp-' + className;
      if (html) {
        el.innerHTML = html;
      }
      if (!raw) {
        el = $(el);
        if (appendTo) {
          el.appendTo(appendTo);
        }
      } else if (appendTo) {
        appendTo.appendChild(el);
      }
      return el;
    },
    _mfpTrigger = function _mfpTrigger(e, data) {
      mfp.ev.triggerHandler(NS + e, data);
      if (mfp.st.callbacks) {
        // converts "mfpEventName" to "eventName" callback and triggers it if it's present
        e = e.charAt(0).toLowerCase() + e.slice(1);
        if (mfp.st.callbacks[e]) {
          mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
        }
      }
    },
    _getCloseBtn = function _getCloseBtn(type) {
      if (type !== _currPopupType || !mfp.currTemplate.closeBtn) {
        mfp.currTemplate.closeBtn = $(mfp.st.closeMarkup.replace('%title%', mfp.st.tClose));
        _currPopupType = type;
      }
      return mfp.currTemplate.closeBtn;
    },
    // Initialize Magnific Popup only when called at least once
    _checkInstance = function _checkInstance() {
      if (!$.magnificPopup.instance) {
        /*jshint -W020 */
        mfp = new MagnificPopup();
        mfp.init();
        $.magnificPopup.instance = mfp;
      }
    },
    // CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
    supportsTransitions = function supportsTransitions() {
      var s = document.createElement('p').style,
        // 's' for style. better to create an element if body yet to exist
        v = ['ms', 'O', 'Moz', 'Webkit']; // 'v' for vendor

      if (s['transition'] !== undefined) {
        return true;
      }
      while (v.length) {
        if (v.pop() + 'Transition' in s) {
          return true;
        }
      }
      return false;
    };

  /**
   * Public functions
   */
  MagnificPopup.prototype = {
    constructor: MagnificPopup,
    /**
     * Initializes Magnific Popup plugin. 
     * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
     */
    init: function init() {
      var appVersion = navigator.appVersion;
      mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
      mfp.isAndroid = /android/gi.test(appVersion);
      mfp.isIOS = /iphone|ipad|ipod/gi.test(appVersion);
      mfp.supportsTransition = supportsTransitions();

      // We disable fixed positioned lightbox on devices that don't handle it nicely.
      // If you know a better way of detecting this - let me know.
      mfp.probablyMobile = mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent);
      _document = $(document);
      mfp.popupsCache = {};
    },
    /**
     * Opens popup
     * @param  data [description]
     */
    open: function open(data) {
      var i;
      if (data.isObj === false) {
        // convert jQuery collection to array to avoid conflicts later
        mfp.items = data.items.toArray();
        mfp.index = 0;
        var items = data.items,
          item;
        for (i = 0; i < items.length; i++) {
          item = items[i];
          if (item.parsed) {
            item = item.el[0];
          }
          if (item === data.el[0]) {
            mfp.index = i;
            break;
          }
        }
      } else {
        mfp.items = $.isArray(data.items) ? data.items : [data.items];
        mfp.index = data.index || 0;
      }

      // if popup is already opened - we just update the content
      if (mfp.isOpen) {
        mfp.updateItemHTML();
        return;
      }
      mfp.types = [];
      _wrapClasses = '';
      if (data.mainEl && data.mainEl.length) {
        mfp.ev = data.mainEl.eq(0);
      } else {
        mfp.ev = _document;
      }
      if (data.key) {
        if (!mfp.popupsCache[data.key]) {
          mfp.popupsCache[data.key] = {};
        }
        mfp.currTemplate = mfp.popupsCache[data.key];
      } else {
        mfp.currTemplate = {};
      }
      mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data);
      mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;
      if (mfp.st.modal) {
        mfp.st.closeOnContentClick = false;
        mfp.st.closeOnBgClick = false;
        mfp.st.showCloseBtn = false;
        mfp.st.enableEscapeKey = false;
      }

      // Building markup
      // main containers are created only once
      if (!mfp.bgOverlay) {
        // Dark overlay
        mfp.bgOverlay = _getEl('bg').on('click' + EVENT_NS, function () {
          mfp.close();
        });
        mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click' + EVENT_NS, function (e) {
          if (mfp._checkIfClose(e.target)) {
            mfp.close();
          }
        });
        mfp.container = _getEl('container', mfp.wrap);
      }
      mfp.contentContainer = _getEl('content');
      if (mfp.st.preloader) {
        mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
      }

      // Initializing modules
      var modules = $.magnificPopup.modules;
      for (i = 0; i < modules.length; i++) {
        var n = modules[i];
        n = n.charAt(0).toUpperCase() + n.slice(1);
        mfp['init' + n].call(mfp);
      }
      _mfpTrigger('BeforeOpen');
      if (mfp.st.showCloseBtn) {
        // Close button
        if (!mfp.st.closeBtnInside) {
          mfp.wrap.append(_getCloseBtn());
        } else {
          _mfpOn(MARKUP_PARSE_EVENT, function (e, template, values, item) {
            values.close_replaceWith = _getCloseBtn(item.type);
          });
          _wrapClasses += ' mfp-close-btn-in';
        }
      }
      if (mfp.st.alignTop) {
        _wrapClasses += ' mfp-align-top';
      }
      if (mfp.fixedContentPos) {
        mfp.wrap.css({
          overflow: mfp.st.overflowY,
          overflowX: 'hidden',
          overflowY: mfp.st.overflowY
        });
      } else {
        mfp.wrap.css({
          top: _window.scrollTop(),
          position: 'absolute'
        });
      }
      if (mfp.st.fixedBgPos === false || mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) {
        mfp.bgOverlay.css({
          height: _document.height(),
          position: 'absolute'
        });
      }
      if (mfp.st.enableEscapeKey) {
        // Close on ESC key
        _document.on('keyup' + EVENT_NS, function (e) {
          if (e.keyCode === 27) {
            mfp.close();
          }
        });
      }
      _window.on('resize' + EVENT_NS, function () {
        mfp.updateSize();
      });
      if (!mfp.st.closeOnContentClick) {
        _wrapClasses += ' mfp-auto-cursor';
      }
      if (_wrapClasses) mfp.wrap.addClass(_wrapClasses);

      // this triggers recalculation of layout, so we get it once to not to trigger twice
      var windowHeight = mfp.wH = _window.height();
      var windowStyles = {};
      if (mfp.fixedContentPos) {
        if (mfp._hasScrollBar(windowHeight)) {
          var s = mfp._getScrollbarSize();
          if (s) {
            windowStyles.marginRight = s;
          }
        }
      }
      if (mfp.fixedContentPos) {
        if (!mfp.isIE7) {
          windowStyles.overflow = 'hidden';
        } else {
          // ie7 double-scroll bug
          $('body, html').css('overflow', 'hidden');
        }
      }
      var classesToadd = mfp.st.mainClass;
      if (mfp.isIE7) {
        classesToadd += ' mfp-ie7';
      }
      if (classesToadd) {
        mfp._addClassToMFP(classesToadd);
      }

      // add content
      mfp.updateItemHTML();
      _mfpTrigger('BuildControls');

      // remove scrollbar, add margin e.t.c
      $('html').css(windowStyles);

      // add everything to DOM
      mfp.bgOverlay.add(mfp.wrap).prependTo(mfp.st.prependTo || $(document.body));

      // Save last focused element
      mfp._lastFocusedEl = document.activeElement;

      // Wait for next cycle to allow CSS transition
      setTimeout(function () {
        if (mfp.content) {
          mfp._addClassToMFP(READY_CLASS);
          mfp._setFocus();
        } else {
          // if content is not defined (not loaded e.t.c) we add class only for BG
          mfp.bgOverlay.addClass(READY_CLASS);
        }

        // Trap the focus in popup
        _document.on('focusin' + EVENT_NS, mfp._onFocusIn);
      }, 16);
      mfp.isOpen = true;
      mfp.updateSize(windowHeight);
      _mfpTrigger(OPEN_EVENT);
      return data;
    },
    /**
     * Closes the popup
     */
    close: function close() {
      if (!mfp.isOpen) return;
      _mfpTrigger(BEFORE_CLOSE_EVENT);
      mfp.isOpen = false;
      // for CSS3 animation
      if (mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition) {
        mfp._addClassToMFP(REMOVING_CLASS);
        setTimeout(function () {
          mfp._close();
        }, mfp.st.removalDelay);
      } else {
        mfp._close();
      }
    },
    /**
     * Helper for close() function
     */
    _close: function _close() {
      _mfpTrigger(CLOSE_EVENT);
      var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';
      mfp.bgOverlay.detach();
      mfp.wrap.detach();
      mfp.container.empty();
      if (mfp.st.mainClass) {
        classesToRemove += mfp.st.mainClass + ' ';
      }
      mfp._removeClassFromMFP(classesToRemove);
      if (mfp.fixedContentPos) {
        var windowStyles = {
          marginRight: ''
        };
        if (mfp.isIE7) {
          $('body, html').css('overflow', '');
        } else {
          windowStyles.overflow = '';
        }
        $('html').css(windowStyles);
      }
      _document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
      mfp.ev.off(EVENT_NS);

      // clean up DOM elements that aren't removed
      mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
      mfp.bgOverlay.attr('class', 'mfp-bg');
      mfp.container.attr('class', 'mfp-container');

      // remove close button from target element
      if (mfp.st.showCloseBtn && (!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
        if (mfp.currTemplate.closeBtn) mfp.currTemplate.closeBtn.detach();
      }
      if (mfp.st.autoFocusLast && mfp._lastFocusedEl) {
        $(mfp._lastFocusedEl).focus(); // put tab focus back
      }

      mfp.currItem = null;
      mfp.content = null;
      mfp.currTemplate = null;
      mfp.prevHeight = 0;
      _mfpTrigger(AFTER_CLOSE_EVENT);
    },
    updateSize: function updateSize(winHeight) {
      if (mfp.isIOS) {
        // fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
        var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
        var height = window.innerHeight * zoomLevel;
        mfp.wrap.css('height', height);
        mfp.wH = height;
      } else {
        mfp.wH = winHeight || _window.height();
      }
      // Fixes #84: popup incorrectly positioned with position:relative on body
      if (!mfp.fixedContentPos) {
        mfp.wrap.css('height', mfp.wH);
      }
      _mfpTrigger('Resize');
    },
    /**
     * Set content of popup based on current index
     */
    updateItemHTML: function updateItemHTML() {
      var item = mfp.items[mfp.index];

      // Detach and perform modifications
      mfp.contentContainer.detach();
      if (mfp.content) mfp.content.detach();
      if (!item.parsed) {
        item = mfp.parseEl(mfp.index);
      }
      var type = item.type;
      _mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
      // BeforeChange event works like so:
      // _mfpOn('BeforeChange', function(e, prevType, newType) { });

      mfp.currItem = item;
      if (!mfp.currTemplate[type]) {
        var markup = mfp.st[type] ? mfp.st[type].markup : false;

        // allows to modify markup
        _mfpTrigger('FirstMarkupParse', markup);
        if (markup) {
          mfp.currTemplate[type] = $(markup);
        } else {
          // if there is no markup found we just define that template is parsed
          mfp.currTemplate[type] = true;
        }
      }
      if (_prevContentType && _prevContentType !== item.type) {
        mfp.container.removeClass('mfp-' + _prevContentType + '-holder');
      }
      var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
      mfp.appendContent(newContent, type);
      item.preloaded = true;
      _mfpTrigger(CHANGE_EVENT, item);
      _prevContentType = item.type;

      // Append container back after its content changed
      mfp.container.prepend(mfp.contentContainer);
      _mfpTrigger('AfterChange');
    },
    /**
     * Set HTML content of popup
     */
    appendContent: function appendContent(newContent, type) {
      mfp.content = newContent;
      if (newContent) {
        if (mfp.st.showCloseBtn && mfp.st.closeBtnInside && mfp.currTemplate[type] === true) {
          // if there is no markup, we just append close button element inside
          if (!mfp.content.find('.mfp-close').length) {
            mfp.content.append(_getCloseBtn());
          }
        } else {
          mfp.content = newContent;
        }
      } else {
        mfp.content = '';
      }
      _mfpTrigger(BEFORE_APPEND_EVENT);
      mfp.container.addClass('mfp-' + type + '-holder');
      mfp.contentContainer.append(mfp.content);
    },
    /**
     * Creates Magnific Popup data object based on given data
     * @param  {int} index Index of item to parse
     */
    parseEl: function parseEl(index) {
      var item = mfp.items[index],
        type;
      if (item.tagName) {
        item = {
          el: $(item)
        };
      } else {
        type = item.type;
        item = {
          data: item,
          src: item.src
        };
      }
      if (item.el) {
        var types = mfp.types;

        // check for 'mfp-TYPE' class
        for (var i = 0; i < types.length; i++) {
          if (item.el.hasClass('mfp-' + types[i])) {
            type = types[i];
            break;
          }
        }
        item.src = item.el.attr('data-mfp-src');
        if (!item.src) {
          item.src = item.el.attr('href');
        }
      }
      item.type = type || mfp.st.type || 'inline';
      item.index = index;
      item.parsed = true;
      mfp.items[index] = item;
      _mfpTrigger('ElementParse', item);
      return mfp.items[index];
    },
    /**
     * Initializes single popup or a group of popups
     */
    addGroup: function addGroup(el, options) {
      var eHandler = function eHandler(e) {
        e.mfpEl = this;
        mfp._openClick(e, el, options);
      };
      if (!options) {
        options = {};
      }
      var eName = 'click.magnificPopup';
      options.mainEl = el;
      if (options.items) {
        options.isObj = true;
        el.off(eName).on(eName, eHandler);
      } else {
        options.isObj = false;
        if (options.delegate) {
          el.off(eName).on(eName, options.delegate, eHandler);
        } else {
          options.items = el;
          el.off(eName).on(eName, eHandler);
        }
      }
    },
    _openClick: function _openClick(e, el, options) {
      var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;
      if (!midClick && (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)) {
        return;
      }
      var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;
      if (disableOn) {
        if ($.isFunction(disableOn)) {
          if (!disableOn.call(mfp)) {
            return true;
          }
        } else {
          // else it's number
          if (_window.width() < disableOn) {
            return true;
          }
        }
      }
      if (e.type) {
        e.preventDefault();

        // This will prevent popup from closing if element is inside and popup is already opened
        if (mfp.isOpen) {
          e.stopPropagation();
        }
      }
      options.el = $(e.mfpEl);
      if (options.delegate) {
        options.items = el.find(options.delegate);
      }
      mfp.open(options);
    },
    /**
     * Updates text on preloader
     */
    updateStatus: function updateStatus(status, text) {
      if (mfp.preloader) {
        if (_prevStatus !== status) {
          mfp.container.removeClass('mfp-s-' + _prevStatus);
        }
        if (!text && status === 'loading') {
          text = mfp.st.tLoading;
        }
        var data = {
          status: status,
          text: text
        };
        // allows to modify status
        _mfpTrigger('UpdateStatus', data);
        status = data.status;
        text = data.text;
        mfp.preloader.html(text);
        mfp.preloader.find('a').on('click', function (e) {
          e.stopImmediatePropagation();
        });
        mfp.container.addClass('mfp-s-' + status);
        _prevStatus = status;
      }
    },
    /*
    	"Private" helpers that aren't private at all
     */
    // Check to close popup or not
    // "target" is an element that was clicked
    _checkIfClose: function _checkIfClose(target) {
      if ($(target).hasClass(PREVENT_CLOSE_CLASS)) {
        return;
      }
      var closeOnContent = mfp.st.closeOnContentClick;
      var closeOnBg = mfp.st.closeOnBgClick;
      if (closeOnContent && closeOnBg) {
        return true;
      } else {
        // We close the popup if click is on close button or on preloader. Or if there is no content.
        if (!mfp.content || $(target).hasClass('mfp-close') || mfp.preloader && target === mfp.preloader[0]) {
          return true;
        }

        // if click is outside the content
        if (target !== mfp.content[0] && !$.contains(mfp.content[0], target)) {
          if (closeOnBg) {
            // last check, if the clicked element is in DOM, (in case it's removed onclick)
            if ($.contains(document, target)) {
              return true;
            }
          }
        } else if (closeOnContent) {
          return true;
        }
      }
      return false;
    },
    _addClassToMFP: function _addClassToMFP(cName) {
      mfp.bgOverlay.addClass(cName);
      mfp.wrap.addClass(cName);
    },
    _removeClassFromMFP: function _removeClassFromMFP(cName) {
      this.bgOverlay.removeClass(cName);
      mfp.wrap.removeClass(cName);
    },
    _hasScrollBar: function _hasScrollBar(winHeight) {
      return (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height());
    },
    _setFocus: function _setFocus() {
      (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
    },
    _onFocusIn: function _onFocusIn(e) {
      if (e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target)) {
        mfp._setFocus();
        return false;
      }
    },
    _parseMarkup: function _parseMarkup(template, values, item) {
      var arr;
      if (item.data) {
        values = $.extend(item.data, values);
      }
      _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item]);
      $.each(values, function (key, value) {
        if (value === undefined || value === false) {
          return true;
        }
        arr = key.split('_');
        if (arr.length > 1) {
          var el = template.find(EVENT_NS + '-' + arr[0]);
          if (el.length > 0) {
            var attr = arr[1];
            if (attr === 'replaceWith') {
              if (el[0] !== value[0]) {
                el.replaceWith(value);
              }
            } else if (attr === 'img') {
              if (el.is('img')) {
                el.attr('src', value);
              } else {
                el.replaceWith($('<img>').attr('src', value).attr('class', el.attr('class')));
              }
            } else {
              el.attr(arr[1], value);
            }
          }
        } else {
          template.find(EVENT_NS + '-' + key).html(value);
        }
      });
    },
    _getScrollbarSize: function _getScrollbarSize() {
      // thx David
      if (mfp.scrollbarSize === undefined) {
        var scrollDiv = document.createElement("div");
        scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
      }
      return mfp.scrollbarSize;
    }
  }; /* MagnificPopup core prototype end */

  /**
   * Public static functions
   */
  $.magnificPopup = {
    instance: null,
    proto: MagnificPopup.prototype,
    modules: [],
    open: function open(options, index) {
      _checkInstance();
      if (!options) {
        options = {};
      } else {
        options = $.extend(true, {}, options);
      }
      options.isObj = true;
      options.index = index || 0;
      return this.instance.open(options);
    },
    close: function close() {
      return $.magnificPopup.instance && $.magnificPopup.instance.close();
    },
    registerModule: function registerModule(name, module) {
      if (module.options) {
        $.magnificPopup.defaults[name] = module.options;
      }
      $.extend(this.proto, module.proto);
      this.modules.push(name);
    },
    defaults: {
      // Info about options is in docs:
      // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

      disableOn: 0,
      key: null,
      midClick: false,
      mainClass: '',
      preloader: true,
      focus: '',
      // CSS selector of input to focus after popup is opened

      closeOnContentClick: false,
      closeOnBgClick: true,
      closeBtnInside: true,
      showCloseBtn: true,
      enableEscapeKey: true,
      modal: false,
      alignTop: false,
      removalDelay: 0,
      prependTo: null,
      fixedContentPos: 'auto',
      fixedBgPos: 'auto',
      overflowY: 'auto',
      closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
      tClose: 'Close (Esc)',
      tLoading: 'Loading...',
      autoFocusLast: true
    }
  };
  $.fn.magnificPopup = function (options) {
    _checkInstance();
    var jqEl = $(this);

    // We call some API method of first param is a string
    if (typeof options === "string") {
      if (options === 'open') {
        var items,
          itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
          index = parseInt(arguments[1], 10) || 0;
        if (itemOpts.items) {
          items = itemOpts.items[index];
        } else {
          items = jqEl;
          if (itemOpts.delegate) {
            items = items.find(itemOpts.delegate);
          }
          items = items.eq(index);
        }
        mfp._openClick({
          mfpEl: items
        }, jqEl, itemOpts);
      } else {
        if (mfp.isOpen) mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
      }
    } else {
      // clone options obj
      options = $.extend(true, {}, options);

      /*
       * As Zepto doesn't support .data() method for objects
       * and it works only in normal browsers
       * we assign "options" object directly to the DOM element. FTW!
       */
      if (_isJQ) {
        jqEl.data('magnificPopup', options);
      } else {
        jqEl[0].magnificPopup = options;
      }
      mfp.addGroup(jqEl, options);
    }
    return jqEl;
  };

  /*>>core*/

  /*>>inline*/

  var INLINE_NS = 'inline',
    _hiddenClass,
    _inlinePlaceholder,
    _lastInlineElement,
    _putInlineElementsBack = function _putInlineElementsBack() {
      if (_lastInlineElement) {
        _inlinePlaceholder.after(_lastInlineElement.addClass(_hiddenClass)).detach();
        _lastInlineElement = null;
      }
    };
  $.magnificPopup.registerModule(INLINE_NS, {
    options: {
      hiddenClass: 'hide',
      // will be appended with `mfp-` prefix
      markup: '',
      tNotFound: 'Content not found'
    },
    proto: {
      initInline: function initInline() {
        mfp.types.push(INLINE_NS);
        _mfpOn(CLOSE_EVENT + '.' + INLINE_NS, function () {
          _putInlineElementsBack();
        });
      },
      getInline: function getInline(item, template) {
        _putInlineElementsBack();
        if (item.src) {
          var inlineSt = mfp.st.inline,
            el = $(item.src);
          if (el.length) {
            // If target element has parent - we replace it with placeholder and put it back after popup is closed
            var parent = el[0].parentNode;
            if (parent && parent.tagName) {
              if (!_inlinePlaceholder) {
                _hiddenClass = inlineSt.hiddenClass;
                _inlinePlaceholder = _getEl(_hiddenClass);
                _hiddenClass = 'mfp-' + _hiddenClass;
              }
              // replace target inline element with placeholder
              _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
            }
            mfp.updateStatus('ready');
          } else {
            mfp.updateStatus('error', inlineSt.tNotFound);
            el = $('<div>');
          }
          item.inlineElement = el;
          return el;
        }
        mfp.updateStatus('ready');
        mfp._parseMarkup(template, {}, item);
        return template;
      }
    }
  });

  /*>>inline*/

  /*>>ajax*/
  var AJAX_NS = 'ajax',
    _ajaxCur,
    _removeAjaxCursor = function _removeAjaxCursor() {
      if (_ajaxCur) {
        $(document.body).removeClass(_ajaxCur);
      }
    },
    _destroyAjaxRequest = function _destroyAjaxRequest() {
      _removeAjaxCursor();
      if (mfp.req) {
        mfp.req.abort();
      }
    };
  $.magnificPopup.registerModule(AJAX_NS, {
    options: {
      settings: null,
      cursor: 'mfp-ajax-cur',
      tError: '<a href="%url%">The content</a> could not be loaded.'
    },
    proto: {
      initAjax: function initAjax() {
        mfp.types.push(AJAX_NS);
        _ajaxCur = mfp.st.ajax.cursor;
        _mfpOn(CLOSE_EVENT + '.' + AJAX_NS, _destroyAjaxRequest);
        _mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
      },
      getAjax: function getAjax(item) {
        if (_ajaxCur) {
          $(document.body).addClass(_ajaxCur);
        }
        mfp.updateStatus('loading');
        var opts = $.extend({
          url: item.src,
          success: function success(data, textStatus, jqXHR) {
            var temp = {
              data: data,
              xhr: jqXHR
            };
            _mfpTrigger('ParseAjax', temp);
            mfp.appendContent($(temp.data), AJAX_NS);
            item.finished = true;
            _removeAjaxCursor();
            mfp._setFocus();
            setTimeout(function () {
              mfp.wrap.addClass(READY_CLASS);
            }, 16);
            mfp.updateStatus('ready');
            _mfpTrigger('AjaxContentAdded');
          },
          error: function error() {
            _removeAjaxCursor();
            item.finished = item.loadError = true;
            mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
          }
        }, mfp.st.ajax.settings);
        mfp.req = $.ajax(opts);
        return '';
      }
    }
  });

  /*>>ajax*/

  /*>>image*/
  var _imgInterval,
    _getTitle = function _getTitle(item) {
      if (item.data && item.data.title !== undefined) return item.data.title;
      var src = mfp.st.image.titleSrc;
      if (src) {
        if ($.isFunction(src)) {
          return src.call(mfp, item);
        } else if (item.el) {
          return item.el.attr(src) || '';
        }
      }
      return '';
    };
  $.magnificPopup.registerModule('image', {
    options: {
      markup: '<div class="mfp-figure">' + '<div class="mfp-close"></div>' + '<figure>' + '<div class="mfp-img"></div>' + '<figcaption>' + '<div class="mfp-bottom-bar">' + '<div class="mfp-title"></div>' + '<div class="mfp-counter"></div>' + '</div>' + '</figcaption>' + '</figure>' + '</div>',
      cursor: 'mfp-zoom-out-cur',
      titleSrc: 'title',
      verticalFit: true,
      tError: '<a href="%url%">The image</a> could not be loaded.'
    },
    proto: {
      initImage: function initImage() {
        var imgSt = mfp.st.image,
          ns = '.image';
        mfp.types.push('image');
        _mfpOn(OPEN_EVENT + ns, function () {
          if (mfp.currItem.type === 'image' && imgSt.cursor) {
            $(document.body).addClass(imgSt.cursor);
          }
        });
        _mfpOn(CLOSE_EVENT + ns, function () {
          if (imgSt.cursor) {
            $(document.body).removeClass(imgSt.cursor);
          }
          _window.off('resize' + EVENT_NS);
        });
        _mfpOn('Resize' + ns, mfp.resizeImage);
        if (mfp.isLowIE) {
          _mfpOn('AfterChange', mfp.resizeImage);
        }
      },
      resizeImage: function resizeImage() {
        var item = mfp.currItem;
        if (!item || !item.img) return;
        if (mfp.st.image.verticalFit) {
          var decr = 0;
          // fix box-sizing in ie7/8
          if (mfp.isLowIE) {
            decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'), 10);
          }
          item.img.css('max-height', mfp.wH - decr);
        }
      },
      _onImageHasSize: function _onImageHasSize(item) {
        if (item.img) {
          item.hasSize = true;
          if (_imgInterval) {
            clearInterval(_imgInterval);
          }
          item.isCheckingImgSize = false;
          _mfpTrigger('ImageHasSize', item);
          if (item.imgHidden) {
            if (mfp.content) mfp.content.removeClass('mfp-loading');
            item.imgHidden = false;
          }
        }
      },
      /**
       * Function that loops until the image has size to display elements that rely on it asap
       */
      findImageSize: function findImageSize(item) {
        var counter = 0,
          img = item.img[0],
          mfpSetInterval = function mfpSetInterval(delay) {
            if (_imgInterval) {
              clearInterval(_imgInterval);
            }
            // decelerating interval that checks for size of an image
            _imgInterval = setInterval(function () {
              if (img.naturalWidth > 0) {
                mfp._onImageHasSize(item);
                return;
              }
              if (counter > 200) {
                clearInterval(_imgInterval);
              }
              counter++;
              if (counter === 3) {
                mfpSetInterval(10);
              } else if (counter === 40) {
                mfpSetInterval(50);
              } else if (counter === 100) {
                mfpSetInterval(500);
              }
            }, delay);
          };
        mfpSetInterval(1);
      },
      getImage: function getImage(item, template) {
        var guard = 0,
          // image load complete handler
          onLoadComplete = function onLoadComplete() {
            if (item) {
              if (item.img[0].complete) {
                item.img.off('.mfploader');
                if (item === mfp.currItem) {
                  mfp._onImageHasSize(item);
                  mfp.updateStatus('ready');
                }
                item.hasSize = true;
                item.loaded = true;
                _mfpTrigger('ImageLoadComplete');
              } else {
                // if image complete check fails 200 times (20 sec), we assume that there was an error.
                guard++;
                if (guard < 200) {
                  setTimeout(onLoadComplete, 100);
                } else {
                  onLoadError();
                }
              }
            }
          },
          // image error handler
          onLoadError = function onLoadError() {
            if (item) {
              item.img.off('.mfploader');
              if (item === mfp.currItem) {
                mfp._onImageHasSize(item);
                mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
              }
              item.hasSize = true;
              item.loaded = true;
              item.loadError = true;
            }
          },
          imgSt = mfp.st.image;
        var el = template.find('.mfp-img');
        if (el.length) {
          var img = document.createElement('img');
          img.className = 'mfp-img';
          if (item.el && item.el.find('img').length) {
            img.alt = item.el.find('img').attr('alt');
          }
          item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
          img.src = item.src;

          // without clone() "error" event is not firing when IMG is replaced by new IMG
          // TODO: find a way to avoid such cloning
          if (el.is('img')) {
            item.img = item.img.clone();
          }
          img = item.img[0];
          if (img.naturalWidth > 0) {
            item.hasSize = true;
          } else if (!img.width) {
            item.hasSize = false;
          }
        }
        mfp._parseMarkup(template, {
          title: _getTitle(item),
          img_replaceWith: item.img
        }, item);
        mfp.resizeImage();
        if (item.hasSize) {
          if (_imgInterval) clearInterval(_imgInterval);
          if (item.loadError) {
            template.addClass('mfp-loading');
            mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
          } else {
            template.removeClass('mfp-loading');
            mfp.updateStatus('ready');
          }
          return template;
        }
        mfp.updateStatus('loading');
        item.loading = true;
        if (!item.hasSize) {
          item.imgHidden = true;
          template.addClass('mfp-loading');
          mfp.findImageSize(item);
        }
        return template;
      }
    }
  });

  /*>>image*/

  /*>>zoom*/
  var hasMozTransform,
    getHasMozTransform = function getHasMozTransform() {
      if (hasMozTransform === undefined) {
        hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
      }
      return hasMozTransform;
    };
  $.magnificPopup.registerModule('zoom', {
    options: {
      enabled: false,
      easing: 'ease-in-out',
      duration: 300,
      opener: function opener(element) {
        return element.is('img') ? element : element.find('img');
      }
    },
    proto: {
      initZoom: function initZoom() {
        var zoomSt = mfp.st.zoom,
          ns = '.zoom',
          image;
        if (!zoomSt.enabled || !mfp.supportsTransition) {
          return;
        }
        var duration = zoomSt.duration,
          getElToAnimate = function getElToAnimate(image) {
            var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
              transition = 'all ' + zoomSt.duration / 1000 + 's ' + zoomSt.easing,
              cssObj = {
                position: 'fixed',
                zIndex: 9999,
                left: 0,
                top: 0,
                '-webkit-backface-visibility': 'hidden'
              },
              t = 'transition';
            cssObj['-webkit-' + t] = cssObj['-moz-' + t] = cssObj['-o-' + t] = cssObj[t] = transition;
            newImg.css(cssObj);
            return newImg;
          },
          showMainContent = function showMainContent() {
            mfp.content.css('visibility', 'visible');
          },
          openTimeout,
          animatedImg;
        _mfpOn('BuildControls' + ns, function () {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout);
            mfp.content.css('visibility', 'hidden');

            // Basically, all code below does is clones existing image, puts in on top of the current one and animated it

            image = mfp._getItemToZoom();
            if (!image) {
              showMainContent();
              return;
            }
            animatedImg = getElToAnimate(image);
            animatedImg.css(mfp._getOffset());
            mfp.wrap.append(animatedImg);
            openTimeout = setTimeout(function () {
              animatedImg.css(mfp._getOffset(true));
              openTimeout = setTimeout(function () {
                showMainContent();
                setTimeout(function () {
                  animatedImg.remove();
                  image = animatedImg = null;
                  _mfpTrigger('ZoomAnimationEnded');
                }, 16); // avoid blink when switching images
              }, duration); // this timeout equals animation duration
            }, 16); // by adding this timeout we avoid short glitch at the beginning of animation

            // Lots of timeouts...
          }
        });

        _mfpOn(BEFORE_CLOSE_EVENT + ns, function () {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout);
            mfp.st.removalDelay = duration;
            if (!image) {
              image = mfp._getItemToZoom();
              if (!image) {
                return;
              }
              animatedImg = getElToAnimate(image);
            }
            animatedImg.css(mfp._getOffset(true));
            mfp.wrap.append(animatedImg);
            mfp.content.css('visibility', 'hidden');
            setTimeout(function () {
              animatedImg.css(mfp._getOffset());
            }, 16);
          }
        });
        _mfpOn(CLOSE_EVENT + ns, function () {
          if (mfp._allowZoom()) {
            showMainContent();
            if (animatedImg) {
              animatedImg.remove();
            }
            image = null;
          }
        });
      },
      _allowZoom: function _allowZoom() {
        return mfp.currItem.type === 'image';
      },
      _getItemToZoom: function _getItemToZoom() {
        if (mfp.currItem.hasSize) {
          return mfp.currItem.img;
        } else {
          return false;
        }
      },
      // Get element postion relative to viewport
      _getOffset: function _getOffset(isLarge) {
        var el;
        if (isLarge) {
          el = mfp.currItem.img;
        } else {
          el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
        }
        var offset = el.offset();
        var paddingTop = parseInt(el.css('padding-top'), 10);
        var paddingBottom = parseInt(el.css('padding-bottom'), 10);
        offset.top -= $(window).scrollTop() - paddingTop;

        /*
        	Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.
        	 */
        var obj = {
          width: el.width(),
          // fix Zepto height+padding issue
          height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
        };

        // I hate to do this, but there is no another option
        if (getHasMozTransform()) {
          obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
        } else {
          obj.left = offset.left;
          obj.top = offset.top;
        }
        return obj;
      }
    }
  });

  /*>>zoom*/

  /*>>iframe*/

  var IFRAME_NS = 'iframe',
    _emptyPage = '//about:blank',
    _fixIframeBugs = function _fixIframeBugs(isShowing) {
      if (mfp.currTemplate[IFRAME_NS]) {
        var el = mfp.currTemplate[IFRAME_NS].find('iframe');
        if (el.length) {
          // reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
          if (!isShowing) {
            el[0].src = _emptyPage;
          }

          // IE8 black screen bug fix
          if (mfp.isIE8) {
            el.css('display', isShowing ? 'block' : 'none');
          }
        }
      }
    };
  $.magnificPopup.registerModule(IFRAME_NS, {
    options: {
      markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>' + '</div>',
      srcAction: 'iframe_src',
      // we don't care and support only one default type of URL by default
      patterns: {
        youtube: {
          index: 'youtube.com',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1'
        },
        vimeo: {
          index: 'vimeo.com/',
          id: '/',
          src: '//player.vimeo.com/video/%id%?autoplay=1'
        },
        gmaps: {
          index: '//maps.google.',
          src: '%id%&output=embed'
        }
      }
    },
    proto: {
      initIframe: function initIframe() {
        mfp.types.push(IFRAME_NS);
        _mfpOn('BeforeChange', function (e, prevType, newType) {
          if (prevType !== newType) {
            if (prevType === IFRAME_NS) {
              _fixIframeBugs(); // iframe if removed
            } else if (newType === IFRAME_NS) {
              _fixIframeBugs(true); // iframe is showing
            }
          } // else {
          // iframe source is switched, don't do anything
          //}
        });

        _mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function () {
          _fixIframeBugs();
        });
      },
      getIframe: function getIframe(item, template) {
        var embedSrc = item.src;
        var iframeSt = mfp.st.iframe;
        $.each(iframeSt.patterns, function () {
          if (embedSrc.indexOf(this.index) > -1) {
            if (this.id) {
              if (typeof this.id === 'string') {
                embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id) + this.id.length, embedSrc.length);
              } else {
                embedSrc = this.id.call(this, embedSrc);
              }
            }
            embedSrc = this.src.replace('%id%', embedSrc);
            return false; // break;
          }
        });

        var dataObj = {};
        if (iframeSt.srcAction) {
          dataObj[iframeSt.srcAction] = embedSrc;
        }
        mfp._parseMarkup(template, dataObj, item);
        mfp.updateStatus('ready');
        return template;
      }
    }
  });

  /*>>iframe*/

  /*>>gallery*/
  /**
   * Get looped index depending on number of slides
   */
  var _getLoopedId = function _getLoopedId(index) {
      var numSlides = mfp.items.length;
      if (index > numSlides - 1) {
        return index - numSlides;
      } else if (index < 0) {
        return numSlides + index;
      }
      return index;
    },
    _replaceCurrTotal = function _replaceCurrTotal(text, curr, total) {
      return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
    };
  $.magnificPopup.registerModule('gallery', {
    options: {
      enabled: false,
      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
      preload: [0, 2],
      navigateByImgClick: true,
      arrows: true,
      tPrev: 'Previous (Left arrow key)',
      tNext: 'Next (Right arrow key)',
      tCounter: '%curr% of %total%'
    },
    proto: {
      initGallery: function initGallery() {
        var gSt = mfp.st.gallery,
          ns = '.mfp-gallery';
        mfp.direction = true; // true - next, false - prev

        if (!gSt || !gSt.enabled) return false;
        _wrapClasses += ' mfp-gallery';
        _mfpOn(OPEN_EVENT + ns, function () {
          if (gSt.navigateByImgClick) {
            mfp.wrap.on('click' + ns, '.mfp-img', function () {
              if (mfp.items.length > 1) {
                mfp.next();
                return false;
              }
            });
          }
          _document.on('keydown' + ns, function (e) {
            if (e.keyCode === 37) {
              mfp.prev();
            } else if (e.keyCode === 39) {
              mfp.next();
            }
          });
        });
        _mfpOn('UpdateStatus' + ns, function (e, data) {
          if (data.text) {
            data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
          }
        });
        _mfpOn(MARKUP_PARSE_EVENT + ns, function (e, element, values, item) {
          var l = mfp.items.length;
          values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
        });
        _mfpOn('BuildControls' + ns, function () {
          if (mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
            var markup = gSt.arrowMarkup,
              arrowLeft = mfp.arrowLeft = $(markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left')).addClass(PREVENT_CLOSE_CLASS),
              arrowRight = mfp.arrowRight = $(markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right')).addClass(PREVENT_CLOSE_CLASS);
            arrowLeft.click(function () {
              mfp.prev();
            });
            arrowRight.click(function () {
              mfp.next();
            });
            mfp.container.append(arrowLeft.add(arrowRight));
          }
        });
        _mfpOn(CHANGE_EVENT + ns, function () {
          if (mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);
          mfp._preloadTimeout = setTimeout(function () {
            mfp.preloadNearbyImages();
            mfp._preloadTimeout = null;
          }, 16);
        });
        _mfpOn(CLOSE_EVENT + ns, function () {
          _document.off(ns);
          mfp.wrap.off('click' + ns);
          mfp.arrowRight = mfp.arrowLeft = null;
        });
      },
      next: function next() {
        mfp.direction = true;
        mfp.index = _getLoopedId(mfp.index + 1);
        mfp.updateItemHTML();
      },
      prev: function prev() {
        mfp.direction = false;
        mfp.index = _getLoopedId(mfp.index - 1);
        mfp.updateItemHTML();
      },
      goTo: function goTo(newIndex) {
        mfp.direction = newIndex >= mfp.index;
        mfp.index = newIndex;
        mfp.updateItemHTML();
      },
      preloadNearbyImages: function preloadNearbyImages() {
        var p = mfp.st.gallery.preload,
          preloadBefore = Math.min(p[0], mfp.items.length),
          preloadAfter = Math.min(p[1], mfp.items.length),
          i;
        for (i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
          mfp._preloadItem(mfp.index + i);
        }
        for (i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
          mfp._preloadItem(mfp.index - i);
        }
      },
      _preloadItem: function _preloadItem(index) {
        index = _getLoopedId(index);
        if (mfp.items[index].preloaded) {
          return;
        }
        var item = mfp.items[index];
        if (!item.parsed) {
          item = mfp.parseEl(index);
        }
        _mfpTrigger('LazyLoad', item);
        if (item.type === 'image') {
          item.img = $('<img class="mfp-img" />').on('load.mfploader', function () {
            item.hasSize = true;
          }).on('error.mfploader', function () {
            item.hasSize = true;
            item.loadError = true;
            _mfpTrigger('LazyLoadError', item);
          }).attr('src', item.src);
        }
        item.preloaded = true;
      }
    }
  });

  /*>>gallery*/

  /*>>retina*/

  var RETINA_NS = 'retina';
  $.magnificPopup.registerModule(RETINA_NS, {
    options: {
      replaceSrc: function replaceSrc(item) {
        return item.src.replace(/\.\w+$/, function (m) {
          return '@2x' + m;
        });
      },
      ratio: 1 // Function or number.  Set to 1 to disable.
    },

    proto: {
      initRetina: function initRetina() {
        if (window.devicePixelRatio > 1) {
          var st = mfp.st.retina,
            ratio = st.ratio;
          ratio = !isNaN(ratio) ? ratio : ratio();
          if (ratio > 1) {
            _mfpOn('ImageHasSize' + '.' + RETINA_NS, function (e, item) {
              item.img.css({
                'max-width': item.img[0].naturalWidth / ratio,
                'width': '100%'
              });
            });
            _mfpOn('ElementParse' + '.' + RETINA_NS, function (e, item) {
              item.src = st.replaceSrc(item, ratio);
            });
          }
        }
      }
    }
  });

  /*>>retina*/
  _checkInstance();
});

/***/ }),

/***/ "./node_modules/tom-select/dist/js/tom-select.complete.js":
/*!****************************************************************!*\
  !*** ./node_modules/tom-select/dist/js/tom-select.complete.js ***!
  \****************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
* Tom Select v2.2.2
* Licensed under the Apache License, Version 2.0 (the "License");
*/

(function (global, factory) {
  ( false ? 0 : _typeof(exports)) === 'object' && "object" !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (0);
})(this, function () {
  'use strict';

  /**
   * MicroEvent - to make any js object an event emitter
   *
   * - pure javascript - server compatible, browser compatible
   * - dont rely on the browser doms
   * - super simple - you get it immediatly, no mistery, no magic involved
   *
   * @author Jerome Etienne (https://github.com/jeromeetienne)
   */

  /**
   * Execute callback for each event in space separated list of event names
   *
   */
  var _marked = /*#__PURE__*/_regeneratorRuntime().mark(generator);
  function forEvents(events, callback) {
    events.split(/\s+/).forEach(function (event) {
      callback(event);
    });
  }
  var MicroEvent = /*#__PURE__*/function () {
    function MicroEvent() {
      _classCallCheck(this, MicroEvent);
      this._events = void 0;
      this._events = {};
    }
    _createClass(MicroEvent, [{
      key: "on",
      value: function on(events, fct) {
        var _this = this;
        forEvents(events, function (event) {
          var event_array = _this._events[event] || [];
          event_array.push(fct);
          _this._events[event] = event_array;
        });
      }
    }, {
      key: "off",
      value: function off(events, fct) {
        var _this2 = this;
        var n = arguments.length;
        if (n === 0) {
          this._events = {};
          return;
        }
        forEvents(events, function (event) {
          if (n === 1) {
            delete _this2._events[event];
            return;
          }
          var event_array = _this2._events[event];
          if (event_array === undefined) return;
          event_array.splice(event_array.indexOf(fct), 1);
          _this2._events[event] = event_array;
        });
      }
    }, {
      key: "trigger",
      value: function trigger(events) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var self = this;
        forEvents(events, function (event) {
          var event_array = self._events[event];
          if (event_array === undefined) return;
          event_array.forEach(function (fct) {
            fct.apply(self, args);
          });
        });
      }
    }]);
    return MicroEvent;
  }();
  /**
   * microplugin.js
   * Copyright (c) 2013 Brian Reavis & contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   * @author Brian Reavis <brian@thirdroute.com>
   */
  function MicroPlugin(Interface) {
    Interface.plugins = {};
    return /*#__PURE__*/function (_Interface) {
      _inherits(_class, _Interface);
      var _super = _createSuper(_class);
      function _class() {
        var _this3;
        _classCallCheck(this, _class);
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        _this3 = _super.call.apply(_super, [this].concat(args));
        _this3.plugins = {
          names: [],
          settings: {},
          requested: {},
          loaded: {}
        };
        return _this3;
      }

      /**
       * Registers a plugin.
       *
       * @param {function} fn
       */
      _createClass(_class, [{
        key: "initializePlugins",
        value:
        /**
         * Initializes the listed plugins (with options).
         * Acceptable formats:
         *
         * List (without options):
         *   ['a', 'b', 'c']
         *
         * List (with options):
         *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
         *
         * Hash (with options):
         *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
         *
         * @param {array|object} plugins
         */

        function initializePlugins(plugins) {
          var key, name;
          var self = this;
          var queue = [];
          if (Array.isArray(plugins)) {
            plugins.forEach(function (plugin) {
              if (typeof plugin === 'string') {
                queue.push(plugin);
              } else {
                self.plugins.settings[plugin.name] = plugin.options;
                queue.push(plugin.name);
              }
            });
          } else if (plugins) {
            for (key in plugins) {
              if (plugins.hasOwnProperty(key)) {
                self.plugins.settings[key] = plugins[key];
                queue.push(key);
              }
            }
          }
          while (name = queue.shift()) {
            self.require(name);
          }
        }
      }, {
        key: "loadPlugin",
        value: function loadPlugin(name) {
          var self = this;
          var plugins = self.plugins;
          var plugin = Interface.plugins[name];
          if (!Interface.plugins.hasOwnProperty(name)) {
            throw new Error('Unable to find "' + name + '" plugin');
          }
          plugins.requested[name] = true;
          plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
          plugins.names.push(name);
        }
        /**
         * Initializes a plugin.
         *
         */
      }, {
        key: "require",
        value: function require(name) {
          var self = this;
          var plugins = self.plugins;
          if (!self.plugins.loaded.hasOwnProperty(name)) {
            if (plugins.requested[name]) {
              throw new Error('Plugin has circular dependency ("' + name + '")');
            }
            self.loadPlugin(name);
          }
          return plugins.loaded[name];
        }
      }], [{
        key: "define",
        value: function define(name, fn) {
          Interface.plugins[name] = {
            'name': name,
            'fn': fn
          };
        }
      }]);
      return _class;
    }(Interface);
  }

  /*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */
  /**
   * Convert array of strings to a regular expression
   *	ex ['ab','a'] => (?:ab|a)
   * 	ex ['a','b'] => [ab]
   * @param {string[]} chars
   * @return {string}
   */
  var arrayToPattern = function arrayToPattern(chars) {
    chars = chars.filter(Boolean);
    if (chars.length < 2) {
      return chars[0] || '';
    }
    return maxValueLength(chars) == 1 ? '[' + chars.join('') + ']' : '(?:' + chars.join('|') + ')';
  };
  /**
   * @param {string[]} array
   * @return {string}
   */

  var sequencePattern = function sequencePattern(array) {
    if (!hasDuplicates(array)) {
      return array.join('');
    }
    var pattern = '';
    var prev_char_count = 0;
    var prev_pattern = function prev_pattern() {
      if (prev_char_count > 1) {
        pattern += '{' + prev_char_count + '}';
      }
    };
    array.forEach(function (_char, i) {
      if (_char === array[i - 1]) {
        prev_char_count++;
        return;
      }
      prev_pattern();
      pattern += _char;
      prev_char_count = 1;
    });
    prev_pattern();
    return pattern;
  };
  /**
   * Convert array of strings to a regular expression
   *	ex ['ab','a'] => (?:ab|a)
   * 	ex ['a','b'] => [ab]
   * @param {Set<string>} chars
   * @return {string}
   */

  var setToPattern = function setToPattern(chars) {
    var array = toArray(chars);
    return arrayToPattern(array);
  };
  /**
   *
   * https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
   * @param {any[]} array
   */

  var hasDuplicates = function hasDuplicates(array) {
    return new Set(array).size !== array.length;
  };
  /**
   * https://stackoverflow.com/questions/63006601/why-does-u-throw-an-invalid-escape-error
   * @param {string} str
   * @return {string}
   */

  var escape_regex = function escape_regex(str) {
    return (str + '').replace(/([\$\(-\+\.\?\[-\^\{-\}])/g, '\\$1');
  };
  /**
   * Return the max length of array values
   * @param {string[]} array
   *
   */

  var maxValueLength = function maxValueLength(array) {
    return array.reduce(function (longest, value) {
      return Math.max(longest, unicodeLength(value));
    }, 0);
  };
  /**
   * @param {string} str
   */

  var unicodeLength = function unicodeLength(str) {
    return toArray(str).length;
  };
  /**
   * @param {any} p
   * @return {any[]}
   */

  var toArray = function toArray(p) {
    return Array.from(p);
  };

  /*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */
  /**
   * Get all possible combinations of substrings that add up to the given string
   * https://stackoverflow.com/questions/30169587/find-all-the-combination-of-substrings-that-add-up-to-the-given-string
   * @param {string} input
   * @return {string[][]}
   */
  var allSubstrings = function allSubstrings(input) {
    if (input.length === 1) return [[input]];
    /** @type {string[][]} */

    var result = [];
    var start = input.substring(1);
    var suba = allSubstrings(start);
    suba.forEach(function (subresult) {
      var tmp = subresult.slice(0);
      tmp[0] = input.charAt(0) + tmp[0];
      result.push(tmp);
      tmp = subresult.slice(0);
      tmp.unshift(input.charAt(0));
      result.push(tmp);
    });
    return result;
  };

  /*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */

  /**
   * @typedef {{[key:string]:string}} TUnicodeMap
   * @typedef {{[key:string]:Set<string>}} TUnicodeSets
   * @typedef {[[number,number]]} TCodePoints
   * @typedef {{folded:string,composed:string,code_point:number}} TCodePointObj
   * @typedef {{start:number,end:number,length:number,substr:string}} TSequencePart
   */
  /** @type {TCodePoints} */

  var code_points = [[0, 65535]];
  var accent_pat = "[\u0300-\u036F\xB7\u02BE\u02BC]";
  /** @type {TUnicodeMap} */

  var unicode_map;
  /** @type {RegExp} */

  var multi_char_reg;
  var max_char_length = 3;
  /** @type {TUnicodeMap} */

  var latin_convert = {};
  /** @type {TUnicodeMap} */

  var latin_condensed = {
    '/': '⁄∕',
    '0': '߀',
    "a": "ⱥɐɑ",
    "aa": "ꜳ",
    "ae": "æǽǣ",
    "ao": "ꜵ",
    "au": "ꜷ",
    "av": "ꜹꜻ",
    "ay": "ꜽ",
    "b": "ƀɓƃ",
    "c": "ꜿƈȼↄ",
    "d": "đɗɖᴅƌꮷԁɦ",
    "e": "ɛǝᴇɇ",
    "f": "ꝼƒ",
    "g": "ǥɠꞡᵹꝿɢ",
    "h": "ħⱨⱶɥ",
    "i": "ɨı",
    "j": "ɉȷ",
    "k": "ƙⱪꝁꝃꝅꞣ",
    "l": "łƚɫⱡꝉꝇꞁɭ",
    "m": "ɱɯϻ",
    "n": "ꞥƞɲꞑᴎлԉ",
    "o": "øǿɔɵꝋꝍᴑ",
    "oe": "œ",
    "oi": "ƣ",
    "oo": "ꝏ",
    "ou": "ȣ",
    "p": "ƥᵽꝑꝓꝕρ",
    "q": "ꝗꝙɋ",
    "r": "ɍɽꝛꞧꞃ",
    "s": "ßȿꞩꞅʂ",
    "t": "ŧƭʈⱦꞇ",
    "th": "þ",
    "tz": "ꜩ",
    "u": "ʉ",
    "v": "ʋꝟʌ",
    "vy": "ꝡ",
    "w": "ⱳ",
    "y": "ƴɏỿ",
    "z": "ƶȥɀⱬꝣ",
    "hv": "ƕ"
  };
  for (var latin in latin_condensed) {
    var unicode = latin_condensed[latin] || '';
    for (var i = 0; i < unicode.length; i++) {
      var _char2 = unicode.substring(i, i + 1);
      latin_convert[_char2] = latin;
    }
  }
  var convert_pat = new RegExp(Object.keys(latin_convert).join('|') + '|' + accent_pat, 'gu');
  /**
   * Initialize the unicode_map from the give code point ranges
   *
   * @param {TCodePoints=} _code_points
   */

  var initialize = function initialize(_code_points) {
    if (unicode_map !== undefined) return;
    unicode_map = generateMap(_code_points || code_points);
  };
  /**
   * Helper method for normalize a string
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
   * @param {string} str
   * @param {string} form
   */

  var normalize = function normalize(str) {
    var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'NFKD';
    return str.normalize(form);
  };
  /**
   * Remove accents without reordering string
   * calling str.normalize('NFKD') on \u{594}\u{595}\u{596} becomes \u{596}\u{594}\u{595}
   * via https://github.com/krisk/Fuse/issues/133#issuecomment-318692703
   * @param {string} str
   * @return {string}
   */

  var asciifold = function asciifold(str) {
    return toArray(str).reduce(
    /**
     * @param {string} result
     * @param {string} char
     */
    function (result, _char3) {
      return result + _asciifold(_char3);
    }, '');
  };
  /**
   * @param {string} str
   * @return {string}
   */

  var _asciifold = function _asciifold(str) {
    str = normalize(str).toLowerCase().replace(convert_pat, function ( /** @type {string} */
    _char4) {
      return latin_convert[_char4] || '';
    }); //return str;

    return normalize(str, 'NFC');
  };
  /**
   * Generate a list of unicode variants from the list of code points
   * @param {TCodePoints} code_points
   * @yield {TCodePointObj}
   */

  function generator(code_points) {
    var _iterator, _step, _step$value, code_point_min, code_point_max, _i2, composed, folded;
    return _regeneratorRuntime().wrap(function generator$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _iterator = _createForOfIteratorHelper(code_points);
          _context.prev = 1;
          _iterator.s();
        case 3:
          if ((_step = _iterator.n()).done) {
            _context.next = 22;
            break;
          }
          _step$value = _slicedToArray(_step.value, 2), code_point_min = _step$value[0], code_point_max = _step$value[1];
          _i2 = code_point_min;
        case 6:
          if (!(_i2 <= code_point_max)) {
            _context.next = 20;
            break;
          }
          composed = String.fromCharCode(_i2);
          folded = asciifold(composed);
          if (!(folded == composed.toLowerCase())) {
            _context.next = 11;
            break;
          }
          return _context.abrupt("continue", 17);
        case 11:
          if (!(folded.length > max_char_length)) {
            _context.next = 13;
            break;
          }
          return _context.abrupt("continue", 17);
        case 13:
          if (!(folded.length == 0)) {
            _context.next = 15;
            break;
          }
          return _context.abrupt("continue", 17);
        case 15:
          _context.next = 17;
          return {
            folded: folded,
            composed: composed,
            code_point: _i2
          };
        case 17:
          _i2++;
          _context.next = 6;
          break;
        case 20:
          _context.next = 3;
          break;
        case 22:
          _context.next = 27;
          break;
        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](1);
          _iterator.e(_context.t0);
        case 27:
          _context.prev = 27;
          _iterator.f();
          return _context.finish(27);
        case 30:
        case "end":
          return _context.stop();
      }
    }, _marked, null, [[1, 24, 27, 30]]);
  }
  /**
   * Generate a unicode map from the list of code points
   * @param {TCodePoints} code_points
   * @return {TUnicodeSets}
   */

  var generateSets = function generateSets(code_points) {
    /** @type {{[key:string]:Set<string>}} */
    var unicode_sets = {};
    /**
     * @param {string} folded
     * @param {string} to_add
     */

    var addMatching = function addMatching(folded, to_add) {
      /** @type {Set<string>} */
      var folded_set = unicode_sets[folded] || new Set();
      var patt = new RegExp('^' + setToPattern(folded_set) + '$', 'iu');
      if (to_add.match(patt)) {
        return;
      }
      folded_set.add(escape_regex(to_add));
      unicode_sets[folded] = folded_set;
    };
    var _iterator2 = _createForOfIteratorHelper(generator(code_points)),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var value = _step2.value;
        addMatching(value.folded, value.folded);
        addMatching(value.folded, value.composed);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return unicode_sets;
  };
  /**
   * Generate a unicode map from the list of code points
   * ae => (?:(?:ae|Æ|Ǽ|Ǣ)|(?:A|Ⓐ|Ａ...)(?:E|ɛ|Ⓔ...))
   *
   * @param {TCodePoints} code_points
   * @return {TUnicodeMap}
   */

  var generateMap = function generateMap(code_points) {
    /** @type {TUnicodeSets} */
    var unicode_sets = generateSets(code_points);
    /** @type {TUnicodeMap} */

    var unicode_map = {};
    /** @type {string[]} */

    var multi_char = [];
    for (var folded in unicode_sets) {
      var set = unicode_sets[folded];
      if (set) {
        unicode_map[folded] = setToPattern(set);
      }
      if (folded.length > 1) {
        multi_char.push(escape_regex(folded));
      }
    }
    multi_char.sort(function (a, b) {
      return b.length - a.length;
    });
    var multi_char_patt = arrayToPattern(multi_char);
    multi_char_reg = new RegExp('^' + multi_char_patt, 'u');
    return unicode_map;
  };
  /**
   * Map each element of an array from it's folded value to all possible unicode matches
   * @param {string[]} strings
   * @param {number} min_replacement
   * @return {string}
   */

  var mapSequence = function mapSequence(strings) {
    var min_replacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var chars_replaced = 0;
    strings = strings.map(function (str) {
      if (unicode_map[str]) {
        chars_replaced += str.length;
      }
      return unicode_map[str] || str;
    });
    if (chars_replaced >= min_replacement) {
      return sequencePattern(strings);
    }
    return '';
  };
  /**
   * Convert a short string and split it into all possible patterns
   * Keep a pattern only if min_replacement is met
   *
   * 'abc'
   * 		=> [['abc'],['ab','c'],['a','bc'],['a','b','c']]
   *		=> ['abc-pattern','ab-c-pattern'...]
   *
   *
   * @param {string} str
   * @param {number} min_replacement
   * @return {string}
   */

  var substringsToPattern = function substringsToPattern(str) {
    var min_replacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    min_replacement = Math.max(min_replacement, str.length - 1);
    return arrayToPattern(allSubstrings(str).map(function (sub_pat) {
      return mapSequence(sub_pat, min_replacement);
    }));
  };
  /**
   * Convert an array of sequences into a pattern
   * [{start:0,end:3,length:3,substr:'iii'}...] => (?:iii...)
   *
   * @param {Sequence[]} sequences
   * @param {boolean} all
   */

  var sequencesToPattern = function sequencesToPattern(sequences) {
    var all = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var min_replacement = sequences.length > 1 ? 1 : 0;
    return arrayToPattern(sequences.map(function (sequence) {
      var seq = [];
      var len = all ? sequence.length() : sequence.length() - 1;
      for (var j = 0; j < len; j++) {
        seq.push(substringsToPattern(sequence.substrs[j] || '', min_replacement));
      }
      return sequencePattern(seq);
    }));
  };
  /**
   * Return true if the sequence is already in the sequences
   * @param {Sequence} needle_seq
   * @param {Sequence[]} sequences
   */

  var inSequences = function inSequences(needle_seq, sequences) {
    var _iterator3 = _createForOfIteratorHelper(sequences),
      _step3;
    try {
      var _loop = function _loop() {
        var seq = _step3.value;
        if (seq.start != needle_seq.start || seq.end != needle_seq.end) {
          return "continue";
        }
        if (seq.substrs.join('') !== needle_seq.substrs.join('')) {
          return "continue";
        }
        var needle_parts = needle_seq.parts;
        /**
         * @param {TSequencePart} part
         */

        var filter = function filter(part) {
          var _iterator4 = _createForOfIteratorHelper(needle_parts),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var needle_part = _step4.value;
              if (needle_part.start === part.start && needle_part.substr === part.substr) {
                return false;
              }
              if (part.length == 1 || needle_part.length == 1) {
                continue;
              } // check for overlapping parts
              // a = ['::=','==']
              // b = ['::','===']
              // a = ['r','sm']
              // b = ['rs','m']

              if (part.start < needle_part.start && part.end > needle_part.start) {
                return true;
              }
              if (needle_part.start < part.start && needle_part.end > part.start) {
                return true;
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          return false;
        };
        var filtered = seq.parts.filter(filter);
        if (filtered.length > 0) {
          return "continue";
        }
        return {
          v: true
        };
      };
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _ret = _loop();
        if (_ret === "continue") continue;
        if (_typeof(_ret) === "object") return _ret.v;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return false;
  };
  var Sequence = /*#__PURE__*/function () {
    function Sequence() {
      _classCallCheck(this, Sequence);
      /** @type {TSequencePart[]} */
      this.parts = [];
      /** @type {string[]} */

      this.substrs = [];
      this.start = 0;
      this.end = 0;
    }
    /**
     * @param {TSequencePart|undefined} part
     */
    _createClass(Sequence, [{
      key: "add",
      value: function add(part) {
        if (part) {
          this.parts.push(part);
          this.substrs.push(part.substr);
          this.start = Math.min(part.start, this.start);
          this.end = Math.max(part.end, this.end);
        }
      }
    }, {
      key: "last",
      value: function last() {
        return this.parts[this.parts.length - 1];
      }
    }, {
      key: "length",
      value: function length() {
        return this.parts.length;
      }
      /**
       * @param {number} position
       * @param {TSequencePart} last_piece
       */
    }, {
      key: "clone",
      value: function clone(position, last_piece) {
        var clone = new Sequence();
        var parts = JSON.parse(JSON.stringify(this.parts));
        var last_part = parts.pop();
        var _iterator5 = _createForOfIteratorHelper(parts),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var part = _step5.value;
            clone.add(part);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        var last_substr = last_piece.substr.substring(0, position - last_part.start);
        var clone_last_len = last_substr.length;
        clone.add({
          start: last_part.start,
          end: last_part.start + clone_last_len,
          length: clone_last_len,
          substr: last_substr
        });
        return clone;
      }
    }]);
    return Sequence;
  }();
  /**
   * Expand a regular expression pattern to include unicode variants
   * 	eg /a/ becomes /aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑAⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ/
   *
   * Issue:
   *  ﺊﺋ [ 'ﺊ = \\u{fe8a}', 'ﺋ = \\u{fe8b}' ]
   *	becomes:	ئئ [ 'ي = \\u{64a}', 'ٔ = \\u{654}', 'ي = \\u{64a}', 'ٔ = \\u{654}' ]
   *
   *	İĲ = IIJ = ⅡJ
   *
   * 	1/2/4
   *
   * @param {string} str
   * @return {string|undefined}
   */
  var getPattern = function getPattern(str) {
    initialize();
    str = asciifold(str);
    var pattern = '';
    var sequences = [new Sequence()];
    for (var _i3 = 0; _i3 < str.length; _i3++) {
      var substr = str.substring(_i3);
      var match = substr.match(multi_char_reg);
      var _char5 = str.substring(_i3, _i3 + 1);
      var match_str = match ? match[0] : null; // loop through sequences
      // add either the char or multi_match

      var overlapping = [];
      var added_types = new Set();
      var _iterator6 = _createForOfIteratorHelper(sequences),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var sequence = _step6.value;
          var last_piece = sequence.last();
          if (!last_piece || last_piece.length == 1 || last_piece.end <= _i3) {
            // if we have a multi match
            if (match_str) {
              var len = match_str.length;
              sequence.add({
                start: _i3,
                end: _i3 + len,
                length: len,
                substr: match_str
              });
              added_types.add('1');
            } else {
              sequence.add({
                start: _i3,
                end: _i3 + 1,
                length: 1,
                substr: _char5
              });
              added_types.add('2');
            }
          } else if (match_str) {
            var _clone = sequence.clone(_i3, last_piece);
            var _len3 = match_str.length;
            _clone.add({
              start: _i3,
              end: _i3 + _len3,
              length: _len3,
              substr: match_str
            });
            overlapping.push(_clone);
          } else {
            // don't add char
            // adding would create invalid patterns: 234 => [2,34,4]
            added_types.add('3');
          }
        } // if we have overlapping
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      if (overlapping.length > 0) {
        // ['ii','iii'] before ['i','i','iii']
        overlapping = overlapping.sort(function (a, b) {
          return a.length() - b.length();
        });
        var _iterator7 = _createForOfIteratorHelper(overlapping),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var clone = _step7.value;
            // don't add if we already have an equivalent sequence
            if (inSequences(clone, sequences)) {
              continue;
            }
            sequences.push(clone);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
        continue;
      } // if we haven't done anything unique
      // clean up the patterns
      // helps keep patterns smaller
      // if str = 'r₨㎧aarss', pattern will be 446 instead of 655

      if (_i3 > 0 && added_types.size == 1 && !added_types.has('3')) {
        pattern += sequencesToPattern(sequences, false);
        var new_seq = new Sequence();
        var old_seq = sequences[0];
        if (old_seq) {
          new_seq.add(old_seq.last());
        }
        sequences = [new_seq];
      }
    }
    pattern += sequencesToPattern(sequences, true);
    return pattern;
  };

  /*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */

  /**
   * A property getter resolving dot-notation
   * @param  {Object}  obj     The root object to fetch property on
   * @param  {String}  name    The optionally dotted property name to fetch
   * @return {Object}          The resolved property value
   */
  var getAttr = function getAttr(obj, name) {
    if (!obj) return;
    return obj[name];
  };
  /**
   * A property getter resolving dot-notation
   * @param  {Object}  obj     The root object to fetch property on
   * @param  {String}  name    The optionally dotted property name to fetch
   * @return {Object}          The resolved property value
   */

  var getAttrNesting = function getAttrNesting(obj, name) {
    if (!obj) return;
    var part,
      names = name.split(".");
    while ((part = names.shift()) && (obj = obj[part]));
    return obj;
  };
  /**
   * Calculates how close of a match the
   * given value is against a search token.
   *
   */

  var scoreValue = function scoreValue(value, token, weight) {
    var score, pos;
    if (!value) return 0;
    value = value + '';
    if (token.regex == null) return 0;
    pos = value.search(token.regex);
    if (pos === -1) return 0;
    score = token.string.length / value.length;
    if (pos === 0) score += 0.5;
    return score * weight;
  };
  /**
   * Cast object property to an array if it exists and has a value
   *
   */

  var propToArray = function propToArray(obj, key) {
    var value = obj[key];
    if (typeof value == 'function') return value;
    if (value && !Array.isArray(value)) {
      obj[key] = [value];
    }
  };
  /**
   * Iterates over arrays and hashes.
   *
   * ```
   * iterate(this.items, function(item, id) {
   *    // invoked for each item
   * });
   * ```
   *
   */

  var iterate$1 = function iterate$1(object, callback) {
    if (Array.isArray(object)) {
      object.forEach(callback);
    } else {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          callback(object[key], key);
        }
      }
    }
  };
  var cmp = function cmp(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
      return a > b ? 1 : a < b ? -1 : 0;
    }
    a = asciifold(a + '').toLowerCase();
    b = asciifold(b + '').toLowerCase();
    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
  };

  /*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */

  /**
   * sifter.js
   * Copyright (c) 2013–2020 Brian Reavis & contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   * @author Brian Reavis <brian@thirdroute.com>
   */
  var Sifter = /*#__PURE__*/function () {
    // []|{};

    /**
     * Textually searches arrays and hashes of objects
     * by property (or multiple properties). Designed
     * specifically for autocomplete.
     *
     */
    function Sifter(items, settings) {
      _classCallCheck(this, Sifter);
      this.items = void 0;
      this.settings = void 0;
      this.items = items;
      this.settings = settings || {
        diacritics: true
      };
    }

    /**
     * Splits a search string into an array of individual
     * regexps to be used to match results.
     *
     */
    _createClass(Sifter, [{
      key: "tokenize",
      value: function tokenize(query, respect_word_boundaries, weights) {
        var _this4 = this;
        if (!query || !query.length) return [];
        var tokens = [];
        var words = query.split(/\s+/);
        var field_regex;
        if (weights) {
          field_regex = new RegExp('^(' + Object.keys(weights).map(escape_regex).join('|') + ')\:(.*)$');
        }
        words.forEach(function (word) {
          var field_match;
          var field = null;
          var regex = null; // look for "field:query" tokens

          if (field_regex && (field_match = word.match(field_regex))) {
            field = field_match[1];
            word = field_match[2];
          }
          if (word.length > 0) {
            if (_this4.settings.diacritics) {
              regex = getPattern(word) || null;
            } else {
              regex = escape_regex(word);
            }
            if (regex && respect_word_boundaries) regex = "\\b" + regex;
          }
          tokens.push({
            string: word,
            regex: regex ? new RegExp(regex, 'iu') : null,
            field: field
          });
        });
        return tokens;
      }

      /**
       * Returns a function to be used to score individual results.
       *
       * Good matches will have a higher score than poor matches.
       * If an item is not a match, 0 will be returned by the function.
       *
       * @returns {T.ScoreFn}
       */
    }, {
      key: "getScoreFunction",
      value: function getScoreFunction(query, options) {
        var search = this.prepareSearch(query, options);
        return this._getScoreFunction(search);
      }
      /**
       * @returns {T.ScoreFn}
       *
       */
    }, {
      key: "_getScoreFunction",
      value: function _getScoreFunction(search) {
        var tokens = search.tokens,
          token_count = tokens.length;
        if (!token_count) {
          return function () {
            return 0;
          };
        }
        var fields = search.options.fields,
          weights = search.weights,
          field_count = fields.length,
          getAttrFn = search.getAttrFn;
        if (!field_count) {
          return function () {
            return 1;
          };
        }
        /**
         * Calculates the score of an object
         * against the search query.
         *
         */

        var scoreObject = function () {
          if (field_count === 1) {
            return function (token, data) {
              var field = fields[0].field;
              return scoreValue(getAttrFn(data, field), token, weights[field] || 1);
            };
          }
          return function (token, data) {
            var sum = 0; // is the token specific to a field?

            if (token.field) {
              var value = getAttrFn(data, token.field);
              if (!token.regex && value) {
                sum += 1 / field_count;
              } else {
                sum += scoreValue(value, token, 1);
              }
            } else {
              iterate$1(weights, function (weight, field) {
                sum += scoreValue(getAttrFn(data, field), token, weight);
              });
            }
            return sum / field_count;
          };
        }();
        if (token_count === 1) {
          return function (data) {
            return scoreObject(tokens[0], data);
          };
        }
        if (search.options.conjunction === 'and') {
          return function (data) {
            var score,
              sum = 0;
            var _iterator8 = _createForOfIteratorHelper(tokens),
              _step8;
            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var token = _step8.value;
                score = scoreObject(token, data);
                if (score <= 0) return 0;
                sum += score;
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
            return sum / token_count;
          };
        } else {
          return function (data) {
            var sum = 0;
            iterate$1(tokens, function (token) {
              sum += scoreObject(token, data);
            });
            return sum / token_count;
          };
        }
      }

      /**
       * Returns a function that can be used to compare two
       * results, for sorting purposes. If no sorting should
       * be performed, `null` will be returned.
       *
       * @return function(a,b)
       */
    }, {
      key: "getSortFunction",
      value: function getSortFunction(query, options) {
        var search = this.prepareSearch(query, options);
        return this._getSortFunction(search);
      }
    }, {
      key: "_getSortFunction",
      value: function _getSortFunction(search) {
        var implicit_score,
          sort_flds = [];
        var self = this,
          options = search.options,
          sort = !search.query && options.sort_empty ? options.sort_empty : options.sort;
        if (typeof sort == 'function') {
          return sort.bind(this);
        }
        /**
         * Fetches the specified sort field value
         * from a search result item.
         *
         */

        var get_field = function get_field(name, result) {
          if (name === '$score') return result.score;
          return search.getAttrFn(self.items[result.id], name);
        }; // parse options

        if (sort) {
          var _iterator9 = _createForOfIteratorHelper(sort),
            _step9;
          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var s = _step9.value;
              if (search.query || s.field !== '$score') {
                sort_flds.push(s);
              }
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }
        } // the "$score" field is implied to be the primary
        // sort field, unless it's manually specified

        if (search.query) {
          implicit_score = true;
          var _iterator10 = _createForOfIteratorHelper(sort_flds),
            _step10;
          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var fld = _step10.value;
              if (fld.field === '$score') {
                implicit_score = false;
                break;
              }
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
          if (implicit_score) {
            sort_flds.unshift({
              field: '$score',
              direction: 'desc'
            });
          } // without a search.query, all items will have the same score
        } else {
          sort_flds = sort_flds.filter(function (fld) {
            return fld.field !== '$score';
          });
        } // build function

        var sort_flds_count = sort_flds.length;
        if (!sort_flds_count) {
          return null;
        }
        return function (a, b) {
          var result, field;
          var _iterator11 = _createForOfIteratorHelper(sort_flds),
            _step11;
          try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
              var sort_fld = _step11.value;
              field = sort_fld.field;
              var multiplier = sort_fld.direction === 'desc' ? -1 : 1;
              result = multiplier * cmp(get_field(field, a), get_field(field, b));
              if (result) return result;
            }
          } catch (err) {
            _iterator11.e(err);
          } finally {
            _iterator11.f();
          }
          return 0;
        };
      }

      /**
       * Parses a search query and returns an object
       * with tokens and fields ready to be populated
       * with results.
       *
       */
    }, {
      key: "prepareSearch",
      value: function prepareSearch(query, optsUser) {
        var weights = {};
        var options = Object.assign({}, optsUser);
        propToArray(options, 'sort');
        propToArray(options, 'sort_empty'); // convert fields to new format

        if (options.fields) {
          propToArray(options, 'fields');
          var fields = [];
          options.fields.forEach(function (field) {
            if (typeof field == 'string') {
              field = {
                field: field,
                weight: 1
              };
            }
            fields.push(field);
            weights[field.field] = 'weight' in field ? field.weight : 1;
          });
          options.fields = fields;
        }
        return {
          options: options,
          query: query.toLowerCase().trim(),
          tokens: this.tokenize(query, options.respect_word_boundaries, weights),
          total: 0,
          items: [],
          weights: weights,
          getAttrFn: options.nesting ? getAttrNesting : getAttr
        };
      }

      /**
       * Searches through all items and returns a sorted array of matches.
       *
       */
    }, {
      key: "search",
      value: function search(query, options) {
        var self = this,
          score,
          search;
        search = this.prepareSearch(query, options);
        options = search.options;
        query = search.query; // generate result scoring function

        var fn_score = options.score || self._getScoreFunction(search); // perform search and sort

        if (query.length) {
          iterate$1(self.items, function (item, id) {
            score = fn_score(item);
            if (options.filter === false || score > 0) {
              search.items.push({
                'score': score,
                'id': id
              });
            }
          });
        } else {
          iterate$1(self.items, function (_, id) {
            search.items.push({
              'score': 1,
              'id': id
            });
          });
        }
        var fn_sort = self._getSortFunction(search);
        if (fn_sort) search.items.sort(fn_sort); // apply limits

        search.total = search.items.length;
        if (typeof options.limit === 'number') {
          search.items = search.items.slice(0, options.limit);
        }
        return search;
      }
    }]);
    return Sifter;
  }();
  /**
   * Iterates over arrays and hashes.
   *
   * ```
   * iterate(this.items, function(item, id) {
   *    // invoked for each item
   * });
   * ```
   *
   */
  var iterate = function iterate(object, callback) {
    if (Array.isArray(object)) {
      object.forEach(callback);
    } else {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          callback(object[key], key);
        }
      }
    }
  };

  /**
   * Return a dom element from either a dom query string, jQuery object, a dom element or html string
   * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
   *
   * param query should be {}
   */

  var getDom = function getDom(query) {
    if (query.jquery) {
      return query[0];
    }
    if (query instanceof HTMLElement) {
      return query;
    }
    if (isHtmlString(query)) {
      var tpl = document.createElement('template');
      tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result

      return tpl.content.firstChild;
    }
    return document.querySelector(query);
  };
  var isHtmlString = function isHtmlString(arg) {
    if (typeof arg === 'string' && arg.indexOf('<') > -1) {
      return true;
    }
    return false;
  };
  var escapeQuery = function escapeQuery(query) {
    return query.replace(/['"\\]/g, '\\$&');
  };
  /**
   * Dispatch an event
   *
   */

  var triggerEvent = function triggerEvent(dom_el, event_name) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(event_name, true, false);
    dom_el.dispatchEvent(event);
  };
  /**
   * Apply CSS rules to a dom element
   *
   */

  var applyCSS = function applyCSS(dom_el, css) {
    Object.assign(dom_el.style, css);
  };
  /**
   * Add css classes
   *
   */

  var addClasses = function addClasses(elmts) {
    for (var _len4 = arguments.length, classes = new Array(_len4 > 1 ? _len4 - 1 : 0), _key3 = 1; _key3 < _len4; _key3++) {
      classes[_key3 - 1] = arguments[_key3];
    }
    var norm_classes = classesArray(classes);
    elmts = castAsArray(elmts);
    elmts.map(function (el) {
      norm_classes.map(function (cls) {
        el.classList.add(cls);
      });
    });
  };
  /**
   * Remove css classes
   *
   */

  var removeClasses = function removeClasses(elmts) {
    for (var _len5 = arguments.length, classes = new Array(_len5 > 1 ? _len5 - 1 : 0), _key4 = 1; _key4 < _len5; _key4++) {
      classes[_key4 - 1] = arguments[_key4];
    }
    var norm_classes = classesArray(classes);
    elmts = castAsArray(elmts);
    elmts.map(function (el) {
      norm_classes.map(function (cls) {
        el.classList.remove(cls);
      });
    });
  };
  /**
   * Return arguments
   *
   */

  var classesArray = function classesArray(args) {
    var classes = [];
    iterate(args, function (_classes) {
      if (typeof _classes === 'string') {
        _classes = _classes.trim().split(/[\11\12\14\15\40]/);
      }
      if (Array.isArray(_classes)) {
        classes = classes.concat(_classes);
      }
    });
    return classes.filter(Boolean);
  };
  /**
   * Create an array from arg if it's not already an array
   *
   */

  var castAsArray = function castAsArray(arg) {
    if (!Array.isArray(arg)) {
      arg = [arg];
    }
    return arg;
  };
  /**
   * Get the closest node to the evt.target matching the selector
   * Stops at wrapper
   *
   */

  var parentMatch = function parentMatch(target, selector, wrapper) {
    if (wrapper && !wrapper.contains(target)) {
      return;
    }
    while (target && target.matches) {
      if (target.matches(selector)) {
        return target;
      }
      target = target.parentNode;
    }
  };
  /**
   * Get the first or last item from an array
   *
   * > 0 - right (last)
   * <= 0 - left (first)
   *
   */

  var getTail = function getTail(list) {
    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (direction > 0) {
      return list[list.length - 1];
    }
    return list[0];
  };
  /**
   * Return true if an object is empty
   *
   */

  var isEmptyObject = function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  };
  /**
   * Get the index of an element amongst sibling nodes of the same type
   *
   */

  var nodeIndex = function nodeIndex(el, amongst) {
    if (!el) return -1;
    amongst = amongst || el.nodeName;
    var i = 0;
    while (el = el.previousElementSibling) {
      if (el.matches(amongst)) {
        i++;
      }
    }
    return i;
  };
  /**
   * Set attributes of an element
   *
   */

  var setAttr = function setAttr(el, attrs) {
    iterate(attrs, function (val, attr) {
      if (val == null) {
        el.removeAttribute(attr);
      } else {
        el.setAttribute(attr, '' + val);
      }
    });
  };
  /**
   * Replace a node
   */

  var replaceNode = function replaceNode(existing, replacement) {
    if (existing.parentNode) existing.parentNode.replaceChild(replacement, existing);
  };

  /**
   * highlight v3 | MIT license | Johann Burkard <jb@eaio.com>
   * Highlights arbitrary terms in a node.
   *
   * - Modified by Marshal <beatgates@gmail.com> 2011-6-24 (added regex)
   * - Modified by Brian Reavis <brian@thirdroute.com> 2012-8-27 (cleanup)
   */
  var highlight = function highlight(element, regex) {
    if (regex === null) return; // convet string to regex

    if (typeof regex === 'string') {
      if (!regex.length) return;
      regex = new RegExp(regex, 'i');
    } // Wrap matching part of text node with highlighting <span>, e.g.
    // Soccer  ->  <span class="highlight">Soc</span>cer  for regex = /soc/i

    var highlightText = function highlightText(node) {
      var match = node.data.match(regex);
      if (match && node.data.length > 0) {
        var spannode = document.createElement('span');
        spannode.className = 'highlight';
        var middlebit = node.splitText(match.index);
        middlebit.splitText(match[0].length);
        var middleclone = middlebit.cloneNode(true);
        spannode.appendChild(middleclone);
        replaceNode(middlebit, spannode);
        return 1;
      }
      return 0;
    }; // Recurse element node, looking for child text nodes to highlight, unless element
    // is childless, <script>, <style>, or already highlighted: <span class="hightlight">

    var highlightChildren = function highlightChildren(node) {
      if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && (node.className !== 'highlight' || node.tagName !== 'SPAN')) {
        Array.from(node.childNodes).forEach(function (element) {
          highlightRecursive(element);
        });
      }
    };
    var highlightRecursive = function highlightRecursive(node) {
      if (node.nodeType === 3) {
        return highlightText(node);
      }
      highlightChildren(node);
      return 0;
    };
    highlightRecursive(element);
  };
  /**
   * removeHighlight fn copied from highlight v5 and
   * edited to remove with(), pass js strict mode, and use without jquery
   */

  var removeHighlight = function removeHighlight(el) {
    var elements = el.querySelectorAll("span.highlight");
    Array.prototype.forEach.call(elements, function (el) {
      var parent = el.parentNode;
      parent.replaceChild(el.firstChild, el);
      parent.normalize();
    });
  };
  var KEY_A = 65;
  var KEY_RETURN = 13;
  var KEY_ESC = 27;
  var KEY_LEFT = 37;
  var KEY_UP = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN = 40;
  var KEY_BACKSPACE = 8;
  var KEY_DELETE = 46;
  var KEY_TAB = 9;
  var IS_MAC = typeof navigator === 'undefined' ? false : /Mac/.test(navigator.userAgent);
  var KEY_SHORTCUT = IS_MAC ? 'metaKey' : 'ctrlKey'; // ctrl key or apple key for ma

  var defaults = {
    options: [],
    optgroups: [],
    plugins: [],
    delimiter: ',',
    splitOn: null,
    // regexp or string for splitting up values from a paste command
    persist: true,
    diacritics: true,
    create: null,
    createOnBlur: false,
    createFilter: null,
    highlight: true,
    openOnFocus: true,
    shouldOpen: null,
    maxOptions: 50,
    maxItems: null,
    hideSelected: null,
    duplicates: false,
    addPrecedence: false,
    selectOnTab: false,
    preload: null,
    allowEmptyOption: false,
    //closeAfterSelect: false,
    loadThrottle: 300,
    loadingClass: 'loading',
    dataAttr: null,
    //'data-data',
    optgroupField: 'optgroup',
    valueField: 'value',
    labelField: 'text',
    disabledField: 'disabled',
    optgroupLabelField: 'label',
    optgroupValueField: 'value',
    lockOptgroupOrder: false,
    sortField: '$order',
    searchField: ['text'],
    searchConjunction: 'and',
    mode: null,
    wrapperClass: 'ts-wrapper',
    controlClass: 'ts-control',
    dropdownClass: 'ts-dropdown',
    dropdownContentClass: 'ts-dropdown-content',
    itemClass: 'item',
    optionClass: 'option',
    dropdownParent: null,
    controlInput: '<input type="text" autocomplete="off" size="1" />',
    copyClassesToDropdown: false,
    placeholder: null,
    hidePlaceholder: null,
    shouldLoad: function shouldLoad(query) {
      return query.length > 0;
    },
    /*
    load                 : null, // function(query, callback) { ... }
    score                : null, // function(search) { ... }
    onInitialize         : null, // function() { ... }
    onChange             : null, // function(value) { ... }
    onItemAdd            : null, // function(value, $item) { ... }
    onItemRemove         : null, // function(value) { ... }
    onClear              : null, // function() { ... }
    onOptionAdd          : null, // function(value, data) { ... }
    onOptionRemove       : null, // function(value) { ... }
    onOptionClear        : null, // function() { ... }
    onOptionGroupAdd     : null, // function(id, data) { ... }
    onOptionGroupRemove  : null, // function(id) { ... }
    onOptionGroupClear   : null, // function() { ... }
    onDropdownOpen       : null, // function(dropdown) { ... }
    onDropdownClose      : null, // function(dropdown) { ... }
    onType               : null, // function(str) { ... }
    onDelete             : null, // function(values) { ... }
    */
    render: {
      /*
      item: null,
      optgroup: null,
      optgroup_header: null,
      option: null,
      option_create: null
      */
    }
  };

  /**
   * Converts a scalar to its best string representation
   * for hash keys and HTML attribute values.
   *
   * Transformations:
   *   'str'     -> 'str'
   *   null      -> ''
   *   undefined -> ''
   *   true      -> '1'
   *   false     -> '0'
   *   0         -> '0'
   *   1         -> '1'
   *
   */
  var hash_key = function hash_key(value) {
    if (typeof value === 'undefined' || value === null) return null;
    return get_hash(value);
  };
  var get_hash = function get_hash(value) {
    if (typeof value === 'boolean') return value ? '1' : '0';
    return value + '';
  };
  /**
   * Escapes a string for use within HTML.
   *
   */

  var escape_html = function escape_html(str) {
    return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  /**
   * Debounce the user provided load function
   *
   */

  var loadDebounce = function loadDebounce(fn, delay) {
    var timeout;
    return function (value, callback) {
      var self = this;
      if (timeout) {
        self.loading = Math.max(self.loading - 1, 0);
        clearTimeout(timeout);
      }
      timeout = setTimeout(function () {
        timeout = null;
        self.loadedSearches[value] = true;
        fn.call(self, value, callback);
      }, delay);
    };
  };
  /**
   * Debounce all fired events types listed in `types`
   * while executing the provided `fn`.
   *
   */

  var debounce_events = function debounce_events(self, types, fn) {
    var type;
    var trigger = self.trigger;
    var event_args = {}; // override trigger method

    self.trigger = function () {
      var type = arguments[0];
      if (types.indexOf(type) !== -1) {
        event_args[type] = arguments;
      } else {
        return trigger.apply(self, arguments);
      }
    }; // invoke provided function

    fn.apply(self, []);
    self.trigger = trigger; // trigger queued events
    var _iterator12 = _createForOfIteratorHelper(types),
      _step12;
    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        type = _step12.value;
        if (type in event_args) {
          trigger.apply(self, event_args[type]);
        }
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
  };
  /**
   * Determines the current selection within a text input control.
   * Returns an object containing:
   *   - start
   *   - length
   *
   */

  var getSelection = function getSelection(input) {
    return {
      start: input.selectionStart || 0,
      length: (input.selectionEnd || 0) - (input.selectionStart || 0)
    };
  };
  /**
   * Prevent default
   *
   */

  var preventDefault = function preventDefault(evt) {
    var stop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (evt) {
      evt.preventDefault();
      if (stop) {
        evt.stopPropagation();
      }
    }
  };
  /**
   * Add event helper
   *
   */

  var addEvent = function addEvent(target, type, callback, options) {
    target.addEventListener(type, callback, options);
  };
  /**
   * Return true if the requested key is down
   * Will return false if more than one control character is pressed ( when [ctrl+shift+a] != [ctrl+a] )
   * The current evt may not always set ( eg calling advanceSelection() )
   *
   */

  var isKeyDown = function isKeyDown(key_name, evt) {
    if (!evt) {
      return false;
    }
    if (!evt[key_name]) {
      return false;
    }
    var count = (evt.altKey ? 1 : 0) + (evt.ctrlKey ? 1 : 0) + (evt.shiftKey ? 1 : 0) + (evt.metaKey ? 1 : 0);
    if (count === 1) {
      return true;
    }
    return false;
  };
  /**
   * Get the id of an element
   * If the id attribute is not set, set the attribute with the given id
   *
   */

  var getId = function getId(el, id) {
    var existing_id = el.getAttribute('id');
    if (existing_id) {
      return existing_id;
    }
    el.setAttribute('id', id);
    return id;
  };
  /**
   * Returns a string with backslashes added before characters that need to be escaped.
   */

  var addSlashes = function addSlashes(str) {
    return str.replace(/[\\"']/g, '\\$&');
  };
  /**
   *
   */

  var append = function append(parent, node) {
    if (node) parent.append(node);
  };
  function getSettings(input, settings_user) {
    var settings = Object.assign({}, defaults, settings_user);
    var attr_data = settings.dataAttr;
    var field_label = settings.labelField;
    var field_value = settings.valueField;
    var field_disabled = settings.disabledField;
    var field_optgroup = settings.optgroupField;
    var field_optgroup_label = settings.optgroupLabelField;
    var field_optgroup_value = settings.optgroupValueField;
    var tag_name = input.tagName.toLowerCase();
    var placeholder = input.getAttribute('placeholder') || input.getAttribute('data-placeholder');
    if (!placeholder && !settings.allowEmptyOption) {
      var option = input.querySelector('option[value=""]');
      if (option) {
        placeholder = option.textContent;
      }
    }
    var settings_element = {
      placeholder: placeholder,
      options: [],
      optgroups: [],
      items: [],
      maxItems: null
    };
    /**
     * Initialize from a <select> element.
     *
     */

    var init_select = function init_select() {
      var tagName;
      var options = settings_element.options;
      var optionsMap = {};
      var group_count = 1;
      var readData = function readData(el) {
        var data = Object.assign({}, el.dataset); // get plain object from DOMStringMap

        var json = attr_data && data[attr_data];
        if (typeof json === 'string' && json.length) {
          data = Object.assign(data, JSON.parse(json));
        }
        return data;
      };
      var addOption = function addOption(option, group) {
        var value = hash_key(option.value);
        if (value == null) return;
        if (!value && !settings.allowEmptyOption) return; // if the option already exists, it's probably been
        // duplicated in another optgroup. in this case, push
        // the current group to the "optgroup" property on the
        // existing option so that it's rendered in both places.

        if (optionsMap.hasOwnProperty(value)) {
          if (group) {
            var arr = optionsMap[value][field_optgroup];
            if (!arr) {
              optionsMap[value][field_optgroup] = group;
            } else if (!Array.isArray(arr)) {
              optionsMap[value][field_optgroup] = [arr, group];
            } else {
              arr.push(group);
            }
          }
        } else {
          var option_data = readData(option);
          option_data[field_label] = option_data[field_label] || option.textContent;
          option_data[field_value] = option_data[field_value] || value;
          option_data[field_disabled] = option_data[field_disabled] || option.disabled;
          option_data[field_optgroup] = option_data[field_optgroup] || group;
          option_data.$option = option;
          optionsMap[value] = option_data;
          options.push(option_data);
        }
        if (option.selected) {
          settings_element.items.push(value);
        }
      };
      var addGroup = function addGroup(optgroup) {
        var id, optgroup_data;
        optgroup_data = readData(optgroup);
        optgroup_data[field_optgroup_label] = optgroup_data[field_optgroup_label] || optgroup.getAttribute('label') || '';
        optgroup_data[field_optgroup_value] = optgroup_data[field_optgroup_value] || group_count++;
        optgroup_data[field_disabled] = optgroup_data[field_disabled] || optgroup.disabled;
        settings_element.optgroups.push(optgroup_data);
        id = optgroup_data[field_optgroup_value];
        iterate(optgroup.children, function (option) {
          addOption(option, id);
        });
      };
      settings_element.maxItems = input.hasAttribute('multiple') ? null : 1;
      iterate(input.children, function (child) {
        tagName = child.tagName.toLowerCase();
        if (tagName === 'optgroup') {
          addGroup(child);
        } else if (tagName === 'option') {
          addOption(child);
        }
      });
    };
    /**
     * Initialize from a <input type="text"> element.
     *
     */

    var init_textbox = function init_textbox() {
      var data_raw = input.getAttribute(attr_data);
      if (!data_raw) {
        var value = input.value.trim() || '';
        if (!settings.allowEmptyOption && !value.length) return;
        var values = value.split(settings.delimiter);
        iterate(values, function (value) {
          var option = {};
          option[field_label] = value;
          option[field_value] = value;
          settings_element.options.push(option);
        });
        settings_element.items = values;
      } else {
        settings_element.options = JSON.parse(data_raw);
        iterate(settings_element.options, function (opt) {
          settings_element.items.push(opt[field_value]);
        });
      }
    };
    if (tag_name === 'select') {
      init_select();
    } else {
      init_textbox();
    }
    return Object.assign({}, defaults, settings_element, settings_user);
  }
  var instance_i = 0;
  var TomSelect = /*#__PURE__*/function (_MicroPlugin) {
    _inherits(TomSelect, _MicroPlugin);
    var _super2 = _createSuper(TomSelect);
    // @deprecated 1.8
    function TomSelect(input_arg, user_settings) {
      var _this5;
      _classCallCheck(this, TomSelect);
      _this5 = _super2.call(this);
      _this5.control_input = void 0;
      _this5.wrapper = void 0;
      _this5.dropdown = void 0;
      _this5.control = void 0;
      _this5.dropdown_content = void 0;
      _this5.focus_node = void 0;
      _this5.order = 0;
      _this5.settings = void 0;
      _this5.input = void 0;
      _this5.tabIndex = void 0;
      _this5.is_select_tag = void 0;
      _this5.rtl = void 0;
      _this5.inputId = void 0;
      _this5._destroy = void 0;
      _this5.sifter = void 0;
      _this5.isOpen = false;
      _this5.isDisabled = false;
      _this5.isRequired = void 0;
      _this5.isInvalid = false;
      _this5.isValid = true;
      _this5.isLocked = false;
      _this5.isFocused = false;
      _this5.isInputHidden = false;
      _this5.isSetup = false;
      _this5.ignoreFocus = false;
      _this5.ignoreHover = false;
      _this5.hasOptions = false;
      _this5.currentResults = void 0;
      _this5.lastValue = '';
      _this5.caretPos = 0;
      _this5.loading = 0;
      _this5.loadedSearches = {};
      _this5.activeOption = null;
      _this5.activeItems = [];
      _this5.optgroups = {};
      _this5.options = {};
      _this5.userOptions = {};
      _this5.items = [];
      instance_i++;
      var dir;
      var input = getDom(input_arg);
      if (input.tomselect) {
        throw new Error('Tom Select already initialized on this element');
      }
      input.tomselect = _assertThisInitialized(_this5); // detect rtl environment

      var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
      dir = computedStyle.getPropertyValue('direction'); // setup default state

      var settings = getSettings(input, user_settings);
      _this5.settings = settings;
      _this5.input = input;
      _this5.tabIndex = input.tabIndex || 0;
      _this5.is_select_tag = input.tagName.toLowerCase() === 'select';
      _this5.rtl = /rtl/i.test(dir);
      _this5.inputId = getId(input, 'tomselect-' + instance_i);
      _this5.isRequired = input.required; // search system

      _this5.sifter = new Sifter(_this5.options, {
        diacritics: settings.diacritics
      }); // option-dependent defaults

      settings.mode = settings.mode || (settings.maxItems === 1 ? 'single' : 'multi');
      if (typeof settings.hideSelected !== 'boolean') {
        settings.hideSelected = settings.mode === 'multi';
      }
      if (typeof settings.hidePlaceholder !== 'boolean') {
        settings.hidePlaceholder = settings.mode !== 'multi';
      } // set up createFilter callback

      var filter = settings.createFilter;
      if (typeof filter !== 'function') {
        if (typeof filter === 'string') {
          filter = new RegExp(filter);
        }
        if (filter instanceof RegExp) {
          settings.createFilter = function (input) {
            return filter.test(input);
          };
        } else {
          settings.createFilter = function (value) {
            return _this5.settings.duplicates || !_this5.options[value];
          };
        }
      }
      _this5.initializePlugins(settings.plugins);
      _this5.setupCallbacks();
      _this5.setupTemplates(); // Create all elements

      var wrapper = getDom('<div>');
      var control = getDom('<div>');
      var dropdown = _this5._render('dropdown');
      var dropdown_content = getDom("<div role=\"listbox\" tabindex=\"-1\">");
      var classes = _this5.input.getAttribute('class') || '';
      var inputMode = settings.mode;
      var control_input;
      addClasses(wrapper, settings.wrapperClass, classes, inputMode);
      addClasses(control, settings.controlClass);
      append(wrapper, control);
      addClasses(dropdown, settings.dropdownClass, inputMode);
      if (settings.copyClassesToDropdown) {
        addClasses(dropdown, classes);
      }
      addClasses(dropdown_content, settings.dropdownContentClass);
      append(dropdown, dropdown_content);
      getDom(settings.dropdownParent || wrapper).appendChild(dropdown); // default controlInput

      if (isHtmlString(settings.controlInput)) {
        control_input = getDom(settings.controlInput); // set attributes

        var attrs = ['autocorrect', 'autocapitalize', 'autocomplete'];
        iterate$1(attrs, function (attr) {
          if (input.getAttribute(attr)) {
            setAttr(control_input, _defineProperty({}, attr, input.getAttribute(attr)));
          }
        });
        control_input.tabIndex = -1;
        control.appendChild(control_input);
        _this5.focus_node = control_input; // dom element
      } else if (settings.controlInput) {
        control_input = getDom(settings.controlInput);
        _this5.focus_node = control_input;
      } else {
        control_input = getDom('<input/>');
        _this5.focus_node = control;
      }
      _this5.wrapper = wrapper;
      _this5.dropdown = dropdown;
      _this5.dropdown_content = dropdown_content;
      _this5.control = control;
      _this5.control_input = control_input;
      _this5.setup();
      return _this5;
    }
    /**
     * set up event bindings.
     *
     */
    _createClass(TomSelect, [{
      key: "setup",
      value: function setup() {
        var self = this;
        var settings = self.settings;
        var control_input = self.control_input;
        var dropdown = self.dropdown;
        var dropdown_content = self.dropdown_content;
        var wrapper = self.wrapper;
        var control = self.control;
        var input = self.input;
        var focus_node = self.focus_node;
        var passive_event = {
          passive: true
        };
        var listboxId = self.inputId + '-ts-dropdown';
        setAttr(dropdown_content, {
          id: listboxId
        });
        setAttr(focus_node, {
          role: 'combobox',
          'aria-haspopup': 'listbox',
          'aria-expanded': 'false',
          'aria-controls': listboxId
        });
        var control_id = getId(focus_node, self.inputId + '-ts-control');
        var query = "label[for='" + escapeQuery(self.inputId) + "']";
        var label = document.querySelector(query);
        var label_click = self.focus.bind(self);
        if (label) {
          addEvent(label, 'click', label_click);
          setAttr(label, {
            "for": control_id
          });
          var label_id = getId(label, self.inputId + '-ts-label');
          setAttr(focus_node, {
            'aria-labelledby': label_id
          });
          setAttr(dropdown_content, {
            'aria-labelledby': label_id
          });
        }
        wrapper.style.width = input.style.width;
        if (self.plugins.names.length) {
          var classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
          addClasses([wrapper, dropdown], classes_plugins);
        }
        if ((settings.maxItems === null || settings.maxItems > 1) && self.is_select_tag) {
          setAttr(input, {
            multiple: 'multiple'
          });
        }
        if (settings.placeholder) {
          setAttr(control_input, {
            placeholder: settings.placeholder
          });
        } // if splitOn was not passed in, construct it from the delimiter to allow pasting universally

        if (!settings.splitOn && settings.delimiter) {
          settings.splitOn = new RegExp('\\s*' + escape_regex(settings.delimiter) + '+\\s*');
        } // debounce user defined load() if loadThrottle > 0
        // after initializePlugins() so plugins can create/modify user defined loaders

        if (settings.load && settings.loadThrottle) {
          settings.load = loadDebounce(settings.load, settings.loadThrottle);
        }
        self.control_input.type = input.type;
        addEvent(dropdown, 'mousemove', function () {
          self.ignoreHover = false;
        });
        addEvent(dropdown, 'mouseenter', function (e) {
          var target_match = parentMatch(e.target, '[data-selectable]', dropdown);
          if (target_match) self.onOptionHover(e, target_match);
        }, {
          capture: true
        }); // clicking on an option should select it

        addEvent(dropdown, 'click', function (evt) {
          var option = parentMatch(evt.target, '[data-selectable]');
          if (option) {
            self.onOptionSelect(evt, option);
            preventDefault(evt, true);
          }
        });
        addEvent(control, 'click', function (evt) {
          var target_match = parentMatch(evt.target, '[data-ts-item]', control);
          if (target_match && self.onItemSelect(evt, target_match)) {
            preventDefault(evt, true);
            return;
          } // retain focus (see control_input mousedown)

          if (control_input.value != '') {
            return;
          }
          self.onClick();
          preventDefault(evt, true);
        }); // keydown on focus_node for arrow_down/arrow_up

        addEvent(focus_node, 'keydown', function (e) {
          return self.onKeyDown(e);
        }); // keypress and input/keyup

        addEvent(control_input, 'keypress', function (e) {
          return self.onKeyPress(e);
        });
        addEvent(control_input, 'input', function (e) {
          return self.onInput(e);
        });
        addEvent(focus_node, 'blur', function (e) {
          return self.onBlur(e);
        });
        addEvent(focus_node, 'focus', function (e) {
          return self.onFocus(e);
        });
        addEvent(control_input, 'paste', function (e) {
          return self.onPaste(e);
        });
        var doc_mousedown = function doc_mousedown(evt) {
          // blur if target is outside of this instance
          // dropdown is not always inside wrapper
          var target = evt.composedPath()[0];
          if (!wrapper.contains(target) && !dropdown.contains(target)) {
            if (self.isFocused) {
              self.blur();
            }
            self.inputState();
            return;
          } // retain focus by preventing native handling. if the
          // event target is the input it should not be modified.
          // otherwise, text selection within the input won't work.
          // Fixes bug #212 which is no covered by tests

          if (target == control_input && self.isOpen) {
            evt.stopPropagation(); // clicking anywhere in the control should not blur the control_input (which would close the dropdown)
          } else {
            preventDefault(evt, true);
          }
        };
        var win_scroll = function win_scroll() {
          if (self.isOpen) {
            self.positionDropdown();
          }
        };
        addEvent(document, 'mousedown', doc_mousedown);
        addEvent(window, 'scroll', win_scroll, passive_event);
        addEvent(window, 'resize', win_scroll, passive_event);
        this._destroy = function () {
          document.removeEventListener('mousedown', doc_mousedown);
          window.removeEventListener('scroll', win_scroll);
          window.removeEventListener('resize', win_scroll);
          if (label) label.removeEventListener('click', label_click);
        }; // store original html and tab index so that they can be
        // restored when the destroy() method is called.

        this.revertSettings = {
          innerHTML: input.innerHTML,
          tabIndex: input.tabIndex
        };
        input.tabIndex = -1;
        input.insertAdjacentElement('afterend', self.wrapper);
        self.sync(false);
        settings.items = [];
        delete settings.optgroups;
        delete settings.options;
        addEvent(input, 'invalid', function () {
          if (self.isValid) {
            self.isValid = false;
            self.isInvalid = true;
            self.refreshState();
          }
        });
        self.updateOriginalInput();
        self.refreshItems();
        self.close(false);
        self.inputState();
        self.isSetup = true;
        if (input.disabled) {
          self.disable();
        } else {
          self.enable(); //sets tabIndex
        }

        self.on('change', this.onChange);
        addClasses(input, 'tomselected', 'ts-hidden-accessible');
        self.trigger('initialize'); // preload options

        if (settings.preload === true) {
          self.preload();
        }
      }
      /**
       * Register options and optgroups
       *
       */
    }, {
      key: "setupOptions",
      value: function setupOptions() {
        var _this6 = this;
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var optgroups = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        // build options table
        this.addOptions(options); // build optgroup table

        iterate$1(optgroups, function (optgroup) {
          _this6.registerOptionGroup(optgroup);
        });
      }
      /**
       * Sets up default rendering functions.
       */
    }, {
      key: "setupTemplates",
      value: function setupTemplates() {
        var self = this;
        var field_label = self.settings.labelField;
        var field_optgroup = self.settings.optgroupLabelField;
        var templates = {
          'optgroup': function optgroup(data) {
            var optgroup = document.createElement('div');
            optgroup.className = 'optgroup';
            optgroup.appendChild(data.options);
            return optgroup;
          },
          'optgroup_header': function optgroup_header(data, escape) {
            return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
          },
          'option': function option(data, escape) {
            return '<div>' + escape(data[field_label]) + '</div>';
          },
          'item': function item(data, escape) {
            return '<div>' + escape(data[field_label]) + '</div>';
          },
          'option_create': function option_create(data, escape) {
            return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
          },
          'no_results': function no_results() {
            return '<div class="no-results">No results found</div>';
          },
          'loading': function loading() {
            return '<div class="spinner"></div>';
          },
          'not_loading': function not_loading() {},
          'dropdown': function dropdown() {
            return '<div></div>';
          }
        };
        self.settings.render = Object.assign({}, templates, self.settings.render);
      }
      /**
       * Maps fired events to callbacks provided
       * in the settings used when creating the control.
       */
    }, {
      key: "setupCallbacks",
      value: function setupCallbacks() {
        var key, fn;
        var callbacks = {
          'initialize': 'onInitialize',
          'change': 'onChange',
          'item_add': 'onItemAdd',
          'item_remove': 'onItemRemove',
          'item_select': 'onItemSelect',
          'clear': 'onClear',
          'option_add': 'onOptionAdd',
          'option_remove': 'onOptionRemove',
          'option_clear': 'onOptionClear',
          'optgroup_add': 'onOptionGroupAdd',
          'optgroup_remove': 'onOptionGroupRemove',
          'optgroup_clear': 'onOptionGroupClear',
          'dropdown_open': 'onDropdownOpen',
          'dropdown_close': 'onDropdownClose',
          'type': 'onType',
          'load': 'onLoad',
          'focus': 'onFocus',
          'blur': 'onBlur'
        };
        for (key in callbacks) {
          fn = this.settings[callbacks[key]];
          if (fn) this.on(key, fn);
        }
      }
      /**
       * Sync the Tom Select instance with the original input or select
       *
       */
    }, {
      key: "sync",
      value: function sync() {
        var get_settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var self = this;
        var settings = get_settings ? getSettings(self.input, {
          delimiter: self.settings.delimiter
        }) : self.settings;
        self.setupOptions(settings.options, settings.optgroups);
        self.setValue(settings.items || [], true); // silent prevents recursion

        self.lastQuery = null; // so updated options will be displayed in dropdown
      }
      /**
       * Triggered when the main control element
       * has a click event.
       *
       */
    }, {
      key: "onClick",
      value: function onClick() {
        var self = this;
        if (self.activeItems.length > 0) {
          self.clearActiveItems();
          self.focus();
          return;
        }
        if (self.isFocused && self.isOpen) {
          self.blur();
        } else {
          self.focus();
        }
      }
      /**
       * @deprecated v1.7
       *
       */
    }, {
      key: "onMouseDown",
      value: function onMouseDown() {}
      /**
       * Triggered when the value of the control has been changed.
       * This should propagate the event to the original DOM
       * input / select element.
       */
    }, {
      key: "onChange",
      value: function onChange() {
        triggerEvent(this.input, 'input');
        triggerEvent(this.input, 'change');
      }
      /**
       * Triggered on <input> paste.
       *
       */
    }, {
      key: "onPaste",
      value: function onPaste(e) {
        var _this7 = this;
        var self = this;
        if (self.isInputHidden || self.isLocked) {
          preventDefault(e);
          return;
        } // If a regex or string is included, this will split the pasted
        // input and create Items for each separate value

        if (!self.settings.splitOn) {
          return;
        } // Wait for pasted text to be recognized in value

        setTimeout(function () {
          var pastedText = self.inputValue();
          if (!pastedText.match(self.settings.splitOn)) {
            return;
          }
          var splitInput = pastedText.trim().split(self.settings.splitOn);
          iterate$1(splitInput, function (piece) {
            var hash = hash_key(piece);
            if (hash) {
              if (_this7.options[piece]) {
                self.addItem(piece);
              } else {
                self.createItem(piece);
              }
            }
          });
        }, 0);
      }
      /**
       * Triggered on <input> keypress.
       *
       */
    }, {
      key: "onKeyPress",
      value: function onKeyPress(e) {
        var self = this;
        if (self.isLocked) {
          preventDefault(e);
          return;
        }
        var character = String.fromCharCode(e.keyCode || e.which);
        if (self.settings.create && self.settings.mode === 'multi' && character === self.settings.delimiter) {
          self.createItem();
          preventDefault(e);
          return;
        }
      }
      /**
       * Triggered on <input> keydown.
       *
       */
    }, {
      key: "onKeyDown",
      value: function onKeyDown(e) {
        var self = this;
        self.ignoreHover = true;
        if (self.isLocked) {
          if (e.keyCode !== KEY_TAB) {
            preventDefault(e);
          }
          return;
        }
        switch (e.keyCode) {
          // ctrl+A: select all
          case KEY_A:
            if (isKeyDown(KEY_SHORTCUT, e)) {
              if (self.control_input.value == '') {
                preventDefault(e);
                self.selectAll();
                return;
              }
            }
            break;
          // esc: close dropdown

          case KEY_ESC:
            if (self.isOpen) {
              preventDefault(e, true);
              self.close();
            }
            self.clearActiveItems();
            return;
          // down: open dropdown or move selection down

          case KEY_DOWN:
            if (!self.isOpen && self.hasOptions) {
              self.open();
            } else if (self.activeOption) {
              var next = self.getAdjacent(self.activeOption, 1);
              if (next) self.setActiveOption(next);
            }
            preventDefault(e);
            return;
          // up: move selection up

          case KEY_UP:
            if (self.activeOption) {
              var prev = self.getAdjacent(self.activeOption, -1);
              if (prev) self.setActiveOption(prev);
            }
            preventDefault(e);
            return;
          // return: select active option

          case KEY_RETURN:
            if (self.canSelect(self.activeOption)) {
              self.onOptionSelect(e, self.activeOption);
              preventDefault(e); // if the option_create=null, the dropdown might be closed
            } else if (self.settings.create && self.createItem()) {
              preventDefault(e); // don't submit form when searching for a value
            } else if (document.activeElement == self.control_input && self.isOpen) {
              preventDefault(e);
            }
            return;
          // left: modifiy item selection to the left

          case KEY_LEFT:
            self.advanceSelection(-1, e);
            return;
          // right: modifiy item selection to the right

          case KEY_RIGHT:
            self.advanceSelection(1, e);
            return;
          // tab: select active option and/or create item

          case KEY_TAB:
            if (self.settings.selectOnTab) {
              if (self.canSelect(self.activeOption)) {
                self.onOptionSelect(e, self.activeOption); // prevent default [tab] behaviour of jump to the next field
                // if select isFull, then the dropdown won't be open and [tab] will work normally

                preventDefault(e);
              }
              if (self.settings.create && self.createItem()) {
                preventDefault(e);
              }
            }
            return;
          // delete|backspace: delete items

          case KEY_BACKSPACE:
          case KEY_DELETE:
            self.deleteSelection(e);
            return;
        } // don't enter text in the control_input when active items are selected

        if (self.isInputHidden && !isKeyDown(KEY_SHORTCUT, e)) {
          preventDefault(e);
        }
      }
      /**
       * Triggered on <input> keyup.
       *
       */
    }, {
      key: "onInput",
      value: function onInput(e) {
        var self = this;
        if (self.isLocked) {
          return;
        }
        var value = self.inputValue();
        if (self.lastValue !== value) {
          self.lastValue = value;
          if (self.settings.shouldLoad.call(self, value)) {
            self.load(value);
          }
          self.refreshOptions();
          self.trigger('type', value);
        }
      }
      /**
       * Triggered when the user rolls over
       * an option in the autocomplete dropdown menu.
       *
       */
    }, {
      key: "onOptionHover",
      value: function onOptionHover(evt, option) {
        if (this.ignoreHover) return;
        this.setActiveOption(option, false);
      }
      /**
       * Triggered on <input> focus.
       *
       */
    }, {
      key: "onFocus",
      value: function onFocus(e) {
        var self = this;
        var wasFocused = self.isFocused;
        if (self.isDisabled) {
          self.blur();
          preventDefault(e);
          return;
        }
        if (self.ignoreFocus) return;
        self.isFocused = true;
        if (self.settings.preload === 'focus') self.preload();
        if (!wasFocused) self.trigger('focus');
        if (!self.activeItems.length) {
          self.showInput();
          self.refreshOptions(!!self.settings.openOnFocus);
        }
        self.refreshState();
      }
      /**
       * Triggered on <input> blur.
       *
       */
    }, {
      key: "onBlur",
      value: function onBlur(e) {
        if (document.hasFocus() === false) return;
        var self = this;
        if (!self.isFocused) return;
        self.isFocused = false;
        self.ignoreFocus = false;
        var deactivate = function deactivate() {
          self.close();
          self.setActiveItem();
          self.setCaret(self.items.length);
          self.trigger('blur');
        };
        if (self.settings.create && self.settings.createOnBlur) {
          self.createItem(null, deactivate);
        } else {
          deactivate();
        }
      }
      /**
       * Triggered when the user clicks on an option
       * in the autocomplete dropdown menu.
       *
       */
    }, {
      key: "onOptionSelect",
      value: function onOptionSelect(evt, option) {
        var value,
          self = this; // should not be possible to trigger a option under a disabled optgroup

        if (option.parentElement && option.parentElement.matches('[data-disabled]')) {
          return;
        }
        if (option.classList.contains('create')) {
          self.createItem(null, function () {
            if (self.settings.closeAfterSelect) {
              self.close();
            }
          });
        } else {
          value = option.dataset.value;
          if (typeof value !== 'undefined') {
            self.lastQuery = null;
            self.addItem(value);
            if (self.settings.closeAfterSelect) {
              self.close();
            }
            if (!self.settings.hideSelected && evt.type && /click/.test(evt.type)) {
              self.setActiveOption(option);
            }
          }
        }
      }
      /**
       * Return true if the given option can be selected
       *
       */
    }, {
      key: "canSelect",
      value: function canSelect(option) {
        if (this.isOpen && option && this.dropdown_content.contains(option)) {
          return true;
        }
        return false;
      }
      /**
       * Triggered when the user clicks on an item
       * that has been selected.
       *
       */
    }, {
      key: "onItemSelect",
      value: function onItemSelect(evt, item) {
        var self = this;
        if (!self.isLocked && self.settings.mode === 'multi') {
          preventDefault(evt);
          self.setActiveItem(item, evt);
          return true;
        }
        return false;
      }
      /**
       * Determines whether or not to invoke
       * the user-provided option provider / loader
       *
       * Note, there is a subtle difference between
       * this.canLoad() and this.settings.shouldLoad();
       *
       *	- settings.shouldLoad() is a user-input validator.
       *	When false is returned, the not_loading template
       *	will be added to the dropdown
       *
       *	- canLoad() is lower level validator that checks
       * 	the Tom Select instance. There is no inherent user
       *	feedback when canLoad returns false
       *
       */
    }, {
      key: "canLoad",
      value: function canLoad(value) {
        if (!this.settings.load) return false;
        if (this.loadedSearches.hasOwnProperty(value)) return false;
        return true;
      }
      /**
       * Invokes the user-provided option provider / loader.
       *
       */
    }, {
      key: "load",
      value: function load(value) {
        var self = this;
        if (!self.canLoad(value)) return;
        addClasses(self.wrapper, self.settings.loadingClass);
        self.loading++;
        var callback = self.loadCallback.bind(self);
        self.settings.load.call(self, value, callback);
      }
      /**
       * Invoked by the user-provided option provider
       *
       */
    }, {
      key: "loadCallback",
      value: function loadCallback(options, optgroups) {
        var self = this;
        self.loading = Math.max(self.loading - 1, 0);
        self.lastQuery = null;
        self.clearActiveOption(); // when new results load, focus should be on first option

        self.setupOptions(options, optgroups);
        self.refreshOptions(self.isFocused && !self.isInputHidden);
        if (!self.loading) {
          removeClasses(self.wrapper, self.settings.loadingClass);
        }
        self.trigger('load', options, optgroups);
      }
    }, {
      key: "preload",
      value: function preload() {
        var classList = this.wrapper.classList;
        if (classList.contains('preloaded')) return;
        classList.add('preloaded');
        this.load('');
      }
      /**
       * Sets the input field of the control to the specified value.
       *
       */
    }, {
      key: "setTextboxValue",
      value: function setTextboxValue() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var input = this.control_input;
        var changed = input.value !== value;
        if (changed) {
          input.value = value;
          triggerEvent(input, 'update');
          this.lastValue = value;
        }
      }
      /**
       * Returns the value of the control. If multiple items
       * can be selected (e.g. <select multiple>), this returns
       * an array. If only one item can be selected, this
       * returns a string.
       *
       */
    }, {
      key: "getValue",
      value: function getValue() {
        if (this.is_select_tag && this.input.hasAttribute('multiple')) {
          return this.items;
        }
        return this.items.join(this.settings.delimiter);
      }
      /**
       * Resets the selected items to the given value.
       *
       */
    }, {
      key: "setValue",
      value: function setValue(value, silent) {
        var _this8 = this;
        var events = silent ? [] : ['change'];
        debounce_events(this, events, function () {
          _this8.clear(silent);
          _this8.addItems(value, silent);
        });
      }
      /**
       * Resets the number of max items to the given value
       *
       */
    }, {
      key: "setMaxItems",
      value: function setMaxItems(value) {
        if (value === 0) value = null; //reset to unlimited items.

        this.settings.maxItems = value;
        this.refreshState();
      }
      /**
       * Sets the selected item.
       *
       */
    }, {
      key: "setActiveItem",
      value: function setActiveItem(item, e) {
        var self = this;
        var eventName;
        var i, begin, end, swap;
        var last;
        if (self.settings.mode === 'single') return; // clear the active selection

        if (!item) {
          self.clearActiveItems();
          if (self.isFocused) {
            self.showInput();
          }
          return;
        } // modify selection

        eventName = e && e.type.toLowerCase();
        if (eventName === 'click' && isKeyDown('shiftKey', e) && self.activeItems.length) {
          last = self.getLastActive();
          begin = Array.prototype.indexOf.call(self.control.children, last);
          end = Array.prototype.indexOf.call(self.control.children, item);
          if (begin > end) {
            swap = begin;
            begin = end;
            end = swap;
          }
          for (i = begin; i <= end; i++) {
            item = self.control.children[i];
            if (self.activeItems.indexOf(item) === -1) {
              self.setActiveItemClass(item);
            }
          }
          preventDefault(e);
        } else if (eventName === 'click' && isKeyDown(KEY_SHORTCUT, e) || eventName === 'keydown' && isKeyDown('shiftKey', e)) {
          if (item.classList.contains('active')) {
            self.removeActiveItem(item);
          } else {
            self.setActiveItemClass(item);
          }
        } else {
          self.clearActiveItems();
          self.setActiveItemClass(item);
        } // ensure control has focus

        self.hideInput();
        if (!self.isFocused) {
          self.focus();
        }
      }
      /**
       * Set the active and last-active classes
       *
       */
    }, {
      key: "setActiveItemClass",
      value: function setActiveItemClass(item) {
        var self = this;
        var last_active = self.control.querySelector('.last-active');
        if (last_active) removeClasses(last_active, 'last-active');
        addClasses(item, 'active last-active');
        self.trigger('item_select', item);
        if (self.activeItems.indexOf(item) == -1) {
          self.activeItems.push(item);
        }
      }
      /**
       * Remove active item
       *
       */
    }, {
      key: "removeActiveItem",
      value: function removeActiveItem(item) {
        var idx = this.activeItems.indexOf(item);
        this.activeItems.splice(idx, 1);
        removeClasses(item, 'active');
      }
      /**
       * Clears all the active items
       *
       */
    }, {
      key: "clearActiveItems",
      value: function clearActiveItems() {
        removeClasses(this.activeItems, 'active');
        this.activeItems = [];
      }
      /**
       * Sets the selected item in the dropdown menu
       * of available options.
       *
       */
    }, {
      key: "setActiveOption",
      value: function setActiveOption(option) {
        var scroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (option === this.activeOption) {
          return;
        }
        this.clearActiveOption();
        if (!option) return;
        this.activeOption = option;
        setAttr(this.focus_node, {
          'aria-activedescendant': option.getAttribute('id')
        });
        setAttr(option, {
          'aria-selected': 'true'
        });
        addClasses(option, 'active');
        if (scroll) this.scrollToOption(option);
      }
      /**
       * Sets the dropdown_content scrollTop to display the option
       *
       */
    }, {
      key: "scrollToOption",
      value: function scrollToOption(option, behavior) {
        if (!option) return;
        var content = this.dropdown_content;
        var height_menu = content.clientHeight;
        var scrollTop = content.scrollTop || 0;
        var height_item = option.offsetHeight;
        var y = option.getBoundingClientRect().top - content.getBoundingClientRect().top + scrollTop;
        if (y + height_item > height_menu + scrollTop) {
          this.scroll(y - height_menu + height_item, behavior);
        } else if (y < scrollTop) {
          this.scroll(y, behavior);
        }
      }
      /**
       * Scroll the dropdown to the given position
       *
       */
    }, {
      key: "scroll",
      value: function scroll(scrollTop, behavior) {
        var content = this.dropdown_content;
        if (behavior) {
          content.style.scrollBehavior = behavior;
        }
        content.scrollTop = scrollTop;
        content.style.scrollBehavior = '';
      }
      /**
       * Clears the active option
       *
       */
    }, {
      key: "clearActiveOption",
      value: function clearActiveOption() {
        if (this.activeOption) {
          removeClasses(this.activeOption, 'active');
          setAttr(this.activeOption, {
            'aria-selected': null
          });
        }
        this.activeOption = null;
        setAttr(this.focus_node, {
          'aria-activedescendant': null
        });
      }
      /**
       * Selects all items (CTRL + A).
       */
    }, {
      key: "selectAll",
      value: function selectAll() {
        var self = this;
        if (self.settings.mode === 'single') return;
        var activeItems = self.controlChildren();
        if (!activeItems.length) return;
        self.hideInput();
        self.close();
        self.activeItems = activeItems;
        iterate$1(activeItems, function (item) {
          self.setActiveItemClass(item);
        });
      }
      /**
       * Determines if the control_input should be in a hidden or visible state
       *
       */
    }, {
      key: "inputState",
      value: function inputState() {
        var self = this;
        if (!self.control.contains(self.control_input)) return;
        setAttr(self.control_input, {
          placeholder: self.settings.placeholder
        });
        if (self.activeItems.length > 0 || !self.isFocused && self.settings.hidePlaceholder && self.items.length > 0) {
          self.setTextboxValue();
          self.isInputHidden = true;
        } else {
          if (self.settings.hidePlaceholder && self.items.length > 0) {
            setAttr(self.control_input, {
              placeholder: ''
            });
          }
          self.isInputHidden = false;
        }
        self.wrapper.classList.toggle('input-hidden', self.isInputHidden);
      }
      /**
       * Hides the input element out of view, while
       * retaining its focus.
       * @deprecated 1.3
       */
    }, {
      key: "hideInput",
      value: function hideInput() {
        this.inputState();
      }
      /**
       * Restores input visibility.
       * @deprecated 1.3
       */
    }, {
      key: "showInput",
      value: function showInput() {
        this.inputState();
      }
      /**
       * Get the input value
       */
    }, {
      key: "inputValue",
      value: function inputValue() {
        return this.control_input.value.trim();
      }
      /**
       * Gives the control focus.
       */
    }, {
      key: "focus",
      value: function focus() {
        var self = this;
        if (self.isDisabled) return;
        self.ignoreFocus = true;
        if (self.control_input.offsetWidth) {
          self.control_input.focus();
        } else {
          self.focus_node.focus();
        }
        setTimeout(function () {
          self.ignoreFocus = false;
          self.onFocus();
        }, 0);
      }
      /**
       * Forces the control out of focus.
       *
       */
    }, {
      key: "blur",
      value: function blur() {
        this.focus_node.blur();
        this.onBlur();
      }
      /**
       * Returns a function that scores an object
       * to show how good of a match it is to the
       * provided query.
       *
       * @return {function}
       */
    }, {
      key: "getScoreFunction",
      value: function getScoreFunction(query) {
        return this.sifter.getScoreFunction(query, this.getSearchOptions());
      }
      /**
       * Returns search options for sifter (the system
       * for scoring and sorting results).
       *
       * @see https://github.com/orchidjs/sifter.js
       * @return {object}
       */
    }, {
      key: "getSearchOptions",
      value: function getSearchOptions() {
        var settings = this.settings;
        var sort = settings.sortField;
        if (typeof settings.sortField === 'string') {
          sort = [{
            field: settings.sortField
          }];
        }
        return {
          fields: settings.searchField,
          conjunction: settings.searchConjunction,
          sort: sort,
          nesting: settings.nesting
        };
      }
      /**
       * Searches through available options and returns
       * a sorted array of matches.
       *
       */
    }, {
      key: "search",
      value: function search(query) {
        var result, calculateScore;
        var self = this;
        var options = this.getSearchOptions(); // validate user-provided result scoring function

        if (self.settings.score) {
          calculateScore = self.settings.score.call(self, query);
          if (typeof calculateScore !== 'function') {
            throw new Error('Tom Select "score" setting must be a function that returns a function');
          }
        } // perform search

        if (query !== self.lastQuery) {
          self.lastQuery = query;
          result = self.sifter.search(query, Object.assign(options, {
            score: calculateScore
          }));
          self.currentResults = result;
        } else {
          result = Object.assign({}, self.currentResults);
        } // filter out selected items

        if (self.settings.hideSelected) {
          result.items = result.items.filter(function (item) {
            var hashed = hash_key(item.id);
            return !(hashed && self.items.indexOf(hashed) !== -1);
          });
        }
        return result;
      }
      /**
       * Refreshes the list of available options shown
       * in the autocomplete dropdown menu.
       *
       */
    }, {
      key: "refreshOptions",
      value: function refreshOptions() {
        var triggerDropdown = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var i, j, k, n, optgroup, optgroups, html, has_create_option, active_group;
        var create;
        var groups = {};
        var groups_order = [];
        var self = this;
        var query = self.inputValue();
        var same_query = query === self.lastQuery || query == '' && self.lastQuery == null;
        var results = self.search(query);
        var active_option = null;
        var show_dropdown = self.settings.shouldOpen || false;
        var dropdown_content = self.dropdown_content;
        if (same_query) {
          active_option = self.activeOption;
          if (active_option) {
            active_group = active_option.closest('[data-group]');
          }
        } // build markup

        n = results.items.length;
        if (typeof self.settings.maxOptions === 'number') {
          n = Math.min(n, self.settings.maxOptions);
        }
        if (n > 0) {
          show_dropdown = true;
        } // render and group available options individually

        for (i = 0; i < n; i++) {
          // get option dom element
          var item = results.items[i];
          if (!item) continue;
          var opt_value = item.id;
          var option = self.options[opt_value];
          if (option === undefined) continue;
          var opt_hash = get_hash(opt_value);
          var option_el = self.getOption(opt_hash, true); // toggle 'selected' class

          if (!self.settings.hideSelected) {
            option_el.classList.toggle('selected', self.items.includes(opt_hash));
          }
          optgroup = option[self.settings.optgroupField] || '';
          optgroups = Array.isArray(optgroup) ? optgroup : [optgroup];
          for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
            optgroup = optgroups[j];
            if (!self.optgroups.hasOwnProperty(optgroup)) {
              optgroup = '';
            }
            var group_fragment = groups[optgroup];
            if (group_fragment === undefined) {
              group_fragment = document.createDocumentFragment();
              groups_order.push(optgroup);
            } // nodes can only have one parent, so if the option is in mutple groups, we need a clone

            if (j > 0) {
              option_el = option_el.cloneNode(true);
              setAttr(option_el, {
                id: option.$id + '-clone-' + j,
                'aria-selected': null
              });
              option_el.classList.add('ts-cloned');
              removeClasses(option_el, 'active'); // make sure we keep the activeOption in the same group

              if (self.activeOption && self.activeOption.dataset.value == opt_value) {
                if (active_group && active_group.dataset.group === optgroup.toString()) {
                  active_option = option_el;
                }
              }
            }
            group_fragment.appendChild(option_el);
            groups[optgroup] = group_fragment;
          }
        } // sort optgroups

        if (self.settings.lockOptgroupOrder) {
          groups_order.sort(function (a, b) {
            var grp_a = self.optgroups[a];
            var grp_b = self.optgroups[b];
            var a_order = grp_a && grp_a.$order || 0;
            var b_order = grp_b && grp_b.$order || 0;
            return a_order - b_order;
          });
        } // render optgroup headers & join groups

        html = document.createDocumentFragment();
        iterate$1(groups_order, function (optgroup) {
          var group_fragment = groups[optgroup];
          if (!group_fragment || !group_fragment.children.length) return;
          var group_heading = self.optgroups[optgroup];
          if (group_heading !== undefined) {
            var group_options = document.createDocumentFragment();
            var header = self.render('optgroup_header', group_heading);
            append(group_options, header);
            append(group_options, group_fragment);
            var group_html = self.render('optgroup', {
              group: group_heading,
              options: group_options
            });
            append(html, group_html);
          } else {
            append(html, group_fragment);
          }
        });
        dropdown_content.innerHTML = '';
        append(dropdown_content, html); // highlight matching terms inline

        if (self.settings.highlight) {
          removeHighlight(dropdown_content);
          if (results.query.length && results.tokens.length) {
            iterate$1(results.tokens, function (tok) {
              highlight(dropdown_content, tok.regex);
            });
          }
        } // helper method for adding templates to dropdown

        var add_template = function add_template(template) {
          var content = self.render(template, {
            input: query
          });
          if (content) {
            show_dropdown = true;
            dropdown_content.insertBefore(content, dropdown_content.firstChild);
          }
          return content;
        }; // add loading message

        if (self.loading) {
          add_template('loading'); // invalid query
        } else if (!self.settings.shouldLoad.call(self, query)) {
          add_template('not_loading'); // add no_results message
        } else if (results.items.length === 0) {
          add_template('no_results');
        } // add create option

        has_create_option = self.canCreate(query);
        if (has_create_option) {
          create = add_template('option_create');
        } // activate

        self.hasOptions = results.items.length > 0 || has_create_option;
        if (show_dropdown) {
          if (results.items.length > 0) {
            if (!active_option && self.settings.mode === 'single' && self.items[0] != undefined) {
              active_option = self.getOption(self.items[0]);
            }
            if (!dropdown_content.contains(active_option)) {
              var active_index = 0;
              if (create && !self.settings.addPrecedence) {
                active_index = 1;
              }
              active_option = self.selectable()[active_index];
            }
          } else if (create) {
            active_option = create;
          }
          if (triggerDropdown && !self.isOpen) {
            self.open();
            self.scrollToOption(active_option, 'auto');
          }
          self.setActiveOption(active_option);
        } else {
          self.clearActiveOption();
          if (triggerDropdown && self.isOpen) {
            self.close(false); // if create_option=null, we want the dropdown to close but not reset the textbox value
          }
        }
      }
      /**
       * Return list of selectable options
       *
       */
    }, {
      key: "selectable",
      value: function selectable() {
        return this.dropdown_content.querySelectorAll('[data-selectable]');
      }
      /**
       * Adds an available option. If it already exists,
       * nothing will happen. Note: this does not refresh
       * the options list dropdown (use `refreshOptions`
       * for that).
       *
       * Usage:
       *
       *   this.addOption(data)
       *
       */
    }, {
      key: "addOption",
      value: function addOption(data) {
        var user_created = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var self = this; // @deprecated 1.7.7
        // use addOptions( array, user_created ) for adding multiple options

        if (Array.isArray(data)) {
          self.addOptions(data, user_created);
          return false;
        }
        var key = hash_key(data[self.settings.valueField]);
        if (key === null || self.options.hasOwnProperty(key)) {
          return false;
        }
        data.$order = data.$order || ++self.order;
        data.$id = self.inputId + '-opt-' + data.$order;
        self.options[key] = data;
        self.lastQuery = null;
        if (user_created) {
          self.userOptions[key] = user_created;
          self.trigger('option_add', key, data);
        }
        return key;
      }
      /**
       * Add multiple options
       *
       */
    }, {
      key: "addOptions",
      value: function addOptions(data) {
        var _this9 = this;
        var user_created = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        iterate$1(data, function (dat) {
          _this9.addOption(dat, user_created);
        });
      }
      /**
       * @deprecated 1.7.7
       */
    }, {
      key: "registerOption",
      value: function registerOption(data) {
        return this.addOption(data);
      }
      /**
       * Registers an option group to the pool of option groups.
       *
       * @return {boolean|string}
       */
    }, {
      key: "registerOptionGroup",
      value: function registerOptionGroup(data) {
        var key = hash_key(data[this.settings.optgroupValueField]);
        if (key === null) return false;
        data.$order = data.$order || ++this.order;
        this.optgroups[key] = data;
        return key;
      }
      /**
       * Registers a new optgroup for options
       * to be bucketed into.
       *
       */
    }, {
      key: "addOptionGroup",
      value: function addOptionGroup(id, data) {
        var hashed_id;
        data[this.settings.optgroupValueField] = id;
        if (hashed_id = this.registerOptionGroup(data)) {
          this.trigger('optgroup_add', hashed_id, data);
        }
      }
      /**
       * Removes an existing option group.
       *
       */
    }, {
      key: "removeOptionGroup",
      value: function removeOptionGroup(id) {
        if (this.optgroups.hasOwnProperty(id)) {
          delete this.optgroups[id];
          this.clearCache();
          this.trigger('optgroup_remove', id);
        }
      }
      /**
       * Clears all existing option groups.
       */
    }, {
      key: "clearOptionGroups",
      value: function clearOptionGroups() {
        this.optgroups = {};
        this.clearCache();
        this.trigger('optgroup_clear');
      }
      /**
       * Updates an option available for selection. If
       * it is visible in the selected items or options
       * dropdown, it will be re-rendered automatically.
       *
       */
    }, {
      key: "updateOption",
      value: function updateOption(value, data) {
        var self = this;
        var item_new;
        var index_item;
        var value_old = hash_key(value);
        var value_new = hash_key(data[self.settings.valueField]); // sanity checks

        if (value_old === null) return;
        var data_old = self.options[value_old];
        if (data_old == undefined) return;
        if (typeof value_new !== 'string') throw new Error('Value must be set in option data');
        var option = self.getOption(value_old);
        var item = self.getItem(value_old);
        data.$order = data.$order || data_old.$order;
        delete self.options[value_old]; // invalidate render cache
        // don't remove existing node yet, we'll remove it after replacing it

        self.uncacheValue(value_new);
        self.options[value_new] = data; // update the option if it's in the dropdown

        if (option) {
          if (self.dropdown_content.contains(option)) {
            var option_new = self._render('option', data);
            replaceNode(option, option_new);
            if (self.activeOption === option) {
              self.setActiveOption(option_new);
            }
          }
          option.remove();
        } // update the item if we have one

        if (item) {
          index_item = self.items.indexOf(value_old);
          if (index_item !== -1) {
            self.items.splice(index_item, 1, value_new);
          }
          item_new = self._render('item', data);
          if (item.classList.contains('active')) addClasses(item_new, 'active');
          replaceNode(item, item_new);
        } // invalidate last query because we might have updated the sortField

        self.lastQuery = null;
      }
      /**
       * Removes a single option.
       *
       */
    }, {
      key: "removeOption",
      value: function removeOption(value, silent) {
        var self = this;
        value = get_hash(value);
        self.uncacheValue(value);
        delete self.userOptions[value];
        delete self.options[value];
        self.lastQuery = null;
        self.trigger('option_remove', value);
        self.removeItem(value, silent);
      }
      /**
       * Clears all options.
       */
    }, {
      key: "clearOptions",
      value: function clearOptions(filter) {
        var boundFilter = (filter || this.clearFilter).bind(this);
        this.loadedSearches = {};
        this.userOptions = {};
        this.clearCache();
        var selected = {};
        iterate$1(this.options, function (option, key) {
          if (boundFilter(option, key)) {
            selected[key] = option;
          }
        });
        this.options = this.sifter.items = selected;
        this.lastQuery = null;
        this.trigger('option_clear');
      }
      /**
       * Used by clearOptions() to decide whether or not an option should be removed
       * Return true to keep an option, false to remove
       *
       */
    }, {
      key: "clearFilter",
      value: function clearFilter(option, value) {
        if (this.items.indexOf(value) >= 0) {
          return true;
        }
        return false;
      }
      /**
       * Returns the dom element of the option
       * matching the given value.
       *
       */
    }, {
      key: "getOption",
      value: function getOption(value) {
        var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var hashed = hash_key(value);
        if (hashed === null) return null;
        var option = this.options[hashed];
        if (option != undefined) {
          if (option.$div) {
            return option.$div;
          }
          if (create) {
            return this._render('option', option);
          }
        }
        return null;
      }
      /**
       * Returns the dom element of the next or previous dom element of the same type
       * Note: adjacent options may not be adjacent DOM elements (optgroups)
       *
       */
    }, {
      key: "getAdjacent",
      value: function getAdjacent(option, direction) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'option';
        var self = this,
          all;
        if (!option) {
          return null;
        }
        if (type == 'item') {
          all = self.controlChildren();
        } else {
          all = self.dropdown_content.querySelectorAll('[data-selectable]');
        }
        for (var _i4 = 0; _i4 < all.length; _i4++) {
          if (all[_i4] != option) {
            continue;
          }
          if (direction > 0) {
            return all[_i4 + 1];
          }
          return all[_i4 - 1];
        }
        return null;
      }
      /**
       * Returns the dom element of the item
       * matching the given value.
       *
       */
    }, {
      key: "getItem",
      value: function getItem(item) {
        if (_typeof(item) == 'object') {
          return item;
        }
        var value = hash_key(item);
        return value !== null ? this.control.querySelector("[data-value=\"".concat(addSlashes(value), "\"]")) : null;
      }
      /**
       * "Selects" multiple items at once. Adds them to the list
       * at the current caret position.
       *
       */
    }, {
      key: "addItems",
      value: function addItems(values, silent) {
        var self = this;
        var items = Array.isArray(values) ? values : [values];
        items = items.filter(function (x) {
          return self.items.indexOf(x) === -1;
        });
        var last_item = items[items.length - 1];
        items.forEach(function (item) {
          self.isPending = item !== last_item;
          self.addItem(item, silent);
        });
      }
      /**
       * "Selects" an item. Adds it to the list
       * at the current caret position.
       *
       */
    }, {
      key: "addItem",
      value: function addItem(value, silent) {
        var _this10 = this;
        var events = silent ? [] : ['change', 'dropdown_close'];
        debounce_events(this, events, function () {
          var item, wasFull;
          var self = _this10;
          var inputMode = self.settings.mode;
          var hashed = hash_key(value);
          if (hashed && self.items.indexOf(hashed) !== -1) {
            if (inputMode === 'single') {
              self.close();
            }
            if (inputMode === 'single' || !self.settings.duplicates) {
              return;
            }
          }
          if (hashed === null || !self.options.hasOwnProperty(hashed)) return;
          if (inputMode === 'single') self.clear(silent);
          if (inputMode === 'multi' && self.isFull()) return;
          item = self._render('item', self.options[hashed]);
          if (self.control.contains(item)) {
            // duplicates
            item = item.cloneNode(true);
          }
          wasFull = self.isFull();
          self.items.splice(self.caretPos, 0, hashed);
          self.insertAtCaret(item);
          if (self.isSetup) {
            // update menu / remove the option (if this is not one item being added as part of series)
            if (!self.isPending && self.settings.hideSelected) {
              var option = self.getOption(hashed);
              var next = self.getAdjacent(option, 1);
              if (next) {
                self.setActiveOption(next);
              }
            } // refreshOptions after setActiveOption(),
            // otherwise setActiveOption() will be called by refreshOptions() with the wrong value

            if (!self.isPending && !self.settings.closeAfterSelect) {
              self.refreshOptions(self.isFocused && inputMode !== 'single');
            } // hide the menu if the maximum number of items have been selected or no options are left

            if (self.settings.closeAfterSelect != false && self.isFull()) {
              self.close();
            } else if (!self.isPending) {
              self.positionDropdown();
            }
            self.trigger('item_add', hashed, item);
            if (!self.isPending) {
              self.updateOriginalInput({
                silent: silent
              });
            }
          }
          if (!self.isPending || !wasFull && self.isFull()) {
            self.inputState();
            self.refreshState();
          }
        });
      }
      /**
       * Removes the selected item matching
       * the provided value.
       *
       */
    }, {
      key: "removeItem",
      value: function removeItem() {
        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var silent = arguments.length > 1 ? arguments[1] : undefined;
        var self = this;
        item = self.getItem(item);
        if (!item) return;
        var i, idx;
        var value = item.dataset.value;
        i = nodeIndex(item);
        item.remove();
        if (item.classList.contains('active')) {
          idx = self.activeItems.indexOf(item);
          self.activeItems.splice(idx, 1);
          removeClasses(item, 'active');
        }
        self.items.splice(i, 1);
        self.lastQuery = null;
        if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
          self.removeOption(value, silent);
        }
        if (i < self.caretPos) {
          self.setCaret(self.caretPos - 1);
        }
        self.updateOriginalInput({
          silent: silent
        });
        self.refreshState();
        self.positionDropdown();
        self.trigger('item_remove', value, item);
      }
      /**
       * Invokes the `create` method provided in the
       * TomSelect options that should provide the data
       * for the new item, given the user input.
       *
       * Once this completes, it will be added
       * to the item list.
       *
       */
    }, {
      key: "createItem",
      value: function createItem() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        // triggerDropdown parameter @deprecated 2.1.1
        if (arguments.length === 3) {
          callback = arguments[2];
        }
        if (typeof callback != 'function') {
          callback = function callback() {};
        }
        var self = this;
        var caret = self.caretPos;
        var output;
        input = input || self.inputValue();
        if (!self.canCreate(input)) {
          callback();
          return false;
        }
        self.lock();
        var created = false;
        var create = function create(data) {
          self.unlock();
          if (!data || _typeof(data) !== 'object') return callback();
          var value = hash_key(data[self.settings.valueField]);
          if (typeof value !== 'string') {
            return callback();
          }
          self.setTextboxValue();
          self.addOption(data, true);
          self.setCaret(caret);
          self.addItem(value);
          callback(data);
          created = true;
        };
        if (typeof self.settings.create === 'function') {
          output = self.settings.create.call(this, input, create);
        } else {
          var _output;
          output = (_output = {}, _defineProperty(_output, self.settings.labelField, input), _defineProperty(_output, self.settings.valueField, input), _output);
        }
        if (!created) {
          create(output);
        }
        return true;
      }
      /**
       * Re-renders the selected item lists.
       */
    }, {
      key: "refreshItems",
      value: function refreshItems() {
        var self = this;
        self.lastQuery = null;
        if (self.isSetup) {
          self.addItems(self.items);
        }
        self.updateOriginalInput();
        self.refreshState();
      }
      /**
       * Updates all state-dependent attributes
       * and CSS classes.
       */
    }, {
      key: "refreshState",
      value: function refreshState() {
        var self = this;
        self.refreshValidityState();
        var isFull = self.isFull();
        var isLocked = self.isLocked;
        self.wrapper.classList.toggle('rtl', self.rtl);
        var wrap_classList = self.wrapper.classList;
        wrap_classList.toggle('focus', self.isFocused);
        wrap_classList.toggle('disabled', self.isDisabled);
        wrap_classList.toggle('required', self.isRequired);
        wrap_classList.toggle('invalid', !self.isValid);
        wrap_classList.toggle('locked', isLocked);
        wrap_classList.toggle('full', isFull);
        wrap_classList.toggle('input-active', self.isFocused && !self.isInputHidden);
        wrap_classList.toggle('dropdown-active', self.isOpen);
        wrap_classList.toggle('has-options', isEmptyObject(self.options));
        wrap_classList.toggle('has-items', self.items.length > 0);
      }
      /**
       * Update the `required` attribute of both input and control input.
       *
       * The `required` property needs to be activated on the control input
       * for the error to be displayed at the right place. `required` also
       * needs to be temporarily deactivated on the input since the input is
       * hidden and can't show errors.
       */
    }, {
      key: "refreshValidityState",
      value: function refreshValidityState() {
        var self = this;
        if (!self.input.validity) {
          return;
        }
        self.isValid = self.input.validity.valid;
        self.isInvalid = !self.isValid;
      }
      /**
       * Determines whether or not more items can be added
       * to the control without exceeding the user-defined maximum.
       *
       * @returns {boolean}
       */
    }, {
      key: "isFull",
      value: function isFull() {
        return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
      }
      /**
       * Refreshes the original <select> or <input>
       * element to reflect the current state.
       *
       */
    }, {
      key: "updateOriginalInput",
      value: function updateOriginalInput() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var self = this;
        var option, label;
        var empty_option = self.input.querySelector('option[value=""]');
        if (self.is_select_tag) {
          var AddSelected = function AddSelected(option_el, value, label) {
            if (!option_el) {
              option_el = getDom('<option value="' + escape_html(value) + '">' + escape_html(label) + '</option>');
            } // don't move empty option from top of list
            // fixes bug in firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1725293

            if (option_el != empty_option) {
              self.input.append(option_el);
            }
            selected.push(option_el); // marking empty option as selected can break validation
            // fixes https://github.com/orchidjs/tom-select/issues/303

            if (option_el != empty_option || has_selected > 0) {
              option_el.selected = true;
            }
            return option_el;
          }; // unselect all selected options
          var selected = [];
          var has_selected = self.input.querySelectorAll('option:checked').length;
          self.input.querySelectorAll('option:checked').forEach(function (option_el) {
            option_el.selected = false;
          }); // nothing selected?

          if (self.items.length == 0 && self.settings.mode == 'single') {
            AddSelected(empty_option, "", ""); // order selected <option> tags for values in self.items
          } else {
            self.items.forEach(function (value) {
              option = self.options[value];
              label = option[self.settings.labelField] || '';
              if (selected.includes(option.$option)) {
                var reuse_opt = self.input.querySelector("option[value=\"".concat(addSlashes(value), "\"]:not(:checked)"));
                AddSelected(reuse_opt, value, label);
              } else {
                option.$option = AddSelected(option.$option, value, label);
              }
            });
          }
        } else {
          self.input.value = self.getValue();
        }
        if (self.isSetup) {
          if (!opts.silent) {
            self.trigger('change', self.getValue());
          }
        }
      }
      /**
       * Shows the autocomplete dropdown containing
       * the available options.
       */
    }, {
      key: "open",
      value: function open() {
        var self = this;
        if (self.isLocked || self.isOpen || self.settings.mode === 'multi' && self.isFull()) return;
        self.isOpen = true;
        setAttr(self.focus_node, {
          'aria-expanded': 'true'
        });
        self.refreshState();
        applyCSS(self.dropdown, {
          visibility: 'hidden',
          display: 'block'
        });
        self.positionDropdown();
        applyCSS(self.dropdown, {
          visibility: 'visible',
          display: 'block'
        });
        self.focus();
        self.trigger('dropdown_open', self.dropdown);
      }
      /**
       * Closes the autocomplete dropdown menu.
       */
    }, {
      key: "close",
      value: function close() {
        var setTextboxValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var self = this;
        var trigger = self.isOpen;
        if (setTextboxValue) {
          // before blur() to prevent form onchange event
          self.setTextboxValue();
          if (self.settings.mode === 'single' && self.items.length) {
            self.hideInput();
          }
        }
        self.isOpen = false;
        setAttr(self.focus_node, {
          'aria-expanded': 'false'
        });
        applyCSS(self.dropdown, {
          display: 'none'
        });
        if (self.settings.hideSelected) {
          self.clearActiveOption();
        }
        self.refreshState();
        if (trigger) self.trigger('dropdown_close', self.dropdown);
      }
      /**
       * Calculates and applies the appropriate
       * position of the dropdown if dropdownParent = 'body'.
       * Otherwise, position is determined by css
       */
    }, {
      key: "positionDropdown",
      value: function positionDropdown() {
        if (this.settings.dropdownParent !== 'body') {
          return;
        }
        var context = this.control;
        var rect = context.getBoundingClientRect();
        var top = context.offsetHeight + rect.top + window.scrollY;
        var left = rect.left + window.scrollX;
        applyCSS(this.dropdown, {
          width: rect.width + 'px',
          top: top + 'px',
          left: left + 'px'
        });
      }
      /**
       * Resets / clears all selected items
       * from the control.
       *
       */
    }, {
      key: "clear",
      value: function clear(silent) {
        var self = this;
        if (!self.items.length) return;
        var items = self.controlChildren();
        iterate$1(items, function (item) {
          self.removeItem(item, true);
        });
        self.showInput();
        if (!silent) self.updateOriginalInput();
        self.trigger('clear');
      }
      /**
       * A helper method for inserting an element
       * at the current caret position.
       *
       */
    }, {
      key: "insertAtCaret",
      value: function insertAtCaret(el) {
        var self = this;
        var caret = self.caretPos;
        var target = self.control;
        target.insertBefore(el, target.children[caret] || null);
        self.setCaret(caret + 1);
      }
      /**
       * Removes the current selected item(s).
       *
       */
    }, {
      key: "deleteSelection",
      value: function deleteSelection(e) {
        var direction, selection, caret, tail;
        var self = this;
        direction = e && e.keyCode === KEY_BACKSPACE ? -1 : 1;
        selection = getSelection(self.control_input); // determine items that will be removed

        var rm_items = [];
        if (self.activeItems.length) {
          tail = getTail(self.activeItems, direction);
          caret = nodeIndex(tail);
          if (direction > 0) {
            caret++;
          }
          iterate$1(self.activeItems, function (item) {
            return rm_items.push(item);
          });
        } else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
          var items = self.controlChildren();
          var rm_item;
          if (direction < 0 && selection.start === 0 && selection.length === 0) {
            rm_item = items[self.caretPos - 1];
          } else if (direction > 0 && selection.start === self.inputValue().length) {
            rm_item = items[self.caretPos];
          }
          if (rm_item !== undefined) {
            rm_items.push(rm_item);
          }
        }
        if (!self.shouldDelete(rm_items, e)) {
          return false;
        }
        preventDefault(e, true); // perform removal

        if (typeof caret !== 'undefined') {
          self.setCaret(caret);
        }
        while (rm_items.length) {
          self.removeItem(rm_items.pop());
        }
        self.showInput();
        self.positionDropdown();
        self.refreshOptions(false);
        return true;
      }
      /**
       * Return true if the items should be deleted
       */
    }, {
      key: "shouldDelete",
      value: function shouldDelete(items, evt) {
        var values = items.map(function (item) {
          return item.dataset.value;
        }); // allow the callback to abort

        if (!values.length || typeof this.settings.onDelete === 'function' && this.settings.onDelete(values, evt) === false) {
          return false;
        }
        return true;
      }
      /**
       * Selects the previous / next item (depending on the `direction` argument).
       *
       * > 0 - right
       * < 0 - left
       *
       */
    }, {
      key: "advanceSelection",
      value: function advanceSelection(direction, e) {
        var last_active,
          adjacent,
          self = this;
        if (self.rtl) direction *= -1;
        if (self.inputValue().length) return; // add or remove to active items

        if (isKeyDown(KEY_SHORTCUT, e) || isKeyDown('shiftKey', e)) {
          last_active = self.getLastActive(direction);
          if (last_active) {
            if (!last_active.classList.contains('active')) {
              adjacent = last_active;
            } else {
              adjacent = self.getAdjacent(last_active, direction, 'item');
            } // if no active item, get items adjacent to the control input
          } else if (direction > 0) {
            adjacent = self.control_input.nextElementSibling;
          } else {
            adjacent = self.control_input.previousElementSibling;
          }
          if (adjacent) {
            if (adjacent.classList.contains('active')) {
              self.removeActiveItem(last_active);
            }
            self.setActiveItemClass(adjacent); // mark as last_active !! after removeActiveItem() on last_active
          } // move caret to the left or right
        } else {
          self.moveCaret(direction);
        }
      }
    }, {
      key: "moveCaret",
      value: function moveCaret(direction) {}
      /**
       * Get the last active item
       *
       */
    }, {
      key: "getLastActive",
      value: function getLastActive(direction) {
        var last_active = this.control.querySelector('.last-active');
        if (last_active) {
          return last_active;
        }
        var result = this.control.querySelectorAll('.active');
        if (result) {
          return getTail(result, direction);
        }
      }
      /**
       * Moves the caret to the specified index.
       *
       * The input must be moved by leaving it in place and moving the
       * siblings, due to the fact that focus cannot be restored once lost
       * on mobile webkit devices
       *
       */
    }, {
      key: "setCaret",
      value: function setCaret(new_pos) {
        this.caretPos = this.items.length;
      }
      /**
       * Return list of item dom elements
       *
       */
    }, {
      key: "controlChildren",
      value: function controlChildren() {
        return Array.from(this.control.querySelectorAll('[data-ts-item]'));
      }
      /**
       * Disables user input on the control. Used while
       * items are being asynchronously created.
       */
    }, {
      key: "lock",
      value: function lock() {
        this.isLocked = true;
        this.refreshState();
      }
      /**
       * Re-enables user input on the control.
       */
    }, {
      key: "unlock",
      value: function unlock() {
        this.isLocked = false;
        this.refreshState();
      }
      /**
       * Disables user input on the control completely.
       * While disabled, it cannot receive focus.
       */
    }, {
      key: "disable",
      value: function disable() {
        var self = this;
        self.input.disabled = true;
        self.control_input.disabled = true;
        self.focus_node.tabIndex = -1;
        self.isDisabled = true;
        this.close();
        self.lock();
      }
      /**
       * Enables the control so that it can respond
       * to focus and user input.
       */
    }, {
      key: "enable",
      value: function enable() {
        var self = this;
        self.input.disabled = false;
        self.control_input.disabled = false;
        self.focus_node.tabIndex = self.tabIndex;
        self.isDisabled = false;
        self.unlock();
      }
      /**
       * Completely destroys the control and
       * unbinds all event listeners so that it can
       * be garbage collected.
       */
    }, {
      key: "destroy",
      value: function destroy() {
        var self = this;
        var revertSettings = self.revertSettings;
        self.trigger('destroy');
        self.off();
        self.wrapper.remove();
        self.dropdown.remove();
        self.input.innerHTML = revertSettings.innerHTML;
        self.input.tabIndex = revertSettings.tabIndex;
        removeClasses(self.input, 'tomselected', 'ts-hidden-accessible');
        self._destroy();
        delete self.input.tomselect;
      }
      /**
       * A helper method for rendering "item" and
       * "option" templates, given the data.
       *
       */
    }, {
      key: "render",
      value: function render(templateName, data) {
        var id, html;
        var self = this;
        if (typeof this.settings.render[templateName] !== 'function') {
          return null;
        } // render markup

        html = self.settings.render[templateName].call(this, data, escape_html);
        if (!html) {
          return null;
        }
        html = getDom(html); // add mandatory attributes

        if (templateName === 'option' || templateName === 'option_create') {
          if (data[self.settings.disabledField]) {
            setAttr(html, {
              'aria-disabled': 'true'
            });
          } else {
            setAttr(html, {
              'data-selectable': ''
            });
          }
        } else if (templateName === 'optgroup') {
          id = data.group[self.settings.optgroupValueField];
          setAttr(html, {
            'data-group': id
          });
          if (data.group[self.settings.disabledField]) {
            setAttr(html, {
              'data-disabled': ''
            });
          }
        }
        if (templateName === 'option' || templateName === 'item') {
          var value = get_hash(data[self.settings.valueField]);
          setAttr(html, {
            'data-value': value
          }); // make sure we have some classes if a template is overwritten

          if (templateName === 'item') {
            addClasses(html, self.settings.itemClass);
            setAttr(html, {
              'data-ts-item': ''
            });
          } else {
            addClasses(html, self.settings.optionClass);
            setAttr(html, {
              role: 'option',
              id: data.$id
            }); // update cache

            data.$div = html;
            self.options[value] = data;
          }
        }
        return html;
      }
      /**
       * Type guarded rendering
       *
       */
    }, {
      key: "_render",
      value: function _render(templateName, data) {
        var html = this.render(templateName, data);
        if (html == null) {
          throw 'HTMLElement expected';
        }
        return html;
      }
      /**
       * Clears the render cache for a template. If
       * no template is given, clears all render
       * caches.
       *
       */
    }, {
      key: "clearCache",
      value: function clearCache() {
        iterate$1(this.options, function (option) {
          if (option.$div) {
            option.$div.remove();
            delete option.$div;
          }
        });
      }
      /**
       * Removes a value from item and option caches
       *
       */
    }, {
      key: "uncacheValue",
      value: function uncacheValue(value) {
        var option_el = this.getOption(value);
        if (option_el) option_el.remove();
      }
      /**
       * Determines whether or not to display the
       * create item prompt, given a user input.
       *
       */
    }, {
      key: "canCreate",
      value: function canCreate(input) {
        return this.settings.create && input.length > 0 && this.settings.createFilter.call(this, input);
      }
      /**
       * Wraps this.`method` so that `new_fn` can be invoked 'before', 'after', or 'instead' of the original method
       *
       * this.hook('instead','onKeyDown',function( arg1, arg2 ...){
       *
       * });
       */
    }, {
      key: "hook",
      value: function hook(when, method, new_fn) {
        var self = this;
        var orig_method = self[method];
        self[method] = function () {
          var result, result_new;
          if (when === 'after') {
            result = orig_method.apply(self, arguments);
          }
          result_new = new_fn.apply(self, arguments);
          if (when === 'instead') {
            return result_new;
          }
          if (when === 'before') {
            result = orig_method.apply(self, arguments);
          }
          return result;
        };
      }
    }]);
    return TomSelect;
  }(MicroPlugin(MicroEvent));
  /**
   * Plugin: "change_listener" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function change_listener() {
    var _this11 = this;
    addEvent(this.input, 'change', function () {
      _this11.sync();
    });
  }

  /**
   * Plugin: "restore_on_backspace" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function checkbox_options() {
    var self = this;
    var orig_onOptionSelect = self.onOptionSelect;
    self.settings.hideSelected = false; // update the checkbox for an option

    var UpdateCheckbox = function UpdateCheckbox(option) {
      setTimeout(function () {
        var checkbox = option.querySelector('input');
        if (checkbox instanceof HTMLInputElement) {
          if (option.classList.contains('selected')) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }
        }
      }, 1);
    }; // add checkbox to option template

    self.hook('after', 'setupTemplates', function () {
      var orig_render_option = self.settings.render.option;
      self.settings.render.option = function (data, escape_html) {
        var rendered = getDom(orig_render_option.call(self, data, escape_html));
        var checkbox = document.createElement('input');
        checkbox.addEventListener('click', function (evt) {
          preventDefault(evt);
        });
        checkbox.type = 'checkbox';
        var hashed = hash_key(data[self.settings.valueField]);
        if (hashed && self.items.indexOf(hashed) > -1) {
          checkbox.checked = true;
        }
        rendered.prepend(checkbox);
        return rendered;
      };
    }); // uncheck when item removed

    self.on('item_remove', function (value) {
      var option = self.getOption(value);
      if (option) {
        // if dropdown hasn't been opened yet, the option won't exist
        option.classList.remove('selected'); // selected class won't be removed yet

        UpdateCheckbox(option);
      }
    }); // check when item added

    self.on('item_add', function (value) {
      var option = self.getOption(value);
      if (option) {
        // if dropdown hasn't been opened yet, the option won't exist
        UpdateCheckbox(option);
      }
    }); // remove items when selected option is clicked

    self.hook('instead', 'onOptionSelect', function (evt, option) {
      if (option.classList.contains('selected')) {
        option.classList.remove('selected');
        self.removeItem(option.dataset.value);
        self.refreshOptions();
        preventDefault(evt, true);
        return;
      }
      orig_onOptionSelect.call(self, evt, option);
      UpdateCheckbox(option);
    });
  }

  /**
   * Plugin: "dropdown_header" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function clear_button(userOptions) {
    var self = this;
    var options = Object.assign({
      className: 'clear-button',
      title: 'Clear All',
      html: function html(data) {
        return "<div class=\"".concat(data.className, "\" title=\"").concat(data.title, "\">&#10799;</div>");
      }
    }, userOptions);
    self.on('initialize', function () {
      var button = getDom(options.html(options));
      button.addEventListener('click', function (evt) {
        if (self.isDisabled) {
          return;
        }
        self.clear();
        if (self.settings.mode === 'single' && self.settings.allowEmptyOption) {
          self.addItem('');
        }
        evt.preventDefault();
        evt.stopPropagation();
      });
      self.control.appendChild(button);
    });
  }

  /**
   * Plugin: "drag_drop" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function drag_drop() {
    var self = this;
    if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
    if (self.settings.mode !== 'multi') return;
    var orig_lock = self.lock;
    var orig_unlock = self.unlock;
    self.hook('instead', 'lock', function () {
      var sortable = $(self.control).data('sortable');
      if (sortable) sortable.disable();
      return orig_lock.call(self);
    });
    self.hook('instead', 'unlock', function () {
      var sortable = $(self.control).data('sortable');
      if (sortable) sortable.enable();
      return orig_unlock.call(self);
    });
    self.on('initialize', function () {
      var $control = $(self.control).sortable({
        items: '[data-value]',
        forcePlaceholderSize: true,
        disabled: self.isLocked,
        start: function start(e, ui) {
          ui.placeholder.css('width', ui.helper.css('width'));
          $control.css({
            overflow: 'visible'
          });
        },
        stop: function stop() {
          $control.css({
            overflow: 'hidden'
          });
          var values = [];
          $control.children('[data-value]').each(function () {
            if (this.dataset.value) values.push(this.dataset.value);
          });
          self.setValue(values);
        }
      });
    });
  }

  /**
   * Plugin: "dropdown_header" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function dropdown_header(userOptions) {
    var self = this;
    var options = Object.assign({
      title: 'Untitled',
      headerClass: 'dropdown-header',
      titleRowClass: 'dropdown-header-title',
      labelClass: 'dropdown-header-label',
      closeClass: 'dropdown-header-close',
      html: function html(data) {
        return '<div class="' + data.headerClass + '">' + '<div class="' + data.titleRowClass + '">' + '<span class="' + data.labelClass + '">' + data.title + '</span>' + '<a class="' + data.closeClass + '">&times;</a>' + '</div>' + '</div>';
      }
    }, userOptions);
    self.on('initialize', function () {
      var header = getDom(options.html(options));
      var close_link = header.querySelector('.' + options.closeClass);
      if (close_link) {
        close_link.addEventListener('click', function (evt) {
          preventDefault(evt, true);
          self.close();
        });
      }
      self.dropdown.insertBefore(header, self.dropdown.firstChild);
    });
  }

  /**
   * Plugin: "dropdown_input" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function caret_position() {
    var self = this;
    /**
     * Moves the caret to the specified index.
     *
     * The input must be moved by leaving it in place and moving the
     * siblings, due to the fact that focus cannot be restored once lost
     * on mobile webkit devices
     *
     */

    self.hook('instead', 'setCaret', function (new_pos) {
      if (self.settings.mode === 'single' || !self.control.contains(self.control_input)) {
        new_pos = self.items.length;
      } else {
        new_pos = Math.max(0, Math.min(self.items.length, new_pos));
        if (new_pos != self.caretPos && !self.isPending) {
          self.controlChildren().forEach(function (child, j) {
            if (j < new_pos) {
              self.control_input.insertAdjacentElement('beforebegin', child);
            } else {
              self.control.appendChild(child);
            }
          });
        }
      }
      self.caretPos = new_pos;
    });
    self.hook('instead', 'moveCaret', function (direction) {
      if (!self.isFocused) return; // move caret before or after selected items

      var last_active = self.getLastActive(direction);
      if (last_active) {
        var idx = nodeIndex(last_active);
        self.setCaret(direction > 0 ? idx + 1 : idx);
        self.setActiveItem();
        removeClasses(last_active, 'last-active'); // move caret left or right of current position
      } else {
        self.setCaret(self.caretPos + direction);
      }
    });
  }

  /**
   * Plugin: "dropdown_input" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function dropdown_input() {
    var self = this;
    self.settings.shouldOpen = true; // make sure the input is shown even if there are no options to display in the dropdown

    self.hook('before', 'setup', function () {
      self.focus_node = self.control;
      addClasses(self.control_input, 'dropdown-input');
      var div = getDom('<div class="dropdown-input-wrap">');
      div.append(self.control_input);
      self.dropdown.insertBefore(div, self.dropdown.firstChild); // set a placeholder in the select control

      var placeholder = getDom('<input class="items-placeholder" tabindex="-1" />');
      placeholder.placeholder = self.settings.placeholder || '';
      self.control.append(placeholder);
    });
    self.on('initialize', function () {
      // set tabIndex on control to -1, otherwise [shift+tab] will put focus right back on control_input
      self.control_input.addEventListener('keydown', function (evt) {
        //addEvent(self.control_input,'keydown' as const,(evt:KeyboardEvent) =>{
        switch (evt.keyCode) {
          case KEY_ESC:
            if (self.isOpen) {
              preventDefault(evt, true);
              self.close();
            }
            self.clearActiveItems();
            return;
          case KEY_TAB:
            self.focus_node.tabIndex = -1;
            break;
        }
        return self.onKeyDown.call(self, evt);
      });
      self.on('blur', function () {
        self.focus_node.tabIndex = self.isDisabled ? -1 : self.tabIndex;
      }); // give the control_input focus when the dropdown is open

      self.on('dropdown_open', function () {
        self.control_input.focus();
      }); // prevent onBlur from closing when focus is on the control_input

      var orig_onBlur = self.onBlur;
      self.hook('instead', 'onBlur', function (evt) {
        if (evt && evt.relatedTarget == self.control_input) return;
        return orig_onBlur.call(self);
      });
      addEvent(self.control_input, 'blur', function () {
        return self.onBlur();
      }); // return focus to control to allow further keyboard input

      self.hook('before', 'close', function () {
        if (!self.isOpen) return;
        self.focus_node.focus({
          preventScroll: true
        });
      });
    });
  }

  /**
   * Plugin: "input_autogrow" (Tom Select)
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function input_autogrow() {
    var self = this;
    self.on('initialize', function () {
      var test_input = document.createElement('span');
      var control = self.control_input;
      test_input.style.cssText = 'position:absolute; top:-99999px; left:-99999px; width:auto; padding:0; white-space:pre; ';
      self.wrapper.appendChild(test_input);
      var transfer_styles = ['letterSpacing', 'fontSize', 'fontFamily', 'fontWeight', 'textTransform'];
      for (var _i5 = 0, _transfer_styles = transfer_styles; _i5 < _transfer_styles.length; _i5++) {
        var style_name = _transfer_styles[_i5];
        // @ts-ignore TS7015 https://stackoverflow.com/a/50506154/697576
        test_input.style[style_name] = control.style[style_name];
      }
      /**
       * Set the control width
       *
       */

      var resize = function resize() {
        test_input.textContent = control.value;
        control.style.width = test_input.clientWidth + 'px';
      };
      resize();
      self.on('update item_add item_remove', resize);
      addEvent(control, 'input', resize);
      addEvent(control, 'keyup', resize);
      addEvent(control, 'blur', resize);
      addEvent(control, 'update', resize);
    });
  }

  /**
   * Plugin: "input_autogrow" (Tom Select)
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function no_backspace_delete() {
    var self = this;
    var orig_deleteSelection = self.deleteSelection;
    this.hook('instead', 'deleteSelection', function (evt) {
      if (self.activeItems.length) {
        return orig_deleteSelection.call(self, evt);
      }
      return false;
    });
  }

  /**
   * Plugin: "no_active_items" (Tom Select)
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function no_active_items() {
    this.hook('instead', 'setActiveItem', function () {});
    this.hook('instead', 'selectAll', function () {});
  }

  /**
   * Plugin: "optgroup_columns" (Tom Select.js)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function optgroup_columns() {
    var self = this;
    var orig_keydown = self.onKeyDown;
    self.hook('instead', 'onKeyDown', function (evt) {
      var index, option, options, optgroup;
      if (!self.isOpen || !(evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT)) {
        return orig_keydown.call(self, evt);
      }
      self.ignoreHover = true;
      optgroup = parentMatch(self.activeOption, '[data-group]');
      index = nodeIndex(self.activeOption, '[data-selectable]');
      if (!optgroup) {
        return;
      }
      if (evt.keyCode === KEY_LEFT) {
        optgroup = optgroup.previousSibling;
      } else {
        optgroup = optgroup.nextSibling;
      }
      if (!optgroup) {
        return;
      }
      options = optgroup.querySelectorAll('[data-selectable]');
      option = options[Math.min(options.length - 1, index)];
      if (option) {
        self.setActiveOption(option);
      }
    });
  }

  /**
   * Plugin: "remove_button" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function remove_button(userOptions) {
    var options = Object.assign({
      label: '&times;',
      title: 'Remove',
      className: 'remove',
      append: true
    }, userOptions); //options.className = 'remove-single';

    var self = this; // override the render method to add remove button to each item

    if (!options.append) {
      return;
    }
    var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
    self.hook('after', 'setupTemplates', function () {
      var orig_render_item = self.settings.render.item;
      self.settings.render.item = function (data, escape) {
        var item = getDom(orig_render_item.call(self, data, escape));
        var close_button = getDom(html);
        item.appendChild(close_button);
        addEvent(close_button, 'mousedown', function (evt) {
          preventDefault(evt, true);
        });
        addEvent(close_button, 'click', function (evt) {
          // propagating will trigger the dropdown to show for single mode
          preventDefault(evt, true);
          if (self.isLocked) return;
          if (!self.shouldDelete([item], evt)) return;
          self.removeItem(item);
          self.refreshOptions(false);
          self.inputState();
        });
        return item;
      };
    });
  }

  /**
   * Plugin: "restore_on_backspace" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function restore_on_backspace(userOptions) {
    var self = this;
    var options = Object.assign({
      text: function text(option) {
        return option[self.settings.labelField];
      }
    }, userOptions);
    self.on('item_remove', function (value) {
      if (!self.isFocused) {
        return;
      }
      if (self.control_input.value.trim() === '') {
        var option = self.options[value];
        if (option) {
          self.setTextboxValue(options.text.call(self, option));
        }
      }
    });
  }

  /**
   * Plugin: "restore_on_backspace" (Tom Select)
   * Copyright (c) contributors
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
   * file except in compliance with the License. You may obtain a copy of the License at:
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
   * ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   *
   */
  function virtual_scroll() {
    var self = this;
    var orig_canLoad = self.canLoad;
    var orig_clearActiveOption = self.clearActiveOption;
    var orig_loadCallback = self.loadCallback;
    var pagination = {};
    var dropdown_content;
    var loading_more = false;
    var load_more_opt;
    var default_values = [];
    if (!self.settings.shouldLoadMore) {
      // return true if additional results should be loaded
      self.settings.shouldLoadMore = function () {
        var scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);
        if (scroll_percent > 0.9) {
          return true;
        }
        if (self.activeOption) {
          var selectable = self.selectable();
          var index = Array.from(selectable).indexOf(self.activeOption);
          if (index >= selectable.length - 2) {
            return true;
          }
        }
        return false;
      };
    }
    if (!self.settings.firstUrl) {
      throw 'virtual_scroll plugin requires a firstUrl() method';
    } // in order for virtual scrolling to work,
    // options need to be ordered the same way they're returned from the remote data source

    self.settings.sortField = [{
      field: '$order'
    }, {
      field: '$score'
    }]; // can we load more results for given query?

    var canLoadMore = function canLoadMore(query) {
      if (typeof self.settings.maxOptions === 'number' && dropdown_content.children.length >= self.settings.maxOptions) {
        return false;
      }
      if (query in pagination && pagination[query]) {
        return true;
      }
      return false;
    };
    var clearFilter = function clearFilter(option, value) {
      if (self.items.indexOf(value) >= 0 || default_values.indexOf(value) >= 0) {
        return true;
      }
      return false;
    }; // set the next url that will be

    self.setNextUrl = function (value, next_url) {
      pagination[value] = next_url;
    }; // getUrl() to be used in settings.load()

    self.getUrl = function (query) {
      if (query in pagination) {
        var next_url = pagination[query];
        pagination[query] = false;
        return next_url;
      } // if the user goes back to a previous query
      // we need to load the first page again

      pagination = {};
      return self.settings.firstUrl.call(self, query);
    }; // don't clear the active option (and cause unwanted dropdown scroll)
    // while loading more results

    self.hook('instead', 'clearActiveOption', function () {
      if (loading_more) {
        return;
      }
      return orig_clearActiveOption.call(self);
    }); // override the canLoad method

    self.hook('instead', 'canLoad', function (query) {
      // first time the query has been seen
      if (!(query in pagination)) {
        return orig_canLoad.call(self, query);
      }
      return canLoadMore(query);
    }); // wrap the load

    self.hook('instead', 'loadCallback', function (options, optgroups) {
      if (!loading_more) {
        self.clearOptions(clearFilter);
      } else if (load_more_opt) {
        var first_option = options[0];
        if (first_option !== undefined) {
          load_more_opt.dataset.value = first_option[self.settings.valueField];
        }
      }
      orig_loadCallback.call(self, options, optgroups);
      loading_more = false;
    }); // add templates to dropdown
    //	loading_more if we have another url in the queue
    //	no_more_results if we don't have another url in the queue

    self.hook('after', 'refreshOptions', function () {
      var query = self.lastValue;
      var option;
      if (canLoadMore(query)) {
        option = self.render('loading_more', {
          query: query
        });
        if (option) {
          option.setAttribute('data-selectable', ''); // so that navigating dropdown with [down] keypresses can navigate to this node

          load_more_opt = option;
        }
      } else if (query in pagination && !dropdown_content.querySelector('.no-results')) {
        option = self.render('no_more_results', {
          query: query
        });
      }
      if (option) {
        addClasses(option, self.settings.optionClass);
        dropdown_content.append(option);
      }
    }); // add scroll listener and default templates

    self.on('initialize', function () {
      default_values = Object.keys(self.options);
      dropdown_content = self.dropdown_content; // default templates

      self.settings.render = Object.assign({}, {
        loading_more: function loading_more() {
          return "<div class=\"loading-more-results\">Loading more results ... </div>";
        },
        no_more_results: function no_more_results() {
          return "<div class=\"no-more-results\">No more results</div>";
        }
      }, self.settings.render); // watch dropdown content scroll position

      dropdown_content.addEventListener('scroll', function () {
        if (!self.settings.shouldLoadMore.call(self)) {
          return;
        } // !important: this will get checked again in load() but we still need to check here otherwise loading_more will be set to true

        if (!canLoadMore(self.lastValue)) {
          return;
        } // don't call load() too much

        if (loading_more) return;
        loading_more = true;
        self.load.call(self, self.lastValue);
      });
    });
  }
  TomSelect.define('change_listener', change_listener);
  TomSelect.define('checkbox_options', checkbox_options);
  TomSelect.define('clear_button', clear_button);
  TomSelect.define('drag_drop', drag_drop);
  TomSelect.define('dropdown_header', dropdown_header);
  TomSelect.define('caret_position', caret_position);
  TomSelect.define('dropdown_input', dropdown_input);
  TomSelect.define('input_autogrow', input_autogrow);
  TomSelect.define('no_backspace_delete', no_backspace_delete);
  TomSelect.define('no_active_items', no_active_items);
  TomSelect.define('optgroup_columns', optgroup_columns);
  TomSelect.define('remove_button', remove_button);
  TomSelect.define('restore_on_backspace', restore_on_backspace);
  TomSelect.define('virtual_scroll', virtual_scroll);
  return TomSelect;
});
var tomSelect = function tomSelect(el, opts) {
  return new TomSelect(el, opts);
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/* eslint-disable no-new, no-unused-vars, camelcase, eqeqeq */
/* globals TomSelect */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    // If we use this component in a traditional non-vue-based form, we need to
    // have a name for the input field. This controls that. Can be safely left blank
    // if you're just using this in Vue w/v-model
    name: {
      type: String
    },
    // Do we want our input/select to have any custom classes?
    cssClasses: {
      type: Array
    },
    // The value of whatever item we're selecting, be it user ID, page ID, array of page IDs, etc...
    value: {
      type: [Array, String, Number]
    },
    // The URL used to search
    dataSourceUrl: {
      type: String,
      required: true
    },
    // The selected options URL
    selectedOptionsUrl: {
      type: String,
      required: true
    },
    // The data sent to the server with every request. Paired with an access token to ensure
    // that only authorized requests are responded to.
    formData: {
      type: Object,
      required: true
    },
    // Used to authorize requests
    accessToken: {
      type: String,
      required: true
    },
    // Whether to include the remove button on each selected item
    removeButton: {
      type: Boolean,
      required: false,
      "default": false
    },
    maxItems: {
      required: false,
      "default": 1
    },
    allowCreate: {
      type: Boolean,
      required: false,
      "default": false
    }
  },
  data: function data() {
    return {};
  },
  mounted: function mounted() {
    var my = this;
    var config = {
      maxOptions: null,
      maxItems: my.maxItems,
      searchField: 'primary_label',
      labelField: 'primary_label',
      valueField: 'id',
      load: function load(query, callback) {
        var formData = my.getFormData();
        formData.append('query', query);
        var url = my.dataSourceUrl;
        fetch(url, {
          method: 'POST',
          body: formData
        }).then(function (response) {
          return response.json();
        }).then(function (json) {
          callback(json);
        })["catch"](function () {
          callback();
        });
      },
      render: {
        option: function option(item, escape) {
          return typeof my.$parent.renderOption === 'function' ? my.$parent.renderOption(item) : my.renderOption(item);
        },
        item: function item(_item, escape) {
          return typeof my.$parent.renderItem === 'function' ? my.$parent.renderItem(_item) : my.renderItem(_item);
        }
      }
    };
    if (this.removeButton) {
      config.plugins = ['remove_button'];
    }
    if (!this.maxItems) {
      config.onItemAdd = function () {
        // Without this method, Tom Select persists the search string even after we search for something,
        // requiring us to delete the string in order to continue searching for something else - it's kind
        // of annoying. it only seems to be a problem in multi-select mode ?!
        this.setTextboxValue('');
        this.refreshOptions();
      };
    }
    if (this.allowCreate) {
      config.createOnBlur = true;
      config.create = true;
    }
    my.select = new TomSelect(this.$el, config);
    my.select.on('change', function (value) {
      my.$emit('change', value);
    });
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        var my = this;
        if (my.value) {
          var formData = my.getFormData();
          var url = my.selectedOptionsUrl;
          fetch(url, {
            method: 'POST',
            body: formData
          }).then(function (response) {
            return response.json();
          }).then(function (json) {
            json.forEach(function (item) {
              my.select.addOption(item);
              my.select.addItem(item.id);
            });
          })["catch"](function () {});
        }
      }
    }
  },
  methods: {
    getFormData: function getFormData() {
      var formData = new FormData();
      var _loop = function _loop() {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        if (Array.isArray(value)) {
          // Multi-select, as in the case of ConcreteExpressEntrySelect, etc...
          value.forEach(function (thisValue) {
            formData.append(key + '[]', thisValue);
          });
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? 1 : 0);
        } else {
          formData.append(key, value);
        }
      };
      for (var _i = 0, _Object$entries = Object.entries(this.formData); _i < _Object$entries.length; _i++) {
        _loop();
      }
      formData.append('accessToken', this.accessToken);
      return formData;
    },
    renderOption: function renderOption(item) {
      return "<div>".concat(item.primary_label, "</div>");
    },
    renderItem: function renderItem(item) {
      return "<div>".concat(item.primary_label, "</div>");
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ConcreteAjaxSelect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConcreteAjaxSelect */ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue");
/* eslint-disable no-new, no-unused-vars, camelcase, eqeqeq */
/* globals TomSelect */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    ConcreteAjaxSelect: _ConcreteAjaxSelect__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  prop: ['userId'],
  model: {
    prop: 'userId',
    event: 'change'
  },
  props: {
    includeAvatar: {
      type: Boolean,
      "default": false
    },
    labelFormat: {
      type: String,
      "default": 'auto'
    },
    accessToken: {
      type: String,
      required: true
    },
    inputName: {
      type: String
    },
    userId: {
      type: [Number, String, Array],
      required: false
    }
  },
  computed: {
    formData: function formData() {
      return {
        labelFormat: this.labelFormat,
        includeAvatar: this.includeAvatar,
        userId: this.userId
      };
    }
  },
  data: function data() {
    return {
      dataSourceUrl: CCM_DISPATCHER_FILENAME + '/ccm/system/user/autocomplete',
      selectedOptionsUrl: CCM_DISPATCHER_FILENAME + '/ccm/system/user/autocomplete/get_selected',
      selectedUserId: null
    };
  },
  watch: {
    userId: {
      immediate: true,
      handler: function handler(userId) {
        this.selectedUserId = userId;
      }
    }
  },
  methods: {
    updateSelected: function updateSelected(value) {
      this.selectedUserId = value;
      this.$emit('change', this.selectedUserId);
    },
    renderOption: function renderOption(item) {
      var option = '<div>';
      if (item.avatar) {
        option += "<div class=\"ccm-form-select-user-avatar\">\n                                <img src=\"".concat(item.avatar, "\"/>\n                           </div>");
      }
      option += '<div>';
      option += "<div class=\"ccm-form-select-user-label-primary\">\n                            ".concat(escape(item.primary_label), "\n                       </div>");
      if (item.secondary_label) {
        option += "<div class=\"ccm-form-select-user-label-secondary text-secondary\">\n                               ".concat(escape(item.secondary_label), "\n                           </div>");
      }
      option += '</div>';
      option += '</div>';
      return option;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.maxItems == 1 ? _c("input", {
    "class": _vm.cssClasses,
    attrs: {
      name: _vm.name
    }
  }) : _c("select", {
    "class": _vm.cssClasses,
    attrs: {
      multiple: "",
      name: _vm.name
    }
  });
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=template&id=5235e8e3&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=template&id=5235e8e3& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("concrete-ajax-select", {
    attrs: {
      name: _vm.inputName,
      "access-token": _vm.accessToken,
      "css-classes": ["ccm-form-select-user"],
      "data-source-url": _vm.dataSourceUrl,
      "selected-options-url": _vm.selectedOptionsUrl,
      value: _vm.userId,
      "form-data": _vm.formData
    },
    on: {
      change: _vm.updateSelected
    }
  });
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./assets/dialogs/js/confirm.js":
/*!**************************************!*\
  !*** ./assets/dialogs/js/confirm.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function (options) {
  // ccmi18n_community

  var defaults = {
    i18n: {
      title: ccmi18n_community.confirm,
      message: ccmi18n_community.confirm,
      cancelButton: ccmi18n_community.cancelButton,
      confirmButton: ccmi18n_community.okayButton
    }
  };
  options = $.extend(defaults, options);
  var tpl = __webpack_require__(/*! ../html/confirm.html */ "./assets/dialogs/html/confirm.html");
  var id = Math.random().toString(36).substr(2, 9);
  var $container = $(".ccm-page");
  var html = tpl({
    id: id,
    i18n: options.i18n
  });
  var $html = $(html);
  $container.append($html);
  var $modalDialog = $container.find("#ccm-confirm-dialog-" + id);
  $modalDialog.find(".btn-secondary, .close").click(function (e) {
    e.preventDefault();
    $modalDialog.modal('hide');
    $modalDialog.remove();
    return false;
  });
  var modal = new bootstrap.Modal('#' + $modalDialog.attr('id'));
  modal.show();
  $html.find(".btn-primary").click(function () {
    $modalDialog.modal("hide");
    $modalDialog.remove();
    if (typeof options.onConfirm === "function") {
      options.onConfirm();
    }
  });
  $modalDialog.modal();
});

/***/ }),

/***/ "./assets/themes/concrete_cms/js/main.js":
/*!***********************************************!*\
  !*** ./assets/themes/concrete_cms/js/main.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _concretecms_bedrock_assets_bedrock_js_frontend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @concretecms/bedrock/assets/bedrock/js/frontend */ "./node_modules/@concretecms/bedrock/assets/bedrock/js/frontend.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ "./node_modules/underscore/modules/index-all.js");
/* harmony import */ var tom_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tom-select */ "./node_modules/tom-select/dist/js/tom-select.complete.js");
/* harmony import */ var tom_select__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tom_select__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _concretecms_bedrock_assets_imagery_js_frontend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @concretecms/bedrock/assets/imagery/js/frontend */ "./node_modules/@concretecms/bedrock/assets/imagery/js/frontend.js");
/* harmony import */ var _pnotify_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @pnotify/core */ "./node_modules/@pnotify/core/dist/PNotify.js");
/* harmony import */ var _pnotify_core__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_pnotify_core__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnotify/bootstrap4 */ "./node_modules/@pnotify/bootstrap4/dist/PNotifyBootstrap4.js");
/* harmony import */ var _pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_ComposePrivateMessage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/ComposePrivateMessage */ "./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue");
/* harmony import */ var _dialogs_js_confirm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../dialogs/js/confirm */ "./assets/dialogs/js/confirm.js");
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}



// Yet another autocomplete/comboxbox library

window.TomSelect = (tom_select__WEBPACK_IMPORTED_MODULE_2___default());



_pnotify_core__WEBPACK_IMPORTED_MODULE_4__.defaultModules.set(_pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_5__, {});

$(function () {
  window.Concrete.Vue.createContext('frontend', {
    ComposePrivateMessage: _components_ComposePrivateMessage__WEBPACK_IMPORTED_MODULE_6__["default"]
  }, 'frontend');
});
var stackBottomModal = new _pnotify_core__WEBPACK_IMPORTED_MODULE_4__.Stack({
  dir1: 'up',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  push: 'top',
  maxOpen: 5,
  modal: false,
  overlayClose: false,
  context: $('body').get(0)
});

// Custom assets


// Theme stuff
$("#ccm-toggle-mobile-nav").click(function (e) {
  e.preventDefault();
  var activeClass = "is-active";
  if ($(this).hasClass(activeClass)) {
    $(this).removeClass(activeClass);
  } else {
    $(this).addClass(activeClass);
  }
});
window.asyncConfirm = _dialogs_js_confirm__WEBPACK_IMPORTED_MODULE_7__["default"];

/*
 * Message bulk actions
 */

$("#ccm-select-all-messages").change(function (e) {
  e.preventDefault();
  if ($(this).is(":checked")) {
    $(".ccm-message-item").prop("checked", true);
    $("#ccm-messages-bulk-action-select-all").addClass("d-none");
    $("#ccm-messages-bulk-action-unselect-all").removeClass("d-none");
  } else {
    $(".ccm-message-item").prop("checked", false);
    $("#ccm-messages-bulk-action-select-all").removeClass("d-none");
    $("#ccm-messages-bulk-action-unselect-all").addClass("d-none");
  }
  if ($(".ccm-message-item:checked").length) {
    $(".bulk-action-item").removeClass("disabled");
  } else {
    $(".bulk-action-item").addClass("disabled");
  }
});
$(".ccm-message-item").change(function (e) {
  e.preventDefault();
  if ($(".ccm-message-item:not(:checked)").length) {
    $("#ccm-select-all-messages").prop("checked", false);
    $("#ccm-messages-bulk-action-select-all").removeClass("d-none");
    $("#ccm-messages-bulk-action-unselect-all").addClass("d-none");
  } else {
    $("#ccm-select-all-messages").prop("checked", true);
    $("#ccm-messages-bulk-action-select-all").addClass("d-none");
    $("#ccm-messages-bulk-action-unselect-all").removeClass("d-none");
  }
  if ($(".ccm-message-item:checked").length) {
    $(".bulk-action-item").removeClass("disabled");
  } else {
    $(".bulk-action-item").addClass("disabled");
  }
});
$("#ccm-messages-bulk-action-unselect-all").click(function (e) {
  e.preventDefault();
  $("#ccm-select-all-messages").prop("checked", false).trigger("change");
});
$("#ccm-messages-bulk-action-select-all").click(function (e) {
  e.preventDefault();
  $("#ccm-select-all-messages").prop("checked", true).trigger("change");
});
$(".bulk-action-item").click(function (e) {
  e.preventDefault();
  var messageIds = [];
  $(".ccm-message-item:checked").each(function () {
    messageIds.push($(this).val());
  });
  $.ajax({
    url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/" + $(this).data("action"),
    method: "POST",
    data: {
      ccm_token: $(this).data('token'),
      messageIds: messageIds,
      box: $("input[name='box']").val()
    },
    success: function success(data) {
      if (data.error) {
        for (var i = 0; i < data.errors.length; i++) {
          var errorMessage = data.errors[i];
          (0,_pnotify_core__WEBPACK_IMPORTED_MODULE_4__.alert)({
            text: errorMessage,
            stack: stackBottomModal,
            type: 'error'
          });
        }
      } else {
        window.location = window.location.href.split("?")[0];
      }
    }
  });
});

/*
 * Public Profile stuff
 */

var mediumBreakpoint = 991;
$(".hidden-awards").click(function () {
  $(".hidden-award").removeClass("hidden-award");
  $(this).addClass("hidden");
  $(window).trigger("resize");
});
$(".hidden-achievements").click(function () {
  $(".hidden-achievement").removeClass("hidden-achievement");
  $(this).addClass("hidden");
  $(window).trigger("resize");
});
$(".alert-new-badge .close").click(function () {
  var grantedAwardId = $(this).parent().data("awardGrantId");
  $.ajax({
    url: CCM_DISPATCHER_FILENAME + "/api/v1/community_badges/dismiss_grant_award",
    method: "POST",
    data: {
      grantedAwardId: grantedAwardId
    }
  });
});
$(window).resize(function () {
  if ($(window).width() > mediumBreakpoint) {
    if ($("#achievements-card").height() < $("#info-card").height()) {
      $("#achievements-card").css("min-height", $("#info-card").height());
      $("#achievements-card .achievements-box").css("height", $("#info-card").height() - 79);
    } else {
      $("#info-card").css("min-height", $("#achievements-card").height());
    }
  } else {
    $("#info-card").css("min-height", "0");
  }
}).trigger("resize");

/*
 * Add support for video popups (lightbox)
 */

$(function () {
  $('.ccm-page .popup-video').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    preloader: true
  });

  // Fix CS-581
  // This is not ideal. This is Bootstrap 4 markup, but Bootstrap Select in this version of Concrete doesn't
  // understand `form-select`, so it limits these controls to 220px. So let's add `form-control` to these
  // DIVs to make them full width. Eventually we can remove this
  $('div.bootstrap-select').not('.form-control').addClass('form-control');
});
$("#ccm-upload-avatar, #ccm-upload-header-image").on("submit", function () {
  /*
   * This is important because to checkbox attribute type is using the post
   * values when it's a post request.
   *
   * When we don't pass the data from the main form all checkboxes are rendered empty.
   */

  $("#ccm-edit-profile-form input[type=checkbox]").clone().appendTo($(this));

  // Display the loading screen
  $("body").addClass("loading");
});

/*
 * Language Switcher JS
 */

$(".ccm-page .ccm-block-switch-language-flags-dropdown select").change(function () {
  debugger;
  window.location.href = $(this).data("action").replace("--language--", $(this).find("option:selected").val());
});
var hasCookie = function hasCookie() {
  return /ccm_cdd=1/.test(document.cookie);
};
var setCookie = function setCookie(cookie) {
  return document.cookie = cookie;
};
window.addEventListener('load', function () {
  // Early return if the disclosure has already been acknowledged
  if (hasCookie()) {
    return;
  }

  // Render and append elements to the dom
  var templateElement = $('script.disclosure[role=template]');
  var template = underscore__WEBPACK_IMPORTED_MODULE_1__["default"].template(templateElement.length > 0 ? templateElement.text().trim() : '');
  var disclosure = $($.parseHTML(template()));
  if (disclosure.length) {
    disclosure.appendTo(document.body).addClass('open');

    // Handle ack press
    $('button.ack').on('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var chunks, sld;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            disclosure.addClass('close').removeClass('open');
            // Note this 500 matches the timing in `_disclosure.scss` for the `fadeout` animation
            setTimeout(function () {
              return disclosure.remove();
            }, 500);

            // Set a 100 year cookie
            chunks = window.location.hostname.split('.');
            sld = chunks.length >= 3 ? ".".concat(chunks.splice(-2).join('.')) : chunks.join('.');
            setCookie("ccm_cdd=1;path=/;samesite=lax;domain=".concat(sld, ";max-age=").concat(31536000 * 100));
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pnotify_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnotify/core */ "./node_modules/@pnotify/core/dist/PNotify.js");
/* harmony import */ var _pnotify_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_pnotify_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnotify/bootstrap4 */ "./node_modules/@pnotify/bootstrap4/dist/PNotifyBootstrap4.js");
/* harmony import */ var _pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _concretecms_bedrock_assets_cms_components_form_ConcreteUserSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect */ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue");


_pnotify_core__WEBPACK_IMPORTED_MODULE_0__.defaultModules.set(_pnotify_bootstrap4__WEBPACK_IMPORTED_MODULE_1__, {});
var stackBottomModal = new _pnotify_core__WEBPACK_IMPORTED_MODULE_0__.Stack({
  dir1: 'up',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  push: 'top',
  maxOpen: 5,
  modal: false,
  overlayClose: false,
  context: $('body').get(0)
});

/* eslint-disable no-new, no-unused-vars, camelcase, eqeqeq */
/* globals TomSelect, ccmi18n_community */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    ConcreteUserSelect: _concretecms_bedrock_assets_cms_components_form_ConcreteUserSelect__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      i18n: ccmi18n_community,
      attachment: null,
      subject: null,
      body: null,
      receiver: null,
      receiverUsername: null // only used in reply mode
    };
  },

  props: {
    replyToMessageId: {
      required: false
    },
    sendMessageToUserId: {
      required: false
    },
    buttonText: {
      type: String,
      required: false,
      "default": ccmi18n_community.dialogTitle
    },
    dialogTitle: {
      type: String,
      required: false,
      "default": ccmi18n_community.dialogTitle
    },
    cssClass: {
      type: String,
      required: false
    },
    sendMessageToken: {
      type: String,
      required: true
    },
    userSelectOptions: {
      type: Object,
      required: true
    }
  },
  mounted: function mounted() {
    if (this.sendMessageToUserId) {
      this.receiver = this.sendMessageToUserId;
    }
    this.modal = bootstrap.Modal.getOrCreateInstance(this.$refs.composeModal);
  },
  computed: {},
  methods: {
    selectFile: function selectFile() {
      this.attachment = this.$refs.msgAttachments.files[0];
    },
    showMessageModal: function showMessageModal() {
      var my = this;
      if (this.replyToMessageId) {
        $.ajax({
          url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/compose",
          method: "GET",
          data: {
            msgID: my.replyToMessageId
          },
          success: function success(data) {
            my.subject = data.messageData.msgSubject;
            my.receiver = data.messageData.uID;
            my.receiverUsername = data.messageData.uName;
            my.modal.show();
          }
        });
      } else {
        my.modal.show();
      }
    },
    sendMessage: function sendMessage() {
      var _this = this;
      var my = this;
      var formData = new FormData();
      if (my.receiver) {
        formData.append('uID', my.receiver);
      }
      if (my.subject) {
        formData.append('msgSubject', my.subject);
      }
      if (my.body) {
        formData.append('msgBody', my.body);
      }
      formData.append('ccm_token', my.sendMessageToken);
      if (this.replyToMessageId) {
        formData.append('msgID', my.replyToMessageId);
      }
      if (my.attachment) {
        formData.append('msgAttachments[]', my.attachment, my.attachment.name);
      }
      $.ajax({
        url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/send",
        method: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        error: function error(r) {
          (0,_pnotify_core__WEBPACK_IMPORTED_MODULE_0__.alert)({
            text: my.i18n.generalError,
            stack: stackBottomModal,
            type: 'error'
          });
        },
        success: function success(data) {
          if (data.error) {
            for (var i = 0; i < data.errors.length; i++) {
              var errorMessage = data.errors[i];
              (0,_pnotify_core__WEBPACK_IMPORTED_MODULE_0__.alert)({
                text: errorMessage,
                stack: stackBottomModal,
                type: 'error'
              });
            }
          } else {
            (0,_pnotify_core__WEBPACK_IMPORTED_MODULE_0__.alert)({
              text: data.message,
              stack: stackBottomModal,
              type: 'success'
            });
            setTimeout(function () {
              window.location.href = CCM_DISPATCHER_FILENAME + "/account/messages";
            }, 3000);
            _this.modal.hide();
          }
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=template&id=5503638a&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=template&id=5503638a& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("span", [_c("a", {
    "class": _vm.cssClass,
    attrs: {
      href: "#"
    },
    on: {
      click: function click($event) {
        $event.preventDefault();
        return _vm.showMessageModal.apply(null, arguments);
      }
    }
  }, [_vm._v(_vm._s(this.buttonText))]), _vm._v(" "), _c("div", {
    ref: "composeModal",
    staticClass: "modal fade",
    attrs: {
      "data-bs-backdrop": "static",
      "data-bs-keyboard": "false",
      role: "dialog",
      tabindex: "-1",
      id: "modal-compose-message"
    }
  }, [_c("div", {
    staticClass: "modal-dialog modal-dialog-centered modal-lg"
  }, [_c("div", {
    staticClass: "modal-content"
  }, [_c("div", {
    staticClass: "modal-header"
  }, [_c("h4", {
    staticClass: "modal-title"
  }, [_vm._v(_vm._s(this.dialogTitle))]), _vm._v(" "), _c("button", {
    staticClass: "btn-close btn-close-white",
    attrs: {
      type: "button",
      "data-bs-dismiss": "modal",
      "aria-label": "Close"
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_c("form", [_c("div", {
    staticClass: "mb-3 row"
  }, [_c("label", {
    staticClass: "col-sm-3 col-form-label"
  }, [_vm._v("\n                                " + _vm._s(_vm.i18n.receiverLabel) + "\n                            ")]), _vm._v(" "), _c("div", {
    staticClass: "col-sm"
  }, [_c("concrete-user-select", {
    attrs: {
      "access-token": _vm.userSelectOptions.accessToken,
      "include-avatar": _vm.userSelectOptions.includeAvatar,
      "label-format": _vm.userSelectOptions.labelFormat
    },
    model: {
      value: _vm.receiver,
      callback: function callback($$v) {
        _vm.receiver = $$v;
      },
      expression: "receiver"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "mb-3 row"
  }, [_c("label", {
    staticClass: "col-sm-3 col-form-label",
    attrs: {
      "for": "msgSubject"
    }
  }, [_vm._v("\n                                " + _vm._s(_vm.i18n.subjectLabel) + "\n                            ")]), _vm._v(" "), _c("div", {
    staticClass: "col-sm"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.subject,
      expression: "subject"
    }],
    staticClass: "form-control",
    attrs: {
      id: "msgSubject",
      name: "msgSubject",
      type: "text"
    },
    domProps: {
      value: _vm.subject
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.subject = $event.target.value;
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "mb-3 row"
  }, [_c("label", {
    staticClass: "col-sm-3 col-form-label",
    attrs: {
      "for": "msgBody"
    }
  }, [_vm._v("\n                                " + _vm._s(_vm.i18n.messageLabel) + "\n                            ")]), _vm._v(" "), _c("div", {
    staticClass: "col-sm"
  }, [_c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.body,
      expression: "body"
    }],
    staticClass: "form-control",
    attrs: {
      id: "msgBody",
      name: "msgBody",
      rows: "8"
    },
    domProps: {
      value: _vm.body
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.body = $event.target.value;
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "mb-3 row"
  }, [_c("label", {
    staticClass: "col-sm-3 col-form-label",
    attrs: {
      "for": "msgAttachments"
    }
  }, [_vm._v("\n                                " + _vm._s(_vm.i18n.attachmentsLabel) + "\n                            ")]), _vm._v(" "), _c("div", {
    staticClass: "col-sm"
  }, [_c("div", {
    staticClass: "upload-item"
  }, [_vm.attachment == null ? _c("div", {
    staticClass: "upload-btn-wrapper"
  }, [_c("button", {
    staticClass: "btn btn-sm btn-secondary"
  }, [_vm._v("\n                                            " + _vm._s(_vm.i18n.uploadFilesButton) + "\n                                        ")]), _vm._v(" "), _c("input", {
    ref: "msgAttachments",
    staticClass: "form-control attachments",
    attrs: {
      id: "msgAttachments",
      name: "msgAttachments[]",
      type: "file",
      multiple: "multiple"
    },
    on: {
      change: _vm.selectFile
    }
  })]) : _vm._e(), _vm._v(" "), _vm.attachment != null ? _c("div", {
    staticClass: "files-container"
  }, [_c("div", {
    staticClass: "file-details"
  }, [_c("a", {
    staticClass: "selected-file",
    attrs: {
      href: "#"
    }
  }, [_vm._v(_vm._s(_vm.attachment.name))]), _vm._v(" "), _c("a", {
    staticClass: "remove-selected-file",
    attrs: {
      href: "#"
    },
    on: {
      click: function click($event) {
        _vm.attachment = null;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-trash"
  })])])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "upload-notice"
  }, [_vm._v("\n                                        " + _vm._s(_vm.i18n.uploadFilesNotice) + "\n                                    ")])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "modal-footer d-flex justify-content-between w-100"
  }, [_c("button", {
    staticClass: "btn btn-secondary border float-start",
    attrs: {
      type: "button",
      "data-bs-dismiss": "modal"
    }
  }, [_vm._v("\n                        " + _vm._s(_vm.i18n.cancelButton) + "\n                    ")]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-primary",
    attrs: {
      name: "action",
      type: "button"
    },
    on: {
      click: _vm.sendMessage
    }
  }, [_vm._v("\n                        " + _vm._s(_vm.i18n.sendButton) + "\n                    ")])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".ccm-form-select-user .item,\n.ccm-form-select-user .option {\n  align-items: center;\n  display: flex;\n}\n.ccm-form-select-user .ccm-form-select-user-label-secondary {\n  font-size: 0.8rem;\n}\n.ccm-form-select-user .ccm-form-select-user-avatar {\n  flex: 0 0 20px;\n  margin-right: 12px;\n}\n.ccm-form-select-user .ccm-form-select-user-avatar img {\n  border-radius: 50%;\n  height: auto;\n  max-width: 100%;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./assets/themes/concrete_cms/scss/main.scss":
/*!***************************************************!*\
  !*** ./assets/themes/concrete_cms/scss/main.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_12_use_2_sass_loader_dist_cjs_js_clonedRuleSet_12_use_3_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_style_index_0_id_5235e8e3_lang_scss___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../../../../../vue-loader/lib/loaders/stylePostLoader.js!../../../../../../postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../../../../../sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!../../../../../../vue-loader/lib/index.js??vue-loader-options!./ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss& */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_12_use_2_sass_loader_dist_cjs_js_clonedRuleSet_12_use_3_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_style_index_0_id_5235e8e3_lang_scss___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_12_use_2_sass_loader_dist_cjs_js_clonedRuleSet_12_use_3_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_style_index_0_id_5235e8e3_lang_scss___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./assets/dialogs/html/confirm.html":
/*!******************************************!*\
  !*** ./assets/dialogs/html/confirm.html ***!
  \******************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<!--\n @project:   ConcreteCMS Theme\n\n @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)\n @author     Fabian Bitter (fabian@bitter.de)\n-->\n\n<div class="modal fade" tabindex="-1" role="dialog" id="ccm-confirm-dialog-'+
((__t=(id))==null?'':__t)+
'">\n    <div class="modal-dialog modal-dialog-centered" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <h5 class="modal-title">\n                    '+
((__t=(i18n.title))==null?'':__t)+
'\n                </h5>\n\n                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>\n            </div>\n\n            <div class="modal-body">\n                '+
((__t=(i18n.message))==null?'':__t)+
'\n            </div>\n\n            <div class="modal-footer">\n                <button type="button" class="btn btn-secondary" data-dismiss="modal">\n                    '+
((__t=(i18n.cancelButton))==null?'':__t)+
'\n                </button>\n\n                <button type="button" class="btn btn-primary">\n                    '+
((__t=(i18n.confirmButton))==null?'':__t)+
'\n                </button>\n            </div>\n        </div>\n    </div>\n</div>';
}
return __p;
};


/***/ }),

/***/ "./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue":
/*!****************************************************************************!*\
  !*** ./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ComposePrivateMessage_vue_vue_type_template_id_5503638a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ComposePrivateMessage.vue?vue&type=template&id=5503638a& */ "./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=template&id=5503638a&");
/* harmony import */ var _ComposePrivateMessage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ComposePrivateMessage.vue?vue&type=script&lang=js& */ "./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ComposePrivateMessage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ComposePrivateMessage_vue_vue_type_template_id_5503638a___WEBPACK_IMPORTED_MODULE_0__.render,
  _ComposePrivateMessage_vue_vue_type_template_id_5503638a___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ConcreteAjaxSelect_vue_vue_type_template_id_ae46ee10___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10& */ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10&");
/* harmony import */ var _ConcreteAjaxSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ConcreteAjaxSelect.vue?vue&type=script&lang=js& */ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=script&lang=js&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ConcreteAjaxSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ConcreteAjaxSelect_vue_vue_type_template_id_ae46ee10___WEBPACK_IMPORTED_MODULE_0__.render,
  _ConcreteAjaxSelect_vue_vue_type_template_id_ae46ee10___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ConcreteUserSelect_vue_vue_type_template_id_5235e8e3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConcreteUserSelect.vue?vue&type=template&id=5235e8e3& */ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=template&id=5235e8e3&");
/* harmony import */ var _ConcreteUserSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ConcreteUserSelect.vue?vue&type=script&lang=js& */ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=script&lang=js&");
/* harmony import */ var _ConcreteUserSelect_vue_vue_type_style_index_0_id_5235e8e3_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss& */ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ConcreteUserSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ConcreteUserSelect_vue_vue_type_template_id_5235e8e3___WEBPACK_IMPORTED_MODULE_0__.render,
  _ConcreteUserSelect_vue_vue_type_template_id_5235e8e3___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_index_js_vue_loader_options_ConcreteAjaxSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../babel-loader/lib/index.js??clonedRuleSet-22.use[0]!../../../../../../vue-loader/lib/index.js??vue-loader-options!./ConcreteAjaxSelect.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_index_js_vue_loader_options_ConcreteAjaxSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../babel-loader/lib/index.js??clonedRuleSet-22.use[0]!../../../../../../vue-loader/lib/index.js??vue-loader-options!./ConcreteUserSelect.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10&":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10& ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_ConcreteAjaxSelect_vue_vue_type_template_id_ae46ee10___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_ConcreteAjaxSelect_vue_vue_type_template_id_ae46ee10___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_ConcreteAjaxSelect_vue_vue_type_template_id_ae46ee10___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../babel-loader/lib/index.js??clonedRuleSet-22.use[0]!../../../../../../vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../../../../vue-loader/lib/index.js??vue-loader-options!./ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteAjaxSelect.vue?vue&type=template&id=ae46ee10&");


/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=template&id=5235e8e3&":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=template&id=5235e8e3& ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_template_id_5235e8e3___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_template_id_5235e8e3___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _babel_loader_lib_index_js_clonedRuleSet_22_use_0_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_template_id_5235e8e3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../babel-loader/lib/index.js??clonedRuleSet-22.use[0]!../../../../../../vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../../../../vue-loader/lib/index.js??vue-loader-options!./ConcreteUserSelect.vue?vue&type=template&id=5235e8e3& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=template&id=5235e8e3&");


/***/ }),

/***/ "./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************!*\
  !*** ./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_22_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ComposePrivateMessage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ComposePrivateMessage.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_22_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ComposePrivateMessage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=template&id=5503638a&":
/*!***********************************************************************************************************!*\
  !*** ./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=template&id=5503638a& ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_22_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ComposePrivateMessage_vue_vue_type_template_id_5503638a___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_22_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ComposePrivateMessage_vue_vue_type_template_id_5503638a___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_22_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ComposePrivateMessage_vue_vue_type_template_id_5503638a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ComposePrivateMessage.vue?vue&type=template&id=5503638a& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-22.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./assets/themes/concrete_cms/js/components/ComposePrivateMessage.vue?vue&type=template&id=5503638a&");


/***/ }),

/***/ "./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss&":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss& ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_dist_cjs_js_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_12_use_2_sass_loader_dist_cjs_js_clonedRuleSet_12_use_3_vue_loader_lib_index_js_vue_loader_options_ConcreteUserSelect_vue_vue_type_style_index_0_id_5235e8e3_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../style-loader/dist/cjs.js!../../../../../../laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../../../../../vue-loader/lib/loaders/stylePostLoader.js!../../../../../../postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../../../../../sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!../../../../../../vue-loader/lib/index.js??vue-loader-options!./ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect.vue?vue&type=style&index=0&id=5235e8e3&lang=scss&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalizeComponent)
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = Vue;

/***/ }),

/***/ "bootstrap":
/*!****************************!*\
  !*** external "bootstrap" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = bootstrap;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = jQuery;

/***/ }),

/***/ "./node_modules/underscore/modules/_baseCreate.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/_baseCreate.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ baseCreate)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");



// Create a naked function reference for surrogate-prototype-swapping.
function ctor() {
  return function () {};
}

// An internal function for creating a new object that inherits from another.
function baseCreate(prototype) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(prototype)) return {};
  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeCreate) return (0,_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeCreate)(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result = new Ctor();
  Ctor.prototype = null;
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_baseIteratee.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_baseIteratee.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ baseIteratee)
/* harmony export */ });
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity.js */ "./node_modules/underscore/modules/identity.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./property.js */ "./node_modules/underscore/modules/property.js");
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");








// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `_.identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function baseIteratee(value, context, argCount) {
  if (value == null) return _identity_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) return (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_6__["default"])(value, context, argCount);
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) && !(0,_isArray_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value)) return (0,_matcher_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value);
  return (0,_property_js__WEBPACK_IMPORTED_MODULE_5__["default"])(value);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_cb.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/_cb.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ cb)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/underscore/modules/_baseIteratee.js");
/* harmony import */ var _iteratee_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./iteratee.js */ "./node_modules/underscore/modules/iteratee.js");




// The function we call internally to generate a callback. It invokes
// `_.iteratee` if overridden, otherwise `baseIteratee`.
function cb(value, context, argCount) {
  if (_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].iteratee !== _iteratee_js__WEBPACK_IMPORTED_MODULE_2__["default"]) return _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].iteratee(value, context);
  return (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value, context, argCount);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_chainResult.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/_chainResult.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chainResult)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");


// Helper function to continue chaining intermediate results.
function chainResult(instance, obj) {
  return instance._chain ? (0,_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj).chain() : obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_collectNonEnumProps.js":
/*!*****************************************************************!*\
  !*** ./node_modules/underscore/modules/_collectNonEnumProps.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ collectNonEnumProps)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");




// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.
function emulatedSet(keys) {
  var hash = {};
  for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
  return {
    contains: function contains(key) {
      return hash[key] === true;
    },
    push: function push(key) {
      hash[key] = true;
      return keys.push(key);
    }
  };
}

// Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
// needed.
function collectNonEnumProps(obj, keys) {
  keys = emulatedSet(keys);
  var nonEnumIdx = _setup_js__WEBPACK_IMPORTED_MODULE_0__.nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(constructor) && constructor.prototype || _setup_js__WEBPACK_IMPORTED_MODULE_0__.ObjProto;

  // Constructor is a special case.
  var prop = 'constructor';
  if ((0,_has_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj, prop) && !keys.contains(prop)) keys.push(prop);
  while (nonEnumIdx--) {
    prop = _setup_js__WEBPACK_IMPORTED_MODULE_0__.nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
      keys.push(prop);
    }
  }
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createAssigner.js":
/*!************************************************************!*\
  !*** ./node_modules/underscore/modules/_createAssigner.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createAssigner)
/* harmony export */ });
// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
  return function (obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
        keys = keysFunc(source),
        l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createEscaper.js":
/*!***********************************************************!*\
  !*** ./node_modules/underscore/modules/_createEscaper.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createEscaper)
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


// Internal helper to generate functions for escaping and unescaping strings
// to/from HTML interpolation.
function createEscaper(map) {
  var escaper = function escaper(match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = '(?:' + (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function (string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createIndexFinder.js":
/*!***************************************************************!*\
  !*** ./node_modules/underscore/modules/_createIndexFinder.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createIndexFinder)
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isNaN_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isNaN.js */ "./node_modules/underscore/modules/isNaN.js");




// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function (array, item, idx) {
    var i = 0,
      length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array);
    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(_setup_js__WEBPACK_IMPORTED_MODULE_1__.slice.call(array, i, length), _isNaN_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createPredicateIndexFinder.js":
/*!************************************************************************!*\
  !*** ./node_modules/underscore/modules/_createPredicateIndexFinder.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createPredicateIndexFinder)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");



// Internal function to generate `_.findIndex` and `_.findLastIndex`.
function createPredicateIndexFinder(dir) {
  return function (array, predicate, context) {
    predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(predicate, context);
    var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_1__["default"])(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createReduce.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_createReduce.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createReduce)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");




// Internal helper to create a reducing function, iterating left or right.
function createReduce(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function reducer(obj, iteratee, memo, initial) {
    var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj),
      length = (_keys || obj).length,
      index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };
  return function (obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__["default"])(iteratee, context, 4), memo, initial);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_createSizePropertyCheck.js":
/*!*********************************************************************!*\
  !*** ./node_modules/underscore/modules/_createSizePropertyCheck.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createSizePropertyCheck)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// Common internal logic for `isArrayLike` and `isBufferLike`.
function createSizePropertyCheck(getSizeProperty) {
  return function (collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= _setup_js__WEBPACK_IMPORTED_MODULE_0__.MAX_ARRAY_INDEX;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_deepGet.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/_deepGet.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ deepGet)
/* harmony export */ });
// Internal function to obtain a nested property in `obj` along `path`.
function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_escapeMap.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/_escapeMap.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Internal list of HTML entities for escaping.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
});

/***/ }),

/***/ "./node_modules/underscore/modules/_executeBound.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_executeBound.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ executeBound)
/* harmony export */ });
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseCreate.js */ "./node_modules/underscore/modules/_baseCreate.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");



// Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self = (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result)) return result;
  return self;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_flatten.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/_flatten.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ flatten)
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/underscore/modules/isArguments.js");





// Internal implementation of a recursive `flatten` function.
function flatten(input, depth, strict, output) {
  output = output || [];
  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }
  var idx = output.length;
  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(input); i < length; i++) {
    var value = input[i];
    if ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) && ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value))) {
      // Flatten current level of array or arguments object.
      if (depth > 1) {
        flatten(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0,
          len = value.length;
        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_getByteLength.js":
/*!***********************************************************!*\
  !*** ./node_modules/underscore/modules/_getByteLength.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_shallowProperty.js */ "./node_modules/underscore/modules/_shallowProperty.js");


// Internal helper to obtain the `byteLength` property of an object.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])('byteLength'));

/***/ }),

/***/ "./node_modules/underscore/modules/_getLength.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/_getLength.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_shallowProperty.js */ "./node_modules/underscore/modules/_shallowProperty.js");


// Internal helper to obtain the `length` property of an object.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_shallowProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])('length'));

/***/ }),

/***/ "./node_modules/underscore/modules/_group.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/_group.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ group)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");



// An internal function used for aggregate "group by" operations.
function group(behavior, partition) {
  return function (obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, context);
    (0,_each_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj, function (value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_has.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/_has.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ has)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// Internal function to check whether `key` is an own property name of `obj`.
function has(obj, key) {
  return obj != null && _setup_js__WEBPACK_IMPORTED_MODULE_0__.hasOwnProperty.call(obj, key);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_hasObjectTag.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_hasObjectTag.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Object'));

/***/ }),

/***/ "./node_modules/underscore/modules/_isArrayLike.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/_isArrayLike.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createSizePropertyCheck.js */ "./node_modules/underscore/modules/_createSizePropertyCheck.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");



// Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_getLength_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/_isBufferLike.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_isBufferLike.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createSizePropertyCheck.js */ "./node_modules/underscore/modules/_createSizePropertyCheck.js");
/* harmony import */ var _getByteLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getByteLength.js */ "./node_modules/underscore/modules/_getByteLength.js");



// Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createSizePropertyCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_getByteLength_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/_keyInObj.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/_keyInObj.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ keyInObj)
/* harmony export */ });
// Internal `_.pick` helper function to determine whether `key` is an enumerable
// property name of `obj`.
function keyInObj(value, key, obj) {
  return key in obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/_methodFingerprint.js":
/*!***************************************************************!*\
  !*** ./node_modules/underscore/modules/_methodFingerprint.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ie11fingerprint": () => (/* binding */ ie11fingerprint),
/* harmony export */   "mapMethods": () => (/* binding */ mapMethods),
/* harmony export */   "setMethods": () => (/* binding */ setMethods),
/* harmony export */   "weakMapMethods": () => (/* binding */ weakMapMethods)
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");




// Since the regular `Object.prototype.toString` type tests don't work for
// some types in IE 11, we use a fingerprinting heuristic instead, based
// on the methods. It's not great, but it's the best we got.
// The fingerprint method lists are defined below.
function ie11fingerprint(methods) {
  var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(methods);
  return function (obj) {
    if (obj == null) return false;
    // `Map`, `WeakMap` and `Set` have no enumerable keys.
    var keys = (0,_allKeys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj);
    if ((0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(keys)) return false;
    for (var i = 0; i < length; i++) {
      if (!(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj[methods[i]])) return false;
    }
    // If we are testing against `WeakMap`, we need to ensure that
    // `obj` doesn't have a `forEach` method in order to distinguish
    // it from a regular `Map`.
    return methods !== weakMapMethods || !(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj[forEachName]);
  };
}

// In the interest of compact minification, we write
// each string in the fingerprints only once.
var forEachName = 'forEach',
  hasName = 'has',
  commonInit = ['clear', 'delete'],
  mapTail = ['get', hasName, 'set'];

// `Map`, `WeakMap` and `Set` each have slightly different
// combinations of the above sublists.
var mapMethods = commonInit.concat(forEachName, mapTail),
  weakMapMethods = commonInit.concat(mapTail),
  setMethods = ['add'].concat(commonInit, forEachName, hasName);

/***/ }),

/***/ "./node_modules/underscore/modules/_optimizeCb.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/_optimizeCb.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ optimizeCb)
/* harmony export */ });
// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };
    // The 2-argument case is omitted because we’re not using it.
    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function () {
    return func.apply(context, arguments);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_setup.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/_setup.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArrayProto": () => (/* binding */ ArrayProto),
/* harmony export */   "MAX_ARRAY_INDEX": () => (/* binding */ MAX_ARRAY_INDEX),
/* harmony export */   "ObjProto": () => (/* binding */ ObjProto),
/* harmony export */   "SymbolProto": () => (/* binding */ SymbolProto),
/* harmony export */   "VERSION": () => (/* binding */ VERSION),
/* harmony export */   "_isFinite": () => (/* binding */ _isFinite),
/* harmony export */   "_isNaN": () => (/* binding */ _isNaN),
/* harmony export */   "hasEnumBug": () => (/* binding */ hasEnumBug),
/* harmony export */   "hasOwnProperty": () => (/* binding */ hasOwnProperty),
/* harmony export */   "nativeCreate": () => (/* binding */ nativeCreate),
/* harmony export */   "nativeIsArray": () => (/* binding */ nativeIsArray),
/* harmony export */   "nativeIsView": () => (/* binding */ nativeIsView),
/* harmony export */   "nativeKeys": () => (/* binding */ nativeKeys),
/* harmony export */   "nonEnumerableProps": () => (/* binding */ nonEnumerableProps),
/* harmony export */   "push": () => (/* binding */ push),
/* harmony export */   "root": () => (/* binding */ root),
/* harmony export */   "slice": () => (/* binding */ slice),
/* harmony export */   "supportsArrayBuffer": () => (/* binding */ supportsArrayBuffer),
/* harmony export */   "supportsDataView": () => (/* binding */ supportsDataView),
/* harmony export */   "toString": () => (/* binding */ toString)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
// Current version.
var VERSION = '1.13.6';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self.self === self && self || (typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global.global === global && global || Function('return this')() || {};

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype,
  ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty;

// Modern feature detection.
var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
  supportsDataView = typeof DataView !== 'undefined';

// All **ECMAScript 5+** native function implementations that we hope to use
// are declared here.
var nativeIsArray = Array.isArray,
  nativeKeys = Object.keys,
  nativeCreate = Object.create,
  nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

// Create references to these builtin functions because we override them.
var _isNaN = isNaN,
  _isFinite = isFinite;

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{
  toString: null
}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

// The largest integer that can be represented exactly.
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

/***/ }),

/***/ "./node_modules/underscore/modules/_shallowProperty.js":
/*!*************************************************************!*\
  !*** ./node_modules/underscore/modules/_shallowProperty.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shallowProperty)
/* harmony export */ });
// Internal helper to generate a function to obtain property `key` from `obj`.
function shallowProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_stringTagBug.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_stringTagBug.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hasStringTagBug": () => (/* binding */ hasStringTagBug),
/* harmony export */   "isIE11": () => (/* binding */ isIE11)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _hasObjectTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_hasObjectTag.js */ "./node_modules/underscore/modules/_hasObjectTag.js");



// In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
// In IE 11, the most common among them, this problem also applies to
// `Map`, `WeakMap` and `Set`.
var hasStringTagBug = _setup_js__WEBPACK_IMPORTED_MODULE_0__.supportsDataView && (0,_hasObjectTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(new DataView(new ArrayBuffer(8))),
  isIE11 = typeof Map !== 'undefined' && (0,_hasObjectTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(new Map());

/***/ }),

/***/ "./node_modules/underscore/modules/_tagTester.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/_tagTester.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tagTester)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// Internal function for creating a `toString`-based type tester.
function tagTester(name) {
  var tag = '[object ' + name + ']';
  return function (obj) {
    return _setup_js__WEBPACK_IMPORTED_MODULE_0__.toString.call(obj) === tag;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/_toBufferView.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/_toBufferView.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toBufferView)
/* harmony export */ });
/* harmony import */ var _getByteLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getByteLength.js */ "./node_modules/underscore/modules/_getByteLength.js");


// Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to a new view, reusing the buffer.
function toBufferView(bufferSource) {
  return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, (0,_getByteLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(bufferSource));
}

/***/ }),

/***/ "./node_modules/underscore/modules/_toPath.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/_toPath.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPath)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPath.js */ "./node_modules/underscore/modules/toPath.js");



// Internal wrapper for `_.toPath` to enable minification.
// Similar to `cb` for `_.iteratee`.
function toPath(path) {
  return _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].toPath(path);
}

/***/ }),

/***/ "./node_modules/underscore/modules/_unescapeMap.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/_unescapeMap.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _invert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./invert.js */ "./node_modules/underscore/modules/invert.js");
/* harmony import */ var _escapeMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_escapeMap.js */ "./node_modules/underscore/modules/_escapeMap.js");



// Internal list of HTML entities for unescaping.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_invert_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_escapeMap_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/after.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/after.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ after)
/* harmony export */ });
// Returns a function that will only be executed on and after the Nth call.
function after(times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/allKeys.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/allKeys.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ allKeys)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_collectNonEnumProps.js */ "./node_modules/underscore/modules/_collectNonEnumProps.js");




// Retrieve all the enumerable property names of an object.
function allKeys(obj) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj)) return [];
  var keys = [];
  for (var key in obj) keys.push(key);
  // Ahem, IE < 9.
  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.hasEnumBug) (0,_collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj, keys);
  return keys;
}

/***/ }),

/***/ "./node_modules/underscore/modules/before.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/before.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ before)
/* harmony export */ });
// Returns a function that will only be executed up to (but not including) the
// Nth call.
function before(times, func) {
  var memo;
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/bind.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/bind.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _executeBound_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_executeBound.js */ "./node_modules/underscore/modules/_executeBound.js");




// Create a function bound to a given object (assigning `this`, and arguments,
// optionally).
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (func, context, args) {
  if (!(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(func)) throw new TypeError('Bind must be called on a function');
  var bound = (0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (callArgs) {
    return (0,_executeBound_js__WEBPACK_IMPORTED_MODULE_2__["default"])(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/bindAll.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/bindAll.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");
/* harmony import */ var _bind_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bind.js */ "./node_modules/underscore/modules/bind.js");




// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (obj, keys) {
  keys = (0,_flatten_js__WEBPACK_IMPORTED_MODULE_1__["default"])(keys, false, false);
  var index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    var key = keys[index];
    obj[key] = (0,_bind_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj[key], obj);
  }
  return obj;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/chain.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/chain.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chain)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");


// Start chaining a wrapped Underscore object.
function chain(obj) {
  var instance = (0,_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj);
  instance._chain = true;
  return instance;
}

/***/ }),

/***/ "./node_modules/underscore/modules/chunk.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/chunk.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chunk)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0,
    length = array.length;
  while (i < length) {
    result.push(_setup_js__WEBPACK_IMPORTED_MODULE_0__.slice.call(array, i, i += count));
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/clone.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/clone.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ clone)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _extend_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extend.js */ "./node_modules/underscore/modules/extend.js");




// Create a (shallow-cloned) duplicate of an object.
function clone(obj) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj)) return obj;
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) ? obj.slice() : (0,_extend_js__WEBPACK_IMPORTED_MODULE_2__["default"])({}, obj);
}

/***/ }),

/***/ "./node_modules/underscore/modules/compact.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/compact.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ compact)
/* harmony export */ });
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");


// Trim out all falsy values from an array.
function compact(array) {
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, Boolean);
}

/***/ }),

/***/ "./node_modules/underscore/modules/compose.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/compose.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ compose)
/* harmony export */ });
// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/constant.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/constant.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ constant)
/* harmony export */ });
// Predicate-generating function. Often useful outside of Underscore.
function constant(value) {
  return function () {
    return value;
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/contains.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/contains.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _indexOf_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./indexOf.js */ "./node_modules/underscore/modules/indexOf.js");




// Determine if the array or object contains a given item (using `===`).
function contains(obj, item, fromIndex, guard) {
  if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj)) obj = (0,_values_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  return (0,_indexOf_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj, item, fromIndex) >= 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/countBy.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/countBy.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");



// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (result, value, key) {
  if ((0,_has_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, key)) result[key]++;else result[key] = 1;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/create.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/create.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ create)
/* harmony export */ });
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseCreate.js */ "./node_modules/underscore/modules/_baseCreate.js");
/* harmony import */ var _extendOwn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extendOwn.js */ "./node_modules/underscore/modules/extendOwn.js");



// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
function create(prototype, props) {
  var result = (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(prototype);
  if (props) (0,_extendOwn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, props);
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/debounce.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/debounce.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./now.js */ "./node_modules/underscore/modules/now.js");



// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;
  var later = function later() {
    var passed = (0,_now_js__WEBPACK_IMPORTED_MODULE_1__["default"])() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null;
    }
  };
  var debounced = (0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (_args) {
    context = this;
    args = _args;
    previous = (0,_now_js__WEBPACK_IMPORTED_MODULE_1__["default"])();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  });
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };
  return debounced;
}

/***/ }),

/***/ "./node_modules/underscore/modules/defaults.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/defaults.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ "./node_modules/underscore/modules/_createAssigner.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");



// Fill in a given object with default properties.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_allKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"], true));

/***/ }),

/***/ "./node_modules/underscore/modules/defer.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/defer.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./delay.js */ "./node_modules/underscore/modules/delay.js");
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");




// Defers a function, scheduling it to run after the current call stack has
// cleared.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_partial_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_delay_js__WEBPACK_IMPORTED_MODULE_1__["default"], _underscore_js__WEBPACK_IMPORTED_MODULE_2__["default"], 1));

/***/ }),

/***/ "./node_modules/underscore/modules/delay.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/delay.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");


// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
}));

/***/ }),

/***/ "./node_modules/underscore/modules/difference.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/difference.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");





// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (array, rest) {
  rest = (0,_flatten_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rest, true, true);
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_2__["default"])(array, function (value) {
    return !(0,_contains_js__WEBPACK_IMPORTED_MODULE_3__["default"])(rest, value);
  });
}));

/***/ }),

/***/ "./node_modules/underscore/modules/each.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/each.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ each)
/* harmony export */ });
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");




// The cornerstone for collection functions, an `each`
// implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
function each(obj, iteratee, context) {
  iteratee = (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, context);
  var i, length;
  if ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/escape.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/escape.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createEscaper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createEscaper.js */ "./node_modules/underscore/modules/_createEscaper.js");
/* harmony import */ var _escapeMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_escapeMap.js */ "./node_modules/underscore/modules/_escapeMap.js");



// Function for escaping strings to HTML interpolation.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createEscaper_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_escapeMap_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/every.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/every.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ every)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");




// Determine whether all of the elements pass a truth test.
function every(obj, predicate, context) {
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(predicate, context);
  var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj),
    length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}

/***/ }),

/***/ "./node_modules/underscore/modules/extend.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/extend.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ "./node_modules/underscore/modules/_createAssigner.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");



// Extend a given object with all the properties in passed-in object(s).
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_allKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/extendOwn.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/extendOwn.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ "./node_modules/underscore/modules/_createAssigner.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");



// Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/filter.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/filter.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ filter)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");



// Return all the elements that pass a truth test.
function filter(obj, predicate, context) {
  var results = [];
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(predicate, context);
  (0,_each_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj, function (value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}

/***/ }),

/***/ "./node_modules/underscore/modules/find.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/find.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ find)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _findIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./findIndex.js */ "./node_modules/underscore/modules/findIndex.js");
/* harmony import */ var _findKey_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./findKey.js */ "./node_modules/underscore/modules/findKey.js");




// Return the first value which passes a truth test.
function find(obj, predicate, context) {
  var keyFinder = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj) ? _findIndex_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _findKey_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}

/***/ }),

/***/ "./node_modules/underscore/modules/findIndex.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/findIndex.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createPredicateIndexFinder.js */ "./node_modules/underscore/modules/_createPredicateIndexFinder.js");


// Returns the first index on an array-like that passes a truth test.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1));

/***/ }),

/***/ "./node_modules/underscore/modules/findKey.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/findKey.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ findKey)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");



// Returns the first key on an object that passes a truth test.
function findKey(obj, predicate, context) {
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(predicate, context);
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj),
    key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}

/***/ }),

/***/ "./node_modules/underscore/modules/findLastIndex.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/findLastIndex.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createPredicateIndexFinder.js */ "./node_modules/underscore/modules/_createPredicateIndexFinder.js");


// Returns the last index on an array-like that passes a truth test.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createPredicateIndexFinder_js__WEBPACK_IMPORTED_MODULE_0__["default"])(-1));

/***/ }),

/***/ "./node_modules/underscore/modules/findWhere.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/findWhere.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ findWhere)
/* harmony export */ });
/* harmony import */ var _find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./find.js */ "./node_modules/underscore/modules/find.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");



// Convenience version of a common use case of `_.find`: getting the first
// object containing specific `key:value` pairs.
function findWhere(obj, attrs) {
  return (0,_find_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, (0,_matcher_js__WEBPACK_IMPORTED_MODULE_1__["default"])(attrs));
}

/***/ }),

/***/ "./node_modules/underscore/modules/first.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/first.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ first)
/* harmony export */ });
/* harmony import */ var _initial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./initial.js */ "./node_modules/underscore/modules/initial.js");


// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_.map`.
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return (0,_initial_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, array.length - n);
}

/***/ }),

/***/ "./node_modules/underscore/modules/flatten.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/flatten.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ flatten)
/* harmony export */ });
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");


// Flatten out an array, either recursively (by default), or up to `depth`.
// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
function flatten(array, depth) {
  return (0,_flatten_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, depth, false);
}

/***/ }),

/***/ "./node_modules/underscore/modules/functions.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/functions.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ functions)
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");


// Return a sorted list of the function names available on the object.
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj[key])) names.push(key);
  }
  return names.sort();
}

/***/ }),

/***/ "./node_modules/underscore/modules/get.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/get.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ get)
/* harmony export */ });
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");
/* harmony import */ var _deepGet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_deepGet.js */ "./node_modules/underscore/modules/_deepGet.js");
/* harmony import */ var _isUndefined_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isUndefined.js */ "./node_modules/underscore/modules/isUndefined.js");




// Get the value of the (deep) property on `path` from `object`.
// If any property in `path` does not exist or if the value is
// `undefined`, return `defaultValue` instead.
// The `path` is normalized through `_.toPath`.
function get(object, path, defaultValue) {
  var value = (0,_deepGet_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, (0,_toPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path));
  return (0,_isUndefined_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) ? defaultValue : value;
}

/***/ }),

/***/ "./node_modules/underscore/modules/groupBy.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/groupBy.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");



// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (result, value, key) {
  if ((0,_has_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, key)) result[key].push(value);else result[key] = [value];
}));

/***/ }),

/***/ "./node_modules/underscore/modules/has.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/has.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ has)
/* harmony export */ });
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");



// Shortcut function for checking if an object has a given property directly on
// itself (in other words, not on a prototype). Unlike the internal `has`
// function, this public version can also traverse nested properties.
function has(obj, path) {
  path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path);
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!(0,_has_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}

/***/ }),

/***/ "./node_modules/underscore/modules/identity.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/identity.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ identity)
/* harmony export */ });
// Keep the identity function around for default iteratees.
function identity(value) {
  return value;
}

/***/ }),

/***/ "./node_modules/underscore/modules/index-all.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/index-all.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VERSION": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.VERSION),
/* harmony export */   "after": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.after),
/* harmony export */   "all": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.all),
/* harmony export */   "allKeys": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.allKeys),
/* harmony export */   "any": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.any),
/* harmony export */   "assign": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.assign),
/* harmony export */   "before": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.before),
/* harmony export */   "bind": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.bind),
/* harmony export */   "bindAll": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.bindAll),
/* harmony export */   "chain": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.chain),
/* harmony export */   "chunk": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.chunk),
/* harmony export */   "clone": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.clone),
/* harmony export */   "collect": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.collect),
/* harmony export */   "compact": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.compact),
/* harmony export */   "compose": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.compose),
/* harmony export */   "constant": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.constant),
/* harmony export */   "contains": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.contains),
/* harmony export */   "countBy": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.countBy),
/* harmony export */   "create": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.create),
/* harmony export */   "debounce": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.debounce),
/* harmony export */   "default": () => (/* reexport safe */ _index_default_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "defaults": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.defaults),
/* harmony export */   "defer": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.defer),
/* harmony export */   "delay": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.delay),
/* harmony export */   "detect": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.detect),
/* harmony export */   "difference": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.difference),
/* harmony export */   "drop": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.drop),
/* harmony export */   "each": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.each),
/* harmony export */   "escape": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.escape),
/* harmony export */   "every": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.every),
/* harmony export */   "extend": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.extend),
/* harmony export */   "extendOwn": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.extendOwn),
/* harmony export */   "filter": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.filter),
/* harmony export */   "find": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.find),
/* harmony export */   "findIndex": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findIndex),
/* harmony export */   "findKey": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findKey),
/* harmony export */   "findLastIndex": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findLastIndex),
/* harmony export */   "findWhere": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.findWhere),
/* harmony export */   "first": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.first),
/* harmony export */   "flatten": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.flatten),
/* harmony export */   "foldl": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.foldl),
/* harmony export */   "foldr": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.foldr),
/* harmony export */   "forEach": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.forEach),
/* harmony export */   "functions": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.functions),
/* harmony export */   "get": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.get),
/* harmony export */   "groupBy": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.groupBy),
/* harmony export */   "has": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.has),
/* harmony export */   "head": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.head),
/* harmony export */   "identity": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.identity),
/* harmony export */   "include": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.include),
/* harmony export */   "includes": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.includes),
/* harmony export */   "indexBy": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.indexBy),
/* harmony export */   "indexOf": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.indexOf),
/* harmony export */   "initial": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.initial),
/* harmony export */   "inject": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.inject),
/* harmony export */   "intersection": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.intersection),
/* harmony export */   "invert": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.invert),
/* harmony export */   "invoke": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.invoke),
/* harmony export */   "isArguments": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isArguments),
/* harmony export */   "isArray": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isArray),
/* harmony export */   "isArrayBuffer": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer),
/* harmony export */   "isBoolean": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isBoolean),
/* harmony export */   "isDataView": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isDataView),
/* harmony export */   "isDate": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isDate),
/* harmony export */   "isElement": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isElement),
/* harmony export */   "isEmpty": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty),
/* harmony export */   "isEqual": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isEqual),
/* harmony export */   "isError": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isError),
/* harmony export */   "isFinite": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isFinite),
/* harmony export */   "isFunction": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isFunction),
/* harmony export */   "isMap": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isMap),
/* harmony export */   "isMatch": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isMatch),
/* harmony export */   "isNaN": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isNaN),
/* harmony export */   "isNull": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isNull),
/* harmony export */   "isNumber": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isNumber),
/* harmony export */   "isObject": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isObject),
/* harmony export */   "isRegExp": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isRegExp),
/* harmony export */   "isSet": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isSet),
/* harmony export */   "isString": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isString),
/* harmony export */   "isSymbol": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isSymbol),
/* harmony export */   "isTypedArray": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isTypedArray),
/* harmony export */   "isUndefined": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined),
/* harmony export */   "isWeakMap": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isWeakMap),
/* harmony export */   "isWeakSet": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.isWeakSet),
/* harmony export */   "iteratee": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.iteratee),
/* harmony export */   "keys": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.keys),
/* harmony export */   "last": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.last),
/* harmony export */   "lastIndexOf": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.lastIndexOf),
/* harmony export */   "map": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.map),
/* harmony export */   "mapObject": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.mapObject),
/* harmony export */   "matcher": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.matcher),
/* harmony export */   "matches": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.matches),
/* harmony export */   "max": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.max),
/* harmony export */   "memoize": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.memoize),
/* harmony export */   "methods": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.methods),
/* harmony export */   "min": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.min),
/* harmony export */   "mixin": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.mixin),
/* harmony export */   "negate": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.negate),
/* harmony export */   "noop": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.noop),
/* harmony export */   "now": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.now),
/* harmony export */   "object": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.object),
/* harmony export */   "omit": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.omit),
/* harmony export */   "once": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.once),
/* harmony export */   "pairs": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.pairs),
/* harmony export */   "partial": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.partial),
/* harmony export */   "partition": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.partition),
/* harmony export */   "pick": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.pick),
/* harmony export */   "pluck": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.pluck),
/* harmony export */   "property": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.property),
/* harmony export */   "propertyOf": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf),
/* harmony export */   "random": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.random),
/* harmony export */   "range": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.range),
/* harmony export */   "reduce": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.reduce),
/* harmony export */   "reduceRight": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.reduceRight),
/* harmony export */   "reject": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.reject),
/* harmony export */   "rest": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.rest),
/* harmony export */   "restArguments": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.restArguments),
/* harmony export */   "result": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.result),
/* harmony export */   "sample": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.sample),
/* harmony export */   "select": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.select),
/* harmony export */   "shuffle": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.shuffle),
/* harmony export */   "size": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.size),
/* harmony export */   "some": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.some),
/* harmony export */   "sortBy": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.sortBy),
/* harmony export */   "sortedIndex": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.sortedIndex),
/* harmony export */   "tail": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.tail),
/* harmony export */   "take": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.take),
/* harmony export */   "tap": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.tap),
/* harmony export */   "template": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.template),
/* harmony export */   "templateSettings": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.templateSettings),
/* harmony export */   "throttle": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.throttle),
/* harmony export */   "times": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.times),
/* harmony export */   "toArray": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.toArray),
/* harmony export */   "toPath": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.toPath),
/* harmony export */   "transpose": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.transpose),
/* harmony export */   "unescape": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.unescape),
/* harmony export */   "union": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.union),
/* harmony export */   "uniq": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.uniq),
/* harmony export */   "unique": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.unique),
/* harmony export */   "uniqueId": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.uniqueId),
/* harmony export */   "unzip": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.unzip),
/* harmony export */   "values": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.values),
/* harmony export */   "where": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.where),
/* harmony export */   "without": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.without),
/* harmony export */   "wrap": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.wrap),
/* harmony export */   "zip": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.zip)
/* harmony export */ });
/* harmony import */ var _index_default_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index-default.js */ "./node_modules/underscore/modules/index-default.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./node_modules/underscore/modules/index.js");
// ESM Exports
// ===========
// This module is the package entry point for ES module users. In other words,
// it is the module they are interfacing with when they import from the whole
// package instead of from a submodule, like this:
//
// ```js
// import { map } from 'underscore';
// ```
//
// The difference with `./index-default`, which is the package entry point for
// CommonJS, AMD and UMD users, is purely technical. In ES modules, named and
// default exports are considered to be siblings, so when you have a default
// export, its properties are not automatically available as named exports. For
// this reason, we re-export the named exports in addition to providing the same
// default export as in `./index-default`.



/***/ }),

/***/ "./node_modules/underscore/modules/index-default.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/index-default.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/underscore/modules/index.js");
// Default Export
// ==============
// In this module, we mix our bundled exports into the `_` object and export
// the result. This is analogous to setting `module.exports = _` in CommonJS.
// Hence, this module is also the entry point of our UMD bundle and the package
// entry point for CommonJS and AMD users. In other words, this is (the source
// of) the module you are interfacing with when you do any of the following:
//
// ```js
// // CommonJS
// var _ = require('underscore');
//
// // AMD
// define(['underscore'], function(_) {...});
//
// // UMD in the browser
// // _ is available as a global variable
// ```



// Add all of the Underscore functions to the wrapper object.
var _ = (0,_index_js__WEBPACK_IMPORTED_MODULE_0__.mixin)(_index_js__WEBPACK_IMPORTED_MODULE_0__);
// Legacy Node.js API.
_._ = _;
// Export the Underscore API.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_);

/***/ }),

/***/ "./node_modules/underscore/modules/index.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VERSION": () => (/* reexport safe */ _setup_js__WEBPACK_IMPORTED_MODULE_0__.VERSION),
/* harmony export */   "after": () => (/* reexport safe */ _after_js__WEBPACK_IMPORTED_MODULE_72__["default"]),
/* harmony export */   "all": () => (/* reexport safe */ _every_js__WEBPACK_IMPORTED_MODULE_89__["default"]),
/* harmony export */   "allKeys": () => (/* reexport safe */ _allKeys_js__WEBPACK_IMPORTED_MODULE_29__["default"]),
/* harmony export */   "any": () => (/* reexport safe */ _some_js__WEBPACK_IMPORTED_MODULE_90__["default"]),
/* harmony export */   "assign": () => (/* reexport safe */ _extendOwn_js__WEBPACK_IMPORTED_MODULE_35__["default"]),
/* harmony export */   "before": () => (/* reexport safe */ _before_js__WEBPACK_IMPORTED_MODULE_73__["default"]),
/* harmony export */   "bind": () => (/* reexport safe */ _bind_js__WEBPACK_IMPORTED_MODULE_62__["default"]),
/* harmony export */   "bindAll": () => (/* reexport safe */ _bindAll_js__WEBPACK_IMPORTED_MODULE_63__["default"]),
/* harmony export */   "chain": () => (/* reexport safe */ _chain_js__WEBPACK_IMPORTED_MODULE_59__["default"]),
/* harmony export */   "chunk": () => (/* reexport safe */ _chunk_js__WEBPACK_IMPORTED_MODULE_123__["default"]),
/* harmony export */   "clone": () => (/* reexport safe */ _clone_js__WEBPACK_IMPORTED_MODULE_38__["default"]),
/* harmony export */   "collect": () => (/* reexport safe */ _map_js__WEBPACK_IMPORTED_MODULE_84__["default"]),
/* harmony export */   "compact": () => (/* reexport safe */ _compact_js__WEBPACK_IMPORTED_MODULE_112__["default"]),
/* harmony export */   "compose": () => (/* reexport safe */ _compose_js__WEBPACK_IMPORTED_MODULE_71__["default"]),
/* harmony export */   "constant": () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_44__["default"]),
/* harmony export */   "contains": () => (/* reexport safe */ _contains_js__WEBPACK_IMPORTED_MODULE_91__["default"]),
/* harmony export */   "countBy": () => (/* reexport safe */ _countBy_js__WEBPACK_IMPORTED_MODULE_102__["default"]),
/* harmony export */   "create": () => (/* reexport safe */ _create_js__WEBPACK_IMPORTED_MODULE_37__["default"]),
/* harmony export */   "debounce": () => (/* reexport safe */ _debounce_js__WEBPACK_IMPORTED_MODULE_68__["default"]),
/* harmony export */   "default": () => (/* reexport safe */ _underscore_array_methods_js__WEBPACK_IMPORTED_MODULE_125__["default"]),
/* harmony export */   "defaults": () => (/* reexport safe */ _defaults_js__WEBPACK_IMPORTED_MODULE_36__["default"]),
/* harmony export */   "defer": () => (/* reexport safe */ _defer_js__WEBPACK_IMPORTED_MODULE_66__["default"]),
/* harmony export */   "delay": () => (/* reexport safe */ _delay_js__WEBPACK_IMPORTED_MODULE_65__["default"]),
/* harmony export */   "detect": () => (/* reexport safe */ _find_js__WEBPACK_IMPORTED_MODULE_81__["default"]),
/* harmony export */   "difference": () => (/* reexport safe */ _difference_js__WEBPACK_IMPORTED_MODULE_118__["default"]),
/* harmony export */   "drop": () => (/* reexport safe */ _rest_js__WEBPACK_IMPORTED_MODULE_111__["default"]),
/* harmony export */   "each": () => (/* reexport safe */ _each_js__WEBPACK_IMPORTED_MODULE_83__["default"]),
/* harmony export */   "escape": () => (/* reexport safe */ _escape_js__WEBPACK_IMPORTED_MODULE_53__["default"]),
/* harmony export */   "every": () => (/* reexport safe */ _every_js__WEBPACK_IMPORTED_MODULE_89__["default"]),
/* harmony export */   "extend": () => (/* reexport safe */ _extend_js__WEBPACK_IMPORTED_MODULE_34__["default"]),
/* harmony export */   "extendOwn": () => (/* reexport safe */ _extendOwn_js__WEBPACK_IMPORTED_MODULE_35__["default"]),
/* harmony export */   "filter": () => (/* reexport safe */ _filter_js__WEBPACK_IMPORTED_MODULE_87__["default"]),
/* harmony export */   "find": () => (/* reexport safe */ _find_js__WEBPACK_IMPORTED_MODULE_81__["default"]),
/* harmony export */   "findIndex": () => (/* reexport safe */ _findIndex_js__WEBPACK_IMPORTED_MODULE_76__["default"]),
/* harmony export */   "findKey": () => (/* reexport safe */ _findKey_js__WEBPACK_IMPORTED_MODULE_75__["default"]),
/* harmony export */   "findLastIndex": () => (/* reexport safe */ _findLastIndex_js__WEBPACK_IMPORTED_MODULE_77__["default"]),
/* harmony export */   "findWhere": () => (/* reexport safe */ _findWhere_js__WEBPACK_IMPORTED_MODULE_82__["default"]),
/* harmony export */   "first": () => (/* reexport safe */ _first_js__WEBPACK_IMPORTED_MODULE_108__["default"]),
/* harmony export */   "flatten": () => (/* reexport safe */ _flatten_js__WEBPACK_IMPORTED_MODULE_113__["default"]),
/* harmony export */   "foldl": () => (/* reexport safe */ _reduce_js__WEBPACK_IMPORTED_MODULE_85__["default"]),
/* harmony export */   "foldr": () => (/* reexport safe */ _reduceRight_js__WEBPACK_IMPORTED_MODULE_86__["default"]),
/* harmony export */   "forEach": () => (/* reexport safe */ _each_js__WEBPACK_IMPORTED_MODULE_83__["default"]),
/* harmony export */   "functions": () => (/* reexport safe */ _functions_js__WEBPACK_IMPORTED_MODULE_33__["default"]),
/* harmony export */   "get": () => (/* reexport safe */ _get_js__WEBPACK_IMPORTED_MODULE_40__["default"]),
/* harmony export */   "groupBy": () => (/* reexport safe */ _groupBy_js__WEBPACK_IMPORTED_MODULE_100__["default"]),
/* harmony export */   "has": () => (/* reexport safe */ _has_js__WEBPACK_IMPORTED_MODULE_41__["default"]),
/* harmony export */   "head": () => (/* reexport safe */ _first_js__WEBPACK_IMPORTED_MODULE_108__["default"]),
/* harmony export */   "identity": () => (/* reexport safe */ _identity_js__WEBPACK_IMPORTED_MODULE_43__["default"]),
/* harmony export */   "include": () => (/* reexport safe */ _contains_js__WEBPACK_IMPORTED_MODULE_91__["default"]),
/* harmony export */   "includes": () => (/* reexport safe */ _contains_js__WEBPACK_IMPORTED_MODULE_91__["default"]),
/* harmony export */   "indexBy": () => (/* reexport safe */ _indexBy_js__WEBPACK_IMPORTED_MODULE_101__["default"]),
/* harmony export */   "indexOf": () => (/* reexport safe */ _indexOf_js__WEBPACK_IMPORTED_MODULE_79__["default"]),
/* harmony export */   "initial": () => (/* reexport safe */ _initial_js__WEBPACK_IMPORTED_MODULE_109__["default"]),
/* harmony export */   "inject": () => (/* reexport safe */ _reduce_js__WEBPACK_IMPORTED_MODULE_85__["default"]),
/* harmony export */   "intersection": () => (/* reexport safe */ _intersection_js__WEBPACK_IMPORTED_MODULE_117__["default"]),
/* harmony export */   "invert": () => (/* reexport safe */ _invert_js__WEBPACK_IMPORTED_MODULE_32__["default"]),
/* harmony export */   "invoke": () => (/* reexport safe */ _invoke_js__WEBPACK_IMPORTED_MODULE_92__["default"]),
/* harmony export */   "isArguments": () => (/* reexport safe */ _isArguments_js__WEBPACK_IMPORTED_MODULE_17__["default"]),
/* harmony export */   "isArray": () => (/* reexport safe */ _isArray_js__WEBPACK_IMPORTED_MODULE_15__["default"]),
/* harmony export */   "isArrayBuffer": () => (/* reexport safe */ _isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   "isBoolean": () => (/* reexport safe */ _isBoolean_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "isDataView": () => (/* reexport safe */ _isDataView_js__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   "isDate": () => (/* reexport safe */ _isDate_js__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   "isElement": () => (/* reexport safe */ _isElement_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "isEmpty": () => (/* reexport safe */ _isEmpty_js__WEBPACK_IMPORTED_MODULE_21__["default"]),
/* harmony export */   "isEqual": () => (/* reexport safe */ _isEqual_js__WEBPACK_IMPORTED_MODULE_23__["default"]),
/* harmony export */   "isError": () => (/* reexport safe */ _isError_js__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   "isFinite": () => (/* reexport safe */ _isFinite_js__WEBPACK_IMPORTED_MODULE_18__["default"]),
/* harmony export */   "isFunction": () => (/* reexport safe */ _isFunction_js__WEBPACK_IMPORTED_MODULE_16__["default"]),
/* harmony export */   "isMap": () => (/* reexport safe */ _isMap_js__WEBPACK_IMPORTED_MODULE_24__["default"]),
/* harmony export */   "isMatch": () => (/* reexport safe */ _isMatch_js__WEBPACK_IMPORTED_MODULE_22__["default"]),
/* harmony export */   "isNaN": () => (/* reexport safe */ _isNaN_js__WEBPACK_IMPORTED_MODULE_19__["default"]),
/* harmony export */   "isNull": () => (/* reexport safe */ _isNull_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "isNumber": () => (/* reexport safe */ _isNumber_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "isObject": () => (/* reexport safe */ _isObject_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "isRegExp": () => (/* reexport safe */ _isRegExp_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "isSet": () => (/* reexport safe */ _isSet_js__WEBPACK_IMPORTED_MODULE_26__["default"]),
/* harmony export */   "isString": () => (/* reexport safe */ _isString_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "isSymbol": () => (/* reexport safe */ _isSymbol_js__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   "isTypedArray": () => (/* reexport safe */ _isTypedArray_js__WEBPACK_IMPORTED_MODULE_20__["default"]),
/* harmony export */   "isUndefined": () => (/* reexport safe */ _isUndefined_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "isWeakMap": () => (/* reexport safe */ _isWeakMap_js__WEBPACK_IMPORTED_MODULE_25__["default"]),
/* harmony export */   "isWeakSet": () => (/* reexport safe */ _isWeakSet_js__WEBPACK_IMPORTED_MODULE_27__["default"]),
/* harmony export */   "iteratee": () => (/* reexport safe */ _iteratee_js__WEBPACK_IMPORTED_MODULE_60__["default"]),
/* harmony export */   "keys": () => (/* reexport safe */ _keys_js__WEBPACK_IMPORTED_MODULE_28__["default"]),
/* harmony export */   "last": () => (/* reexport safe */ _last_js__WEBPACK_IMPORTED_MODULE_110__["default"]),
/* harmony export */   "lastIndexOf": () => (/* reexport safe */ _lastIndexOf_js__WEBPACK_IMPORTED_MODULE_80__["default"]),
/* harmony export */   "map": () => (/* reexport safe */ _map_js__WEBPACK_IMPORTED_MODULE_84__["default"]),
/* harmony export */   "mapObject": () => (/* reexport safe */ _mapObject_js__WEBPACK_IMPORTED_MODULE_42__["default"]),
/* harmony export */   "matcher": () => (/* reexport safe */ _matcher_js__WEBPACK_IMPORTED_MODULE_49__["default"]),
/* harmony export */   "matches": () => (/* reexport safe */ _matcher_js__WEBPACK_IMPORTED_MODULE_49__["default"]),
/* harmony export */   "max": () => (/* reexport safe */ _max_js__WEBPACK_IMPORTED_MODULE_95__["default"]),
/* harmony export */   "memoize": () => (/* reexport safe */ _memoize_js__WEBPACK_IMPORTED_MODULE_64__["default"]),
/* harmony export */   "methods": () => (/* reexport safe */ _functions_js__WEBPACK_IMPORTED_MODULE_33__["default"]),
/* harmony export */   "min": () => (/* reexport safe */ _min_js__WEBPACK_IMPORTED_MODULE_96__["default"]),
/* harmony export */   "mixin": () => (/* reexport safe */ _mixin_js__WEBPACK_IMPORTED_MODULE_124__["default"]),
/* harmony export */   "negate": () => (/* reexport safe */ _negate_js__WEBPACK_IMPORTED_MODULE_70__["default"]),
/* harmony export */   "noop": () => (/* reexport safe */ _noop_js__WEBPACK_IMPORTED_MODULE_45__["default"]),
/* harmony export */   "now": () => (/* reexport safe */ _now_js__WEBPACK_IMPORTED_MODULE_52__["default"]),
/* harmony export */   "object": () => (/* reexport safe */ _object_js__WEBPACK_IMPORTED_MODULE_121__["default"]),
/* harmony export */   "omit": () => (/* reexport safe */ _omit_js__WEBPACK_IMPORTED_MODULE_107__["default"]),
/* harmony export */   "once": () => (/* reexport safe */ _once_js__WEBPACK_IMPORTED_MODULE_74__["default"]),
/* harmony export */   "pairs": () => (/* reexport safe */ _pairs_js__WEBPACK_IMPORTED_MODULE_31__["default"]),
/* harmony export */   "partial": () => (/* reexport safe */ _partial_js__WEBPACK_IMPORTED_MODULE_61__["default"]),
/* harmony export */   "partition": () => (/* reexport safe */ _partition_js__WEBPACK_IMPORTED_MODULE_103__["default"]),
/* harmony export */   "pick": () => (/* reexport safe */ _pick_js__WEBPACK_IMPORTED_MODULE_106__["default"]),
/* harmony export */   "pluck": () => (/* reexport safe */ _pluck_js__WEBPACK_IMPORTED_MODULE_93__["default"]),
/* harmony export */   "property": () => (/* reexport safe */ _property_js__WEBPACK_IMPORTED_MODULE_47__["default"]),
/* harmony export */   "propertyOf": () => (/* reexport safe */ _propertyOf_js__WEBPACK_IMPORTED_MODULE_48__["default"]),
/* harmony export */   "random": () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_51__["default"]),
/* harmony export */   "range": () => (/* reexport safe */ _range_js__WEBPACK_IMPORTED_MODULE_122__["default"]),
/* harmony export */   "reduce": () => (/* reexport safe */ _reduce_js__WEBPACK_IMPORTED_MODULE_85__["default"]),
/* harmony export */   "reduceRight": () => (/* reexport safe */ _reduceRight_js__WEBPACK_IMPORTED_MODULE_86__["default"]),
/* harmony export */   "reject": () => (/* reexport safe */ _reject_js__WEBPACK_IMPORTED_MODULE_88__["default"]),
/* harmony export */   "rest": () => (/* reexport safe */ _rest_js__WEBPACK_IMPORTED_MODULE_111__["default"]),
/* harmony export */   "restArguments": () => (/* reexport safe */ _restArguments_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "result": () => (/* reexport safe */ _result_js__WEBPACK_IMPORTED_MODULE_57__["default"]),
/* harmony export */   "sample": () => (/* reexport safe */ _sample_js__WEBPACK_IMPORTED_MODULE_98__["default"]),
/* harmony export */   "select": () => (/* reexport safe */ _filter_js__WEBPACK_IMPORTED_MODULE_87__["default"]),
/* harmony export */   "shuffle": () => (/* reexport safe */ _shuffle_js__WEBPACK_IMPORTED_MODULE_97__["default"]),
/* harmony export */   "size": () => (/* reexport safe */ _size_js__WEBPACK_IMPORTED_MODULE_105__["default"]),
/* harmony export */   "some": () => (/* reexport safe */ _some_js__WEBPACK_IMPORTED_MODULE_90__["default"]),
/* harmony export */   "sortBy": () => (/* reexport safe */ _sortBy_js__WEBPACK_IMPORTED_MODULE_99__["default"]),
/* harmony export */   "sortedIndex": () => (/* reexport safe */ _sortedIndex_js__WEBPACK_IMPORTED_MODULE_78__["default"]),
/* harmony export */   "tail": () => (/* reexport safe */ _rest_js__WEBPACK_IMPORTED_MODULE_111__["default"]),
/* harmony export */   "take": () => (/* reexport safe */ _first_js__WEBPACK_IMPORTED_MODULE_108__["default"]),
/* harmony export */   "tap": () => (/* reexport safe */ _tap_js__WEBPACK_IMPORTED_MODULE_39__["default"]),
/* harmony export */   "template": () => (/* reexport safe */ _template_js__WEBPACK_IMPORTED_MODULE_56__["default"]),
/* harmony export */   "templateSettings": () => (/* reexport safe */ _templateSettings_js__WEBPACK_IMPORTED_MODULE_55__["default"]),
/* harmony export */   "throttle": () => (/* reexport safe */ _throttle_js__WEBPACK_IMPORTED_MODULE_67__["default"]),
/* harmony export */   "times": () => (/* reexport safe */ _times_js__WEBPACK_IMPORTED_MODULE_50__["default"]),
/* harmony export */   "toArray": () => (/* reexport safe */ _toArray_js__WEBPACK_IMPORTED_MODULE_104__["default"]),
/* harmony export */   "toPath": () => (/* reexport safe */ _toPath_js__WEBPACK_IMPORTED_MODULE_46__["default"]),
/* harmony export */   "transpose": () => (/* reexport safe */ _unzip_js__WEBPACK_IMPORTED_MODULE_119__["default"]),
/* harmony export */   "unescape": () => (/* reexport safe */ _unescape_js__WEBPACK_IMPORTED_MODULE_54__["default"]),
/* harmony export */   "union": () => (/* reexport safe */ _union_js__WEBPACK_IMPORTED_MODULE_116__["default"]),
/* harmony export */   "uniq": () => (/* reexport safe */ _uniq_js__WEBPACK_IMPORTED_MODULE_115__["default"]),
/* harmony export */   "unique": () => (/* reexport safe */ _uniq_js__WEBPACK_IMPORTED_MODULE_115__["default"]),
/* harmony export */   "uniqueId": () => (/* reexport safe */ _uniqueId_js__WEBPACK_IMPORTED_MODULE_58__["default"]),
/* harmony export */   "unzip": () => (/* reexport safe */ _unzip_js__WEBPACK_IMPORTED_MODULE_119__["default"]),
/* harmony export */   "values": () => (/* reexport safe */ _values_js__WEBPACK_IMPORTED_MODULE_30__["default"]),
/* harmony export */   "where": () => (/* reexport safe */ _where_js__WEBPACK_IMPORTED_MODULE_94__["default"]),
/* harmony export */   "without": () => (/* reexport safe */ _without_js__WEBPACK_IMPORTED_MODULE_114__["default"]),
/* harmony export */   "wrap": () => (/* reexport safe */ _wrap_js__WEBPACK_IMPORTED_MODULE_69__["default"]),
/* harmony export */   "zip": () => (/* reexport safe */ _zip_js__WEBPACK_IMPORTED_MODULE_120__["default"])
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _isNull_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isNull.js */ "./node_modules/underscore/modules/isNull.js");
/* harmony import */ var _isUndefined_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isUndefined.js */ "./node_modules/underscore/modules/isUndefined.js");
/* harmony import */ var _isBoolean_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isBoolean.js */ "./node_modules/underscore/modules/isBoolean.js");
/* harmony import */ var _isElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isElement.js */ "./node_modules/underscore/modules/isElement.js");
/* harmony import */ var _isString_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./isString.js */ "./node_modules/underscore/modules/isString.js");
/* harmony import */ var _isNumber_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./isNumber.js */ "./node_modules/underscore/modules/isNumber.js");
/* harmony import */ var _isDate_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./isDate.js */ "./node_modules/underscore/modules/isDate.js");
/* harmony import */ var _isRegExp_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./isRegExp.js */ "./node_modules/underscore/modules/isRegExp.js");
/* harmony import */ var _isError_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./isError.js */ "./node_modules/underscore/modules/isError.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/underscore/modules/isSymbol.js");
/* harmony import */ var _isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./isArrayBuffer.js */ "./node_modules/underscore/modules/isArrayBuffer.js");
/* harmony import */ var _isDataView_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./isDataView.js */ "./node_modules/underscore/modules/isDataView.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/underscore/modules/isArguments.js");
/* harmony import */ var _isFinite_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./isFinite.js */ "./node_modules/underscore/modules/isFinite.js");
/* harmony import */ var _isNaN_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./isNaN.js */ "./node_modules/underscore/modules/isNaN.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/underscore/modules/isTypedArray.js");
/* harmony import */ var _isEmpty_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./isEmpty.js */ "./node_modules/underscore/modules/isEmpty.js");
/* harmony import */ var _isMatch_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./isMatch.js */ "./node_modules/underscore/modules/isMatch.js");
/* harmony import */ var _isEqual_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./isEqual.js */ "./node_modules/underscore/modules/isEqual.js");
/* harmony import */ var _isMap_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./isMap.js */ "./node_modules/underscore/modules/isMap.js");
/* harmony import */ var _isWeakMap_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./isWeakMap.js */ "./node_modules/underscore/modules/isWeakMap.js");
/* harmony import */ var _isSet_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./isSet.js */ "./node_modules/underscore/modules/isSet.js");
/* harmony import */ var _isWeakSet_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./isWeakSet.js */ "./node_modules/underscore/modules/isWeakSet.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _pairs_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./pairs.js */ "./node_modules/underscore/modules/pairs.js");
/* harmony import */ var _invert_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./invert.js */ "./node_modules/underscore/modules/invert.js");
/* harmony import */ var _functions_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./functions.js */ "./node_modules/underscore/modules/functions.js");
/* harmony import */ var _extend_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./extend.js */ "./node_modules/underscore/modules/extend.js");
/* harmony import */ var _extendOwn_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./extendOwn.js */ "./node_modules/underscore/modules/extendOwn.js");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/underscore/modules/defaults.js");
/* harmony import */ var _create_js__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./create.js */ "./node_modules/underscore/modules/create.js");
/* harmony import */ var _clone_js__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./clone.js */ "./node_modules/underscore/modules/clone.js");
/* harmony import */ var _tap_js__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./tap.js */ "./node_modules/underscore/modules/tap.js");
/* harmony import */ var _get_js__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./get.js */ "./node_modules/underscore/modules/get.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./has.js */ "./node_modules/underscore/modules/has.js");
/* harmony import */ var _mapObject_js__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./mapObject.js */ "./node_modules/underscore/modules/mapObject.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./identity.js */ "./node_modules/underscore/modules/identity.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./constant.js */ "./node_modules/underscore/modules/constant.js");
/* harmony import */ var _noop_js__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./noop.js */ "./node_modules/underscore/modules/noop.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./toPath.js */ "./node_modules/underscore/modules/toPath.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./property.js */ "./node_modules/underscore/modules/property.js");
/* harmony import */ var _propertyOf_js__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./propertyOf.js */ "./node_modules/underscore/modules/propertyOf.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");
/* harmony import */ var _times_js__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./times.js */ "./node_modules/underscore/modules/times.js");
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./random.js */ "./node_modules/underscore/modules/random.js");
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./now.js */ "./node_modules/underscore/modules/now.js");
/* harmony import */ var _escape_js__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./escape.js */ "./node_modules/underscore/modules/escape.js");
/* harmony import */ var _unescape_js__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./unescape.js */ "./node_modules/underscore/modules/unescape.js");
/* harmony import */ var _templateSettings_js__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./templateSettings.js */ "./node_modules/underscore/modules/templateSettings.js");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./template.js */ "./node_modules/underscore/modules/template.js");
/* harmony import */ var _result_js__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./result.js */ "./node_modules/underscore/modules/result.js");
/* harmony import */ var _uniqueId_js__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./uniqueId.js */ "./node_modules/underscore/modules/uniqueId.js");
/* harmony import */ var _chain_js__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./chain.js */ "./node_modules/underscore/modules/chain.js");
/* harmony import */ var _iteratee_js__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./iteratee.js */ "./node_modules/underscore/modules/iteratee.js");
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");
/* harmony import */ var _bind_js__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./bind.js */ "./node_modules/underscore/modules/bind.js");
/* harmony import */ var _bindAll_js__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./bindAll.js */ "./node_modules/underscore/modules/bindAll.js");
/* harmony import */ var _memoize_js__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./memoize.js */ "./node_modules/underscore/modules/memoize.js");
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ./delay.js */ "./node_modules/underscore/modules/delay.js");
/* harmony import */ var _defer_js__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./defer.js */ "./node_modules/underscore/modules/defer.js");
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ./throttle.js */ "./node_modules/underscore/modules/throttle.js");
/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ./debounce.js */ "./node_modules/underscore/modules/debounce.js");
/* harmony import */ var _wrap_js__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ./wrap.js */ "./node_modules/underscore/modules/wrap.js");
/* harmony import */ var _negate_js__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ./negate.js */ "./node_modules/underscore/modules/negate.js");
/* harmony import */ var _compose_js__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ./compose.js */ "./node_modules/underscore/modules/compose.js");
/* harmony import */ var _after_js__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ./after.js */ "./node_modules/underscore/modules/after.js");
/* harmony import */ var _before_js__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(/*! ./before.js */ "./node_modules/underscore/modules/before.js");
/* harmony import */ var _once_js__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(/*! ./once.js */ "./node_modules/underscore/modules/once.js");
/* harmony import */ var _findKey_js__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(/*! ./findKey.js */ "./node_modules/underscore/modules/findKey.js");
/* harmony import */ var _findIndex_js__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(/*! ./findIndex.js */ "./node_modules/underscore/modules/findIndex.js");
/* harmony import */ var _findLastIndex_js__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(/*! ./findLastIndex.js */ "./node_modules/underscore/modules/findLastIndex.js");
/* harmony import */ var _sortedIndex_js__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(/*! ./sortedIndex.js */ "./node_modules/underscore/modules/sortedIndex.js");
/* harmony import */ var _indexOf_js__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(/*! ./indexOf.js */ "./node_modules/underscore/modules/indexOf.js");
/* harmony import */ var _lastIndexOf_js__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(/*! ./lastIndexOf.js */ "./node_modules/underscore/modules/lastIndexOf.js");
/* harmony import */ var _find_js__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(/*! ./find.js */ "./node_modules/underscore/modules/find.js");
/* harmony import */ var _findWhere_js__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(/*! ./findWhere.js */ "./node_modules/underscore/modules/findWhere.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _reduce_js__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(/*! ./reduce.js */ "./node_modules/underscore/modules/reduce.js");
/* harmony import */ var _reduceRight_js__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(/*! ./reduceRight.js */ "./node_modules/underscore/modules/reduceRight.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _reject_js__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(/*! ./reject.js */ "./node_modules/underscore/modules/reject.js");
/* harmony import */ var _every_js__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(/*! ./every.js */ "./node_modules/underscore/modules/every.js");
/* harmony import */ var _some_js__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(/*! ./some.js */ "./node_modules/underscore/modules/some.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");
/* harmony import */ var _invoke_js__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(/*! ./invoke.js */ "./node_modules/underscore/modules/invoke.js");
/* harmony import */ var _pluck_js__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(/*! ./pluck.js */ "./node_modules/underscore/modules/pluck.js");
/* harmony import */ var _where_js__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(/*! ./where.js */ "./node_modules/underscore/modules/where.js");
/* harmony import */ var _max_js__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(/*! ./max.js */ "./node_modules/underscore/modules/max.js");
/* harmony import */ var _min_js__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(/*! ./min.js */ "./node_modules/underscore/modules/min.js");
/* harmony import */ var _shuffle_js__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(/*! ./shuffle.js */ "./node_modules/underscore/modules/shuffle.js");
/* harmony import */ var _sample_js__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(/*! ./sample.js */ "./node_modules/underscore/modules/sample.js");
/* harmony import */ var _sortBy_js__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(/*! ./sortBy.js */ "./node_modules/underscore/modules/sortBy.js");
/* harmony import */ var _groupBy_js__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(/*! ./groupBy.js */ "./node_modules/underscore/modules/groupBy.js");
/* harmony import */ var _indexBy_js__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(/*! ./indexBy.js */ "./node_modules/underscore/modules/indexBy.js");
/* harmony import */ var _countBy_js__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(/*! ./countBy.js */ "./node_modules/underscore/modules/countBy.js");
/* harmony import */ var _partition_js__WEBPACK_IMPORTED_MODULE_103__ = __webpack_require__(/*! ./partition.js */ "./node_modules/underscore/modules/partition.js");
/* harmony import */ var _toArray_js__WEBPACK_IMPORTED_MODULE_104__ = __webpack_require__(/*! ./toArray.js */ "./node_modules/underscore/modules/toArray.js");
/* harmony import */ var _size_js__WEBPACK_IMPORTED_MODULE_105__ = __webpack_require__(/*! ./size.js */ "./node_modules/underscore/modules/size.js");
/* harmony import */ var _pick_js__WEBPACK_IMPORTED_MODULE_106__ = __webpack_require__(/*! ./pick.js */ "./node_modules/underscore/modules/pick.js");
/* harmony import */ var _omit_js__WEBPACK_IMPORTED_MODULE_107__ = __webpack_require__(/*! ./omit.js */ "./node_modules/underscore/modules/omit.js");
/* harmony import */ var _first_js__WEBPACK_IMPORTED_MODULE_108__ = __webpack_require__(/*! ./first.js */ "./node_modules/underscore/modules/first.js");
/* harmony import */ var _initial_js__WEBPACK_IMPORTED_MODULE_109__ = __webpack_require__(/*! ./initial.js */ "./node_modules/underscore/modules/initial.js");
/* harmony import */ var _last_js__WEBPACK_IMPORTED_MODULE_110__ = __webpack_require__(/*! ./last.js */ "./node_modules/underscore/modules/last.js");
/* harmony import */ var _rest_js__WEBPACK_IMPORTED_MODULE_111__ = __webpack_require__(/*! ./rest.js */ "./node_modules/underscore/modules/rest.js");
/* harmony import */ var _compact_js__WEBPACK_IMPORTED_MODULE_112__ = __webpack_require__(/*! ./compact.js */ "./node_modules/underscore/modules/compact.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_113__ = __webpack_require__(/*! ./flatten.js */ "./node_modules/underscore/modules/flatten.js");
/* harmony import */ var _without_js__WEBPACK_IMPORTED_MODULE_114__ = __webpack_require__(/*! ./without.js */ "./node_modules/underscore/modules/without.js");
/* harmony import */ var _uniq_js__WEBPACK_IMPORTED_MODULE_115__ = __webpack_require__(/*! ./uniq.js */ "./node_modules/underscore/modules/uniq.js");
/* harmony import */ var _union_js__WEBPACK_IMPORTED_MODULE_116__ = __webpack_require__(/*! ./union.js */ "./node_modules/underscore/modules/union.js");
/* harmony import */ var _intersection_js__WEBPACK_IMPORTED_MODULE_117__ = __webpack_require__(/*! ./intersection.js */ "./node_modules/underscore/modules/intersection.js");
/* harmony import */ var _difference_js__WEBPACK_IMPORTED_MODULE_118__ = __webpack_require__(/*! ./difference.js */ "./node_modules/underscore/modules/difference.js");
/* harmony import */ var _unzip_js__WEBPACK_IMPORTED_MODULE_119__ = __webpack_require__(/*! ./unzip.js */ "./node_modules/underscore/modules/unzip.js");
/* harmony import */ var _zip_js__WEBPACK_IMPORTED_MODULE_120__ = __webpack_require__(/*! ./zip.js */ "./node_modules/underscore/modules/zip.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_121__ = __webpack_require__(/*! ./object.js */ "./node_modules/underscore/modules/object.js");
/* harmony import */ var _range_js__WEBPACK_IMPORTED_MODULE_122__ = __webpack_require__(/*! ./range.js */ "./node_modules/underscore/modules/range.js");
/* harmony import */ var _chunk_js__WEBPACK_IMPORTED_MODULE_123__ = __webpack_require__(/*! ./chunk.js */ "./node_modules/underscore/modules/chunk.js");
/* harmony import */ var _mixin_js__WEBPACK_IMPORTED_MODULE_124__ = __webpack_require__(/*! ./mixin.js */ "./node_modules/underscore/modules/mixin.js");
/* harmony import */ var _underscore_array_methods_js__WEBPACK_IMPORTED_MODULE_125__ = __webpack_require__(/*! ./underscore-array-methods.js */ "./node_modules/underscore/modules/underscore-array-methods.js");
// Named Exports
// =============

//     Underscore.js 1.13.6
//     https://underscorejs.org
//     (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// Baseline setup.



// Object Functions
// ----------------
// Our most fundamental functions operate on any JavaScript object.
// Most functions in Underscore depend on at least one function in this section.

// A group of functions that check the types of core JavaScript values.
// These are often informally referred to as the "isType" functions.



























// Functions that treat an object as a dictionary of key-value pairs.
















// Utility Functions
// -----------------
// A bit of a grab bag: Predicate-generating functions for use with filters and
// loops, string escaping and templating, create random numbers and unique ids,
// and functions that facilitate Underscore's chaining and iteration conventions.



















// Function (ahem) Functions
// -------------------------
// These functions take a function as an argument and return a new function
// as the result. Also known as higher-order functions.















// Finders
// -------
// Functions that extract (the position of) a single element from an object
// or array based on some criterion.









// Collection Functions
// --------------------
// Functions that work on any collection of elements: either an array, or
// an object of key-value pairs.
























// `_.pick` and `_.omit` are actually object functions, but we put
// them here in order to create a more natural reading order in the
// monolithic build as they depend on `_.contains`.



// Array Functions
// ---------------
// Functions that operate on arrays (and array-likes) only, because they’re
// expressed in terms of operations on an ordered list of values.

















// OOP
// ---
// These modules support the "object-oriented" calling style. See also
// `underscore.js` and `index-default.js`.



/***/ }),

/***/ "./node_modules/underscore/modules/indexBy.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/indexBy.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");


// Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (result, value, key) {
  result[key] = value;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/indexOf.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/indexOf.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sortedIndex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sortedIndex.js */ "./node_modules/underscore/modules/sortedIndex.js");
/* harmony import */ var _findIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./findIndex.js */ "./node_modules/underscore/modules/findIndex.js");
/* harmony import */ var _createIndexFinder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_createIndexFinder.js */ "./node_modules/underscore/modules/_createIndexFinder.js");




// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createIndexFinder_js__WEBPACK_IMPORTED_MODULE_2__["default"])(1, _findIndex_js__WEBPACK_IMPORTED_MODULE_1__["default"], _sortedIndex_js__WEBPACK_IMPORTED_MODULE_0__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/initial.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/initial.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initial)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
function initial(array, n, guard) {
  return _setup_js__WEBPACK_IMPORTED_MODULE_0__.slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

/***/ }),

/***/ "./node_modules/underscore/modules/intersection.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/intersection.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ intersection)
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");



// Produce an array that contains every item shared between all the
// passed-in arrays.
function intersection(array) {
  var result = [];
  var argsLength = arguments.length;
  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array); i < length; i++) {
    var item = array[i];
    if ((0,_contains_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!(0,_contains_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arguments[j], item)) break;
    }
    if (j === argsLength) result.push(item);
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/invert.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/invert.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ invert)
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


// Invert the keys and values of an object. The values must be serializable.
function invert(obj) {
  var result = {};
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result[obj[_keys[i]]] = _keys[i];
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/invoke.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/invoke.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _deepGet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_deepGet.js */ "./node_modules/underscore/modules/_deepGet.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");






// Invoke a method (with arguments) on every item in a collection.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (obj, path, args) {
  var contextPath, func;
  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path)) {
    func = path;
  } else {
    path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_4__["default"])(path);
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return (0,_map_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj, function (context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = (0,_deepGet_js__WEBPACK_IMPORTED_MODULE_3__["default"])(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
}));

/***/ }),

/***/ "./node_modules/underscore/modules/isArguments.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/isArguments.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");


var isArguments = (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Arguments');

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function () {
  if (!isArguments(arguments)) {
    isArguments = function isArguments(obj) {
      return (0,_has_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj, 'callee');
    };
  }
})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArguments);

/***/ }),

/***/ "./node_modules/underscore/modules/isArray.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isArray.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");



// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_setup_js__WEBPACK_IMPORTED_MODULE_0__.nativeIsArray || (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_1__["default"])('Array'));

/***/ }),

/***/ "./node_modules/underscore/modules/isArrayBuffer.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/isArrayBuffer.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('ArrayBuffer'));

/***/ }),

/***/ "./node_modules/underscore/modules/isBoolean.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isBoolean.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isBoolean)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// Is a given value a boolean?
function isBoolean(obj) {
  return obj === true || obj === false || _setup_js__WEBPACK_IMPORTED_MODULE_0__.toString.call(obj) === '[object Boolean]';
}

/***/ }),

/***/ "./node_modules/underscore/modules/isDataView.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/isDataView.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArrayBuffer.js */ "./node_modules/underscore/modules/isArrayBuffer.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");




var isDataView = (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('DataView');

// In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.
function ie10IsDataView(obj) {
  return obj != null && (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj.getInt8) && (0,_isArrayBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj.buffer);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_3__.hasStringTagBug ? ie10IsDataView : isDataView);

/***/ }),

/***/ "./node_modules/underscore/modules/isDate.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/isDate.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Date'));

/***/ }),

/***/ "./node_modules/underscore/modules/isElement.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isElement.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isElement)
/* harmony export */ });
// Is a given value a DOM element?
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

/***/ }),

/***/ "./node_modules/underscore/modules/isEmpty.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isEmpty.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isEmpty)
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _isString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isString.js */ "./node_modules/underscore/modules/isString.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/underscore/modules/isArguments.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");






// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
  if (obj == null) return true;
  // Skip the more expensive `toString`-based type checks if `obj` has no
  // `.length`.
  var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj);
  if (typeof length == 'number' && ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) || (0,_isString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj))) return length === 0;
  return (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_keys_js__WEBPACK_IMPORTED_MODULE_4__["default"])(obj)) === 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isEqual.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isEqual.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isEqual)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _getByteLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getByteLength.js */ "./node_modules/underscore/modules/_getByteLength.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/underscore/modules/isTypedArray.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _isDataView_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isDataView.js */ "./node_modules/underscore/modules/isDataView.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");
/* harmony import */ var _toBufferView_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_toBufferView.js */ "./node_modules/underscore/modules/_toBufferView.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }











// We use this string twice, so give it a name for minification.
var tagDataView = '[object DataView]';

// Internal recursive comparison function for `_.isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) return false;
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) return b !== b;
  // Exhaust primitive checks
  var type = _typeof(a);
  if (type !== 'function' && type !== 'object' && _typeof(b) != 'object') return false;
  return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `_.isEqual`.
function deepEq(a, b, aStack, bStack) {
  // Unwrap any wrapped objects.
  if (a instanceof _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"]) a = a._wrapped;
  if (b instanceof _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"]) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = _setup_js__WEBPACK_IMPORTED_MODULE_1__.toString.call(a);
  if (className !== _setup_js__WEBPACK_IMPORTED_MODULE_1__.toString.call(b)) return false;
  // Work around a bug in IE 10 - Edge 13.
  if (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_5__.hasStringTagBug && className == '[object Object]' && (0,_isDataView_js__WEBPACK_IMPORTED_MODULE_6__["default"])(a)) {
    if (!(0,_isDataView_js__WEBPACK_IMPORTED_MODULE_6__["default"])(b)) return false;
    className = tagDataView;
  }
  switch (className) {
    // These types are compared by value.
    case '[object RegExp]':
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case '[object Symbol]':
      return _setup_js__WEBPACK_IMPORTED_MODULE_1__.SymbolProto.valueOf.call(a) === _setup_js__WEBPACK_IMPORTED_MODULE_1__.SymbolProto.valueOf.call(b);
    case '[object ArrayBuffer]':
    case tagDataView:
      // Coerce to typed array so we can fall through.
      return deepEq((0,_toBufferView_js__WEBPACK_IMPORTED_MODULE_9__["default"])(a), (0,_toBufferView_js__WEBPACK_IMPORTED_MODULE_9__["default"])(b), aStack, bStack);
  }
  var areArrays = className === '[object Array]';
  if (!areArrays && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__["default"])(a)) {
    var byteLength = (0,_getByteLength_js__WEBPACK_IMPORTED_MODULE_2__["default"])(a);
    if (byteLength !== (0,_getByteLength_js__WEBPACK_IMPORTED_MODULE_2__["default"])(b)) return false;
    if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
    areArrays = true;
  }
  if (!areArrays) {
    if (_typeof(a) != 'object' || _typeof(b) != 'object') return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor,
      bCtor = b.constructor;
    if (aCtor !== bCtor && !((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_4__["default"])(aCtor) && aCtor instanceof aCtor && (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_4__["default"])(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    // Deep compare objects.
    var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_7__["default"])(a),
      key;
    length = _keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if ((0,_keys_js__WEBPACK_IMPORTED_MODULE_7__["default"])(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = _keys[length];
      if (!((0,_has_js__WEBPACK_IMPORTED_MODULE_8__["default"])(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
  return eq(a, b);
}

/***/ }),

/***/ "./node_modules/underscore/modules/isError.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isError.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Error'));

/***/ }),

/***/ "./node_modules/underscore/modules/isFinite.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isFinite.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isFinite)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/underscore/modules/isSymbol.js");



// Is a given object a finite number?
function isFinite(obj) {
  return !(0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) && (0,_setup_js__WEBPACK_IMPORTED_MODULE_0__._isFinite)(obj) && !isNaN(parseFloat(obj));
}

/***/ }),

/***/ "./node_modules/underscore/modules/isFunction.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/isFunction.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }


var isFunction = (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Function');

// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = _setup_js__WEBPACK_IMPORTED_MODULE_1__.root.document && _setup_js__WEBPACK_IMPORTED_MODULE_1__.root.document.childNodes;
if ( true && (typeof Int8Array === "undefined" ? "undefined" : _typeof(Int8Array)) != 'object' && typeof nodelist != 'function') {
  isFunction = function isFunction(obj) {
    return typeof obj == 'function' || false;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFunction);

/***/ }),

/***/ "./node_modules/underscore/modules/isMap.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/isMap.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_methodFingerprint.js */ "./node_modules/underscore/modules/_methodFingerprint.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__.isIE11 ? (0,_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.ie11fingerprint)(_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.mapMethods) : (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Map'));

/***/ }),

/***/ "./node_modules/underscore/modules/isMatch.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/isMatch.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isMatch)
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


// Returns whether an object has a given set of `key:value` pairs.
function isMatch(object, attrs) {
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(attrs),
    length = _keys.length;
  if (object == null) return !length;
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isNaN.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/isNaN.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isNaN)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isNumber_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isNumber.js */ "./node_modules/underscore/modules/isNumber.js");



// Is the given value `NaN`?
function isNaN(obj) {
  return (0,_isNumber_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) && (0,_setup_js__WEBPACK_IMPORTED_MODULE_0__._isNaN)(obj);
}

/***/ }),

/***/ "./node_modules/underscore/modules/isNull.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/isNull.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isNull)
/* harmony export */ });
// Is a given value equal to null?
function isNull(obj) {
  return obj === null;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isNumber.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isNumber.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Number'));

/***/ }),

/***/ "./node_modules/underscore/modules/isObject.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isObject.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isObject)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
// Is a given variable an object?
function isObject(obj) {
  var type = _typeof(obj);
  return type === 'function' || type === 'object' && !!obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isRegExp.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isRegExp.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('RegExp'));

/***/ }),

/***/ "./node_modules/underscore/modules/isSet.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/isSet.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_methodFingerprint.js */ "./node_modules/underscore/modules/_methodFingerprint.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__.isIE11 ? (0,_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.ie11fingerprint)(_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.setMethods) : (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Set'));

/***/ }),

/***/ "./node_modules/underscore/modules/isString.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isString.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('String'));

/***/ }),

/***/ "./node_modules/underscore/modules/isSymbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/isSymbol.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('Symbol'));

/***/ }),

/***/ "./node_modules/underscore/modules/isTypedArray.js":
/*!*********************************************************!*\
  !*** ./node_modules/underscore/modules/isTypedArray.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isDataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isDataView.js */ "./node_modules/underscore/modules/isDataView.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constant.js */ "./node_modules/underscore/modules/constant.js");
/* harmony import */ var _isBufferLike_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_isBufferLike.js */ "./node_modules/underscore/modules/_isBufferLike.js");





// Is a given value a typed array?
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
  // `ArrayBuffer.isView` is the most future-proof, so use it when available.
  // Otherwise, fall back on the above regular expression.
  return _setup_js__WEBPACK_IMPORTED_MODULE_0__.nativeIsView ? (0,_setup_js__WEBPACK_IMPORTED_MODULE_0__.nativeIsView)(obj) && !(0,_isDataView_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) : (0,_isBufferLike_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj) && typedArrayPattern.test(_setup_js__WEBPACK_IMPORTED_MODULE_0__.toString.call(obj));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_setup_js__WEBPACK_IMPORTED_MODULE_0__.supportsArrayBuffer ? isTypedArray : (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])(false));

/***/ }),

/***/ "./node_modules/underscore/modules/isUndefined.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/isUndefined.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isUndefined)
/* harmony export */ });
// Is a given variable undefined?
function isUndefined(obj) {
  return obj === void 0;
}

/***/ }),

/***/ "./node_modules/underscore/modules/isWeakMap.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isWeakMap.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");
/* harmony import */ var _stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stringTagBug.js */ "./node_modules/underscore/modules/_stringTagBug.js");
/* harmony import */ var _methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_methodFingerprint.js */ "./node_modules/underscore/modules/_methodFingerprint.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_stringTagBug_js__WEBPACK_IMPORTED_MODULE_1__.isIE11 ? (0,_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.ie11fingerprint)(_methodFingerprint_js__WEBPACK_IMPORTED_MODULE_2__.weakMapMethods) : (0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('WeakMap'));

/***/ }),

/***/ "./node_modules/underscore/modules/isWeakSet.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/isWeakSet.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tagTester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_tagTester.js */ "./node_modules/underscore/modules/_tagTester.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_tagTester_js__WEBPACK_IMPORTED_MODULE_0__["default"])('WeakSet'));

/***/ }),

/***/ "./node_modules/underscore/modules/iteratee.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/iteratee.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ iteratee)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIteratee.js */ "./node_modules/underscore/modules/_baseIteratee.js");



// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only `argCount` argument.
function iteratee(value, context) {
  return (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value, context, Infinity);
}
_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].iteratee = iteratee;

/***/ }),

/***/ "./node_modules/underscore/modules/keys.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/keys.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ keys)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/underscore/modules/isObject.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");
/* harmony import */ var _collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_collectNonEnumProps.js */ "./node_modules/underscore/modules/_collectNonEnumProps.js");





// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
function keys(obj) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj)) return [];
  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeKeys) return (0,_setup_js__WEBPACK_IMPORTED_MODULE_1__.nativeKeys)(obj);
  var keys = [];
  for (var key in obj) if ((0,_has_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj, key)) keys.push(key);
  // Ahem, IE < 9.
  if (_setup_js__WEBPACK_IMPORTED_MODULE_1__.hasEnumBug) (0,_collectNonEnumProps_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj, keys);
  return keys;
}

/***/ }),

/***/ "./node_modules/underscore/modules/last.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/last.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ last)
/* harmony export */ });
/* harmony import */ var _rest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rest.js */ "./node_modules/underscore/modules/rest.js");


// Get the last element of an array. Passing **n** will return the last N
// values in the array.
function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return (0,_rest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, Math.max(0, array.length - n));
}

/***/ }),

/***/ "./node_modules/underscore/modules/lastIndexOf.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/lastIndexOf.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _findLastIndex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./findLastIndex.js */ "./node_modules/underscore/modules/findLastIndex.js");
/* harmony import */ var _createIndexFinder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_createIndexFinder.js */ "./node_modules/underscore/modules/_createIndexFinder.js");



// Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createIndexFinder_js__WEBPACK_IMPORTED_MODULE_1__["default"])(-1, _findLastIndex_js__WEBPACK_IMPORTED_MODULE_0__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/map.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/map.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ map)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");




// Return the results of applying the iteratee to each element.
function map(obj, iteratee, context) {
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, context);
  var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj),
    length = (_keys || obj).length,
    results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

/***/ }),

/***/ "./node_modules/underscore/modules/mapObject.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/mapObject.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mapObject)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");



// Returns the results of applying the `iteratee` to each element of `obj`.
// In contrast to `_.map` it returns an object.
function mapObject(obj, iteratee, context) {
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, context);
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj),
    length = _keys.length,
    results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

/***/ }),

/***/ "./node_modules/underscore/modules/matcher.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/matcher.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ matcher)
/* harmony export */ });
/* harmony import */ var _extendOwn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extendOwn.js */ "./node_modules/underscore/modules/extendOwn.js");
/* harmony import */ var _isMatch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isMatch.js */ "./node_modules/underscore/modules/isMatch.js");



// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
function matcher(attrs) {
  attrs = (0,_extendOwn_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, attrs);
  return function (obj) {
    return (0,_isMatch_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj, attrs);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/max.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/max.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ max)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }





// Return the maximum element (or element-based computation).
function max(obj, iteratee, context) {
  var result = -Infinity,
    lastComputed = -Infinity,
    value,
    computed;
  if (iteratee == null || typeof iteratee == 'number' && _typeof(obj[0]) != 'object' && obj != null) {
    obj = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj) ? obj : (0,_values_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_2__["default"])(iteratee, context);
    (0,_each_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj, function (v, index, list) {
      computed = iteratee(v, index, list);
      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/memoize.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/memoize.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoize)
/* harmony export */ });
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_has.js */ "./node_modules/underscore/modules/_has.js");


// Memoize an expensive function by storing its results.
function memoize(func, hasher) {
  var memoize = function memoize(key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!(0,_has_js__WEBPACK_IMPORTED_MODULE_0__["default"])(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}

/***/ }),

/***/ "./node_modules/underscore/modules/min.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/min.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ min)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }





// Return the minimum element (or element-based computation).
function min(obj, iteratee, context) {
  var result = Infinity,
    lastComputed = Infinity,
    value,
    computed;
  if (iteratee == null || typeof iteratee == 'number' && _typeof(obj[0]) != 'object' && obj != null) {
    obj = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj) ? obj : (0,_values_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_2__["default"])(iteratee, context);
    (0,_each_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj, function (v, index, list) {
      computed = iteratee(v, index, list);
      if (computed < lastComputed || computed === Infinity && result === Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/mixin.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/mixin.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mixin)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
/* harmony import */ var _functions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./functions.js */ "./node_modules/underscore/modules/functions.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _chainResult_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_chainResult.js */ "./node_modules/underscore/modules/_chainResult.js");






// Add your own custom functions to the Underscore object.
function mixin(obj) {
  (0,_each_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_functions_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj), function (name) {
    var func = _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"][name] = obj[name];
    _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype[name] = function () {
      var args = [this._wrapped];
      _setup_js__WEBPACK_IMPORTED_MODULE_3__.push.apply(args, arguments);
      return (0,_chainResult_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this, func.apply(_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"], args));
    };
  });
  return _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"];
}

/***/ }),

/***/ "./node_modules/underscore/modules/negate.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/negate.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ negate)
/* harmony export */ });
// Returns a negated version of the passed-in predicate.
function negate(predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/noop.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/noop.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ noop)
/* harmony export */ });
// Predicate-generating function. Often useful outside of Underscore.
function noop() {}

/***/ }),

/***/ "./node_modules/underscore/modules/now.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/now.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// A (possibly faster) way to get the current timestamp as an integer.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Date.now || function () {
  return new Date().getTime();
});

/***/ }),

/***/ "./node_modules/underscore/modules/object.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/object.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ object)
/* harmony export */ });
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");


// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of `_.pairs`.
function object(list, values) {
  var result = {};
  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/omit.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/omit.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _negate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./negate.js */ "./node_modules/underscore/modules/negate.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");
/* harmony import */ var _pick_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pick.js */ "./node_modules/underscore/modules/pick.js");








// Return a copy of the object without the disallowed properties.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (obj, keys) {
  var iteratee = keys[0],
    context;
  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratee)) {
    iteratee = (0,_negate_js__WEBPACK_IMPORTED_MODULE_2__["default"])(iteratee);
    if (keys.length > 1) context = keys[1];
  } else {
    keys = (0,_map_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_flatten_js__WEBPACK_IMPORTED_MODULE_4__["default"])(keys, false, false), String);
    iteratee = function iteratee(value, key) {
      return !(0,_contains_js__WEBPACK_IMPORTED_MODULE_5__["default"])(keys, key);
    };
  }
  return (0,_pick_js__WEBPACK_IMPORTED_MODULE_6__["default"])(obj, iteratee, context);
}));

/***/ }),

/***/ "./node_modules/underscore/modules/once.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/once.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");
/* harmony import */ var _before_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./before.js */ "./node_modules/underscore/modules/before.js");



// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_partial_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_before_js__WEBPACK_IMPORTED_MODULE_1__["default"], 2));

/***/ }),

/***/ "./node_modules/underscore/modules/pairs.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/pairs.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ pairs)
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


// Convert an object into a list of `[key, value]` pairs.
// The opposite of `_.object` with one argument.
function pairs(obj) {
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj);
  var length = _keys.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs;
}

/***/ }),

/***/ "./node_modules/underscore/modules/partial.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/partial.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _executeBound_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_executeBound.js */ "./node_modules/underscore/modules/_executeBound.js");
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");




// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. `_` acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var partial = (0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function bound() {
    var position = 0,
      length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return (0,_executeBound_js__WEBPACK_IMPORTED_MODULE_1__["default"])(func, bound, this, this, args);
  };
  return bound;
});
partial.placeholder = _underscore_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (partial);

/***/ }),

/***/ "./node_modules/underscore/modules/partition.js":
/*!******************************************************!*\
  !*** ./node_modules/underscore/modules/partition.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_group.js */ "./node_modules/underscore/modules/_group.js");


// Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_group_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true));

/***/ }),

/***/ "./node_modules/underscore/modules/pick.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/pick.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");
/* harmony import */ var _allKeys_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./allKeys.js */ "./node_modules/underscore/modules/allKeys.js");
/* harmony import */ var _keyInObj_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_keyInObj.js */ "./node_modules/underscore/modules/_keyInObj.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");







// Return a copy of the object only containing the allowed properties.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (obj, keys) {
  var result = {},
    iteratee = keys[0];
  if (obj == null) return result;
  if ((0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratee)) {
    if (keys.length > 1) iteratee = (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_2__["default"])(iteratee, keys[1]);
    keys = (0,_allKeys_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj);
  } else {
    iteratee = _keyInObj_js__WEBPACK_IMPORTED_MODULE_4__["default"];
    keys = (0,_flatten_js__WEBPACK_IMPORTED_MODULE_5__["default"])(keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }
  return result;
}));

/***/ }),

/***/ "./node_modules/underscore/modules/pluck.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/pluck.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ pluck)
/* harmony export */ });
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./property.js */ "./node_modules/underscore/modules/property.js");



// Convenience version of a common use case of `_.map`: fetching a property.
function pluck(obj, key) {
  return (0,_map_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, (0,_property_js__WEBPACK_IMPORTED_MODULE_1__["default"])(key));
}

/***/ }),

/***/ "./node_modules/underscore/modules/property.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/property.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ property)
/* harmony export */ });
/* harmony import */ var _deepGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_deepGet.js */ "./node_modules/underscore/modules/_deepGet.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");



// Creates a function that, when passed an object, will traverse that object’s
// properties down the given `path`, specified as an array of keys or indices.
function property(path) {
  path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path);
  return function (obj) {
    return (0,_deepGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, path);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/propertyOf.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/propertyOf.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ propertyOf)
/* harmony export */ });
/* harmony import */ var _noop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./noop.js */ "./node_modules/underscore/modules/noop.js");
/* harmony import */ var _get_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get.js */ "./node_modules/underscore/modules/get.js");



// Generates a function for a given object that returns a given property.
function propertyOf(obj) {
  if (obj == null) return _noop_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  return function (path) {
    return (0,_get_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj, path);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/random.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/random.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ random)
/* harmony export */ });
// Return a random integer between `min` and `max` (inclusive).
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

/***/ }),

/***/ "./node_modules/underscore/modules/range.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/range.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ range)
/* harmony export */ });
// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);
  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }
  return range;
}

/***/ }),

/***/ "./node_modules/underscore/modules/reduce.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/reduce.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createReduce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createReduce.js */ "./node_modules/underscore/modules/_createReduce.js");


// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createReduce_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1));

/***/ }),

/***/ "./node_modules/underscore/modules/reduceRight.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/reduceRight.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createReduce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createReduce.js */ "./node_modules/underscore/modules/_createReduce.js");


// The right-associative version of reduce, also known as `foldr`.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createReduce_js__WEBPACK_IMPORTED_MODULE_0__["default"])(-1));

/***/ }),

/***/ "./node_modules/underscore/modules/reject.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/reject.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ reject)
/* harmony export */ });
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _negate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./negate.js */ "./node_modules/underscore/modules/negate.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");




// Return all the elements for which a truth test fails.
function reject(obj, predicate, context) {
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, (0,_negate_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_cb_js__WEBPACK_IMPORTED_MODULE_2__["default"])(predicate)), context);
}

/***/ }),

/***/ "./node_modules/underscore/modules/rest.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/rest.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rest)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// Returns everything but the first entry of the `array`. Especially useful on
// the `arguments` object. Passing an **n** will return the rest N values in the
// `array`.
function rest(array, n, guard) {
  return _setup_js__WEBPACK_IMPORTED_MODULE_0__.slice.call(array, n == null || guard ? 1 : n);
}

/***/ }),

/***/ "./node_modules/underscore/modules/restArguments.js":
/*!**********************************************************!*\
  !*** ./node_modules/underscore/modules/restArguments.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ restArguments)
/* harmony export */ });
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
}

/***/ }),

/***/ "./node_modules/underscore/modules/result.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/result.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ result)
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/underscore/modules/isFunction.js");
/* harmony import */ var _toPath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toPath.js */ "./node_modules/underscore/modules/_toPath.js");



// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
function result(obj, path, fallback) {
  path = (0,_toPath_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path);
  var length = path.length;
  if (!length) {
    return (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_0__["default"])(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }

    obj = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_0__["default"])(prop) ? prop.call(obj) : prop;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/sample.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/sample.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sample)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./random.js */ "./node_modules/underscore/modules/random.js");
/* harmony import */ var _toArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./toArray.js */ "./node_modules/underscore/modules/toArray.js");






// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `_.map`.
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj)) obj = (0,_values_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj);
    return obj[(0,_random_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj.length - 1)];
  }
  var sample = (0,_toArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(obj);
  var length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_2__["default"])(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = (0,_random_js__WEBPACK_IMPORTED_MODULE_3__["default"])(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
}

/***/ }),

/***/ "./node_modules/underscore/modules/shuffle.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/shuffle.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shuffle)
/* harmony export */ });
/* harmony import */ var _sample_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sample.js */ "./node_modules/underscore/modules/sample.js");


// Shuffle a collection.
function shuffle(obj) {
  return (0,_sample_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, Infinity);
}

/***/ }),

/***/ "./node_modules/underscore/modules/size.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/size.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");



// Return the number of elements in a collection.
function size(obj) {
  if (obj == null) return 0;
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj) ? obj.length : (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj).length;
}

/***/ }),

/***/ "./node_modules/underscore/modules/some.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/some.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ some)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");




// Determine if at least one element in the object passes a truth test.
function some(obj, predicate, context) {
  predicate = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(predicate, context);
  var _keys = !(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj) && (0,_keys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj),
    length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}

/***/ }),

/***/ "./node_modules/underscore/modules/sortBy.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/sortBy.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sortBy)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _pluck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pluck.js */ "./node_modules/underscore/modules/pluck.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");




// Sort the object's values by a criterion produced by an iteratee.
function sortBy(obj, iteratee, context) {
  var index = 0;
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, context);
  return (0,_pluck_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_map_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj, function (value, key, list) {
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
    };
  }).sort(function (left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), 'value');
}

/***/ }),

/***/ "./node_modules/underscore/modules/sortedIndex.js":
/*!********************************************************!*\
  !*** ./node_modules/underscore/modules/sortedIndex.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sortedIndex)
/* harmony export */ });
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");



// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
function sortedIndex(array, obj, iteratee, context) {
  iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0,
    high = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_1__["default"])(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
  }
  return low;
}

/***/ }),

/***/ "./node_modules/underscore/modules/tap.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/tap.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tap)
/* harmony export */ });
// Invokes `interceptor` with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}

/***/ }),

/***/ "./node_modules/underscore/modules/template.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/template.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ template)
/* harmony export */ });
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/underscore/modules/defaults.js");
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _templateSettings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./templateSettings.js */ "./node_modules/underscore/modules/templateSettings.js");




// When customizing `_.templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  "\u2028": 'u2028',
  "\u2029": 'u2029'
};
var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
function escapeChar(match) {
  return '\\' + escapes[match];
}

// In order to prevent third-party code injection through
// `_.templateSettings.variable`, we test it against the following regular
// expression. It is intentionally a bit more liberal than just matching valid
// identifiers, but still prevents possible loopholes through defaults or
// destructuring assignment.
var bareIdentifier = /^\s*(\w|\$)+\s*$/;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = (0,_defaults_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, settings, _underscore_js__WEBPACK_IMPORTED_MODULE_1__["default"].templateSettings);

  // Combine delimiters into one regular expression via alternation.
  var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

  // Compile the template source, escaping string literals appropriately.
  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;
    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';\n";
  var argument = settings.variable;
  if (argument) {
    // Insure against third-party code injection. (CVE-2021-23358)
    if (!bareIdentifier.test(argument)) throw new Error('variable is not a bare identifier: ' + argument);
  } else {
    // If a variable is not specified, place data values in local scope.
    source = 'with(obj||{}){\n' + source + '}\n';
    argument = 'obj';
  }
  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
  var render;
  try {
    render = new Function(argument, '_', source);
  } catch (e) {
    e.source = source;
    throw e;
  }
  var template = function template(data) {
    return render.call(this, data, _underscore_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
  };

  // Provide the compiled source as a convenience for precompilation.
  template.source = 'function(' + argument + '){\n' + source + '}';
  return template;
}

/***/ }),

/***/ "./node_modules/underscore/modules/templateSettings.js":
/*!*************************************************************!*\
  !*** ./node_modules/underscore/modules/templateSettings.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");


// By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
});

/***/ }),

/***/ "./node_modules/underscore/modules/throttle.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/throttle.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ throttle)
/* harmony export */ });
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./now.js */ "./node_modules/underscore/modules/now.js");


// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};
  var later = function later() {
    previous = options.leading === false ? 0 : (0,_now_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  var throttled = function throttled() {
    var _now = (0,_now_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
}

/***/ }),

/***/ "./node_modules/underscore/modules/times.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/times.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ times)
/* harmony export */ });
/* harmony import */ var _optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_optimizeCb.js */ "./node_modules/underscore/modules/_optimizeCb.js");


// Run a function **n** times.
function times(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = (0,_optimizeCb_js__WEBPACK_IMPORTED_MODULE_0__["default"])(iteratee, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee(i);
  return accum;
}

/***/ }),

/***/ "./node_modules/underscore/modules/toArray.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/toArray.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toArray)
/* harmony export */ });
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _isString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isString.js */ "./node_modules/underscore/modules/isString.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_isArrayLike.js */ "./node_modules/underscore/modules/_isArrayLike.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./map.js */ "./node_modules/underscore/modules/map.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./identity.js */ "./node_modules/underscore/modules/identity.js");
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./values.js */ "./node_modules/underscore/modules/values.js");








// Safely create a real, live array from anything iterable.
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj)) return _setup_js__WEBPACK_IMPORTED_MODULE_1__.slice.call(obj);
  if ((0,_isString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj)) {
    // Keep surrogate pair characters together.
    return obj.match(reStrSymbol);
  }
  if ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_3__["default"])(obj)) return (0,_map_js__WEBPACK_IMPORTED_MODULE_4__["default"])(obj, _identity_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
  return (0,_values_js__WEBPACK_IMPORTED_MODULE_6__["default"])(obj);
}

/***/ }),

/***/ "./node_modules/underscore/modules/toPath.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/toPath.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPath)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/underscore/modules/isArray.js");



// Normalize a (deep) property `path` to array.
// Like `_.iteratee`, this function can be customized.
function toPath(path) {
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path) ? path : [path];
}
_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].toPath = toPath;

/***/ }),

/***/ "./node_modules/underscore/modules/underscore-array-methods.js":
/*!*********************************************************************!*\
  !*** ./node_modules/underscore/modules/underscore-array-methods.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _underscore_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./underscore.js */ "./node_modules/underscore/modules/underscore.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./each.js */ "./node_modules/underscore/modules/each.js");
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");
/* harmony import */ var _chainResult_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_chainResult.js */ "./node_modules/underscore/modules/_chainResult.js");





// Add all mutator `Array` functions to the wrapper.
(0,_each_js__WEBPACK_IMPORTED_MODULE_1__["default"])(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
  var method = _setup_js__WEBPACK_IMPORTED_MODULE_2__.ArrayProto[name];
  _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) {
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) {
        delete obj[0];
      }
    }
    return (0,_chainResult_js__WEBPACK_IMPORTED_MODULE_3__["default"])(this, obj);
  };
});

// Add all accessor `Array` functions to the wrapper.
(0,_each_js__WEBPACK_IMPORTED_MODULE_1__["default"])(['concat', 'join', 'slice'], function (name) {
  var method = _setup_js__WEBPACK_IMPORTED_MODULE_2__.ArrayProto[name];
  _underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return (0,_chainResult_js__WEBPACK_IMPORTED_MODULE_3__["default"])(this, obj);
  };
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_underscore_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./node_modules/underscore/modules/underscore.js":
/*!*******************************************************!*\
  !*** ./node_modules/underscore/modules/underscore.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _)
/* harmony export */ });
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setup.js */ "./node_modules/underscore/modules/_setup.js");


// If Underscore is called as a function, it returns a wrapped object that can
// be used OO-style. This wrapper holds altered versions of all functions added
// through `_.mixin`. Wrapped objects may be chained.
function _(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}
_.VERSION = _setup_js__WEBPACK_IMPORTED_MODULE_0__.VERSION;

// Extracts the result from a wrapped and chained object.
_.prototype.value = function () {
  return this._wrapped;
};

// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
_.prototype.toString = function () {
  return String(this._wrapped);
};

/***/ }),

/***/ "./node_modules/underscore/modules/unescape.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/unescape.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createEscaper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createEscaper.js */ "./node_modules/underscore/modules/_createEscaper.js");
/* harmony import */ var _unescapeMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_unescapeMap.js */ "./node_modules/underscore/modules/_unescapeMap.js");



// Function for unescaping strings from HTML interpolation.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createEscaper_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_unescapeMap_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/underscore/modules/union.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/union.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _uniq_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uniq.js */ "./node_modules/underscore/modules/uniq.js");
/* harmony import */ var _flatten_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_flatten.js */ "./node_modules/underscore/modules/_flatten.js");




// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (arrays) {
  return (0,_uniq_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_flatten_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arrays, true, true));
}));

/***/ }),

/***/ "./node_modules/underscore/modules/uniq.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/uniq.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ uniq)
/* harmony export */ });
/* harmony import */ var _isBoolean_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isBoolean.js */ "./node_modules/underscore/modules/isBoolean.js");
/* harmony import */ var _cb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_cb.js */ "./node_modules/underscore/modules/_cb.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contains.js */ "./node_modules/underscore/modules/contains.js");





// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
function uniq(array, isSorted, iteratee, context) {
  if (!(0,_isBoolean_js__WEBPACK_IMPORTED_MODULE_0__["default"])(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee != null) iteratee = (0,_cb_js__WEBPACK_IMPORTED_MODULE_1__["default"])(iteratee, context);
  var result = [];
  var seen = [];
  for (var i = 0, length = (0,_getLength_js__WEBPACK_IMPORTED_MODULE_2__["default"])(array); i < length; i++) {
    var value = array[i],
      computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted && !iteratee) {
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      if (!(0,_contains_js__WEBPACK_IMPORTED_MODULE_3__["default"])(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!(0,_contains_js__WEBPACK_IMPORTED_MODULE_3__["default"])(result, value)) {
      result.push(value);
    }
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/uniqueId.js":
/*!*****************************************************!*\
  !*** ./node_modules/underscore/modules/uniqueId.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ uniqueId)
/* harmony export */ });
// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
}

/***/ }),

/***/ "./node_modules/underscore/modules/unzip.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/unzip.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unzip)
/* harmony export */ });
/* harmony import */ var _max_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./max.js */ "./node_modules/underscore/modules/max.js");
/* harmony import */ var _getLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getLength.js */ "./node_modules/underscore/modules/_getLength.js");
/* harmony import */ var _pluck_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pluck.js */ "./node_modules/underscore/modules/pluck.js");




// Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
function unzip(array) {
  var length = array && (0,_max_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, _getLength_js__WEBPACK_IMPORTED_MODULE_1__["default"]).length || 0;
  var result = Array(length);
  for (var index = 0; index < length; index++) {
    result[index] = (0,_pluck_js__WEBPACK_IMPORTED_MODULE_2__["default"])(array, index);
  }
  return result;
}

/***/ }),

/***/ "./node_modules/underscore/modules/values.js":
/*!***************************************************!*\
  !*** ./node_modules/underscore/modules/values.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ values)
/* harmony export */ });
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ "./node_modules/underscore/modules/keys.js");


// Retrieve the values of an object's properties.
function values(obj) {
  var _keys = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj);
  var length = _keys.length;
  var values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[_keys[i]];
  }
  return values;
}

/***/ }),

/***/ "./node_modules/underscore/modules/where.js":
/*!**************************************************!*\
  !*** ./node_modules/underscore/modules/where.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ where)
/* harmony export */ });
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter.js */ "./node_modules/underscore/modules/filter.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matcher.js */ "./node_modules/underscore/modules/matcher.js");



// Convenience version of a common use case of `_.filter`: selecting only
// objects containing specific `key:value` pairs.
function where(obj, attrs) {
  return (0,_filter_js__WEBPACK_IMPORTED_MODULE_0__["default"])(obj, (0,_matcher_js__WEBPACK_IMPORTED_MODULE_1__["default"])(attrs));
}

/***/ }),

/***/ "./node_modules/underscore/modules/without.js":
/*!****************************************************!*\
  !*** ./node_modules/underscore/modules/without.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _difference_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./difference.js */ "./node_modules/underscore/modules/difference.js");



// Return a version of the array that does not contain the specified value(s).
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (array, otherArrays) {
  return (0,_difference_js__WEBPACK_IMPORTED_MODULE_1__["default"])(array, otherArrays);
}));

/***/ }),

/***/ "./node_modules/underscore/modules/wrap.js":
/*!*************************************************!*\
  !*** ./node_modules/underscore/modules/wrap.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ wrap)
/* harmony export */ });
/* harmony import */ var _partial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partial.js */ "./node_modules/underscore/modules/partial.js");


// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
function wrap(func, wrapper) {
  return (0,_partial_js__WEBPACK_IMPORTED_MODULE_0__["default"])(wrapper, func);
}

/***/ }),

/***/ "./node_modules/underscore/modules/zip.js":
/*!************************************************!*\
  !*** ./node_modules/underscore/modules/zip.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restArguments.js */ "./node_modules/underscore/modules/restArguments.js");
/* harmony import */ var _unzip_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./unzip.js */ "./node_modules/underscore/modules/unzip.js");



// Zip together multiple lists into a single array -- elements that share
// an index go together.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_restArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_unzip_js__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/main": 0,
/******/ 			"css/main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkconcrete_cms_theme"] = self["webpackChunkconcrete_cms_theme"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./assets/themes/concrete_cms/js/main.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./assets/themes/concrete_cms/scss/main.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;