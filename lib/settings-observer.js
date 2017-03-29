'use strict';

const deepEqual = require('deep-equal');

class SettingsObserver {

  constructor(settings, keyPath, handler) {

    /**
     * A reference to the Settings instance.
     *
     * @type {Settings}
     * @private
     */
    this._settings = settings;

    /**
     * The key path that this observer instance is watching for changes.
     *
     * @type {string}
     * @private
     */
    this._keyPath = keyPath;

    /**
     * The handler function to be called when the value at the observed
     * key path is changed.
     *
     * @type {Function}
     * @private
     */
    this._handler = handler;

    /**
     * The current value of the setting at the given key path.
     *
     * @type {any}
     * @private
     */
    this._currentValue = this._settings.get(this._keyPath);

    /**
     * Called when the settings file is changed.
     *
     * @type {Object}
     * @private
     */
    this._handleChange = this._onChange.bind(this);

    this._init();
  }

  /**
   * Initializes this instance.
   *
   * @private
   */
  _init() {
    this._initEventListeners();
  }

  /**
   * Initializes event listeners.
   *
   * @private
   */
  _initEventListeners() {
    this._settings.on('change', this._handleChange);
  }

  /**
   * Called when the settings file is changed.
   *
   * @private
   */
  _onChange() {
    const oldValue = this._currentValue;
    const newValue = this._settings.get(this._keyPath);

    if (!deepEqual(newValue, oldValue)) {
      this._currentValue = Object.assign({}, newValue);

      // Call the watch handler and pass in the new and old values.
      this._handler.call(this, newValue, oldValue);
    }
  }

  /**
   * Disposes of this key path observer.
   *
   * @public
   */
  dispose() {
    this._settings.removeListener('change', this._handleChange);
  }
}

module.exports = SettingsObserver;