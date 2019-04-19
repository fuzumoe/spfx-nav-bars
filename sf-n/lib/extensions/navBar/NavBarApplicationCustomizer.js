"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("@microsoft/decorators");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_application_base_1 = require("@microsoft/sp-application-base");
var strings = require("NavBarApplicationCustomizerStrings");
var gd_sprest_bs_1 = require("gd-sprest-bs");
var LOG_SOURCE = 'NavBarApplicationCustomizer';
/** A Custom Action which can be run during execution of a Client Side Application */
var NavBarApplicationCustomizer = (function (_super) {
    __extends(NavBarApplicationCustomizer, _super);
    function NavBarApplicationCustomizer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Global Variables
        _this._footer = null;
        _this._header = null;
        return _this;
    }
    NavBarApplicationCustomizer.prototype.onInit = function () {
        sp_core_library_1.Log.info(LOG_SOURCE, "Initialized " + strings.Title);
        // Handle possible changes on the existence of placeholders
        this.context.placeholderProvider.changedEvent.add(this, this.renderNavbars);
        // Render the navbars
        this.renderNavbars();
        return Promise.resolve();
    };
    // Method to render the nav bars
    NavBarApplicationCustomizer.prototype.renderNavbars = function () {
        // See if the header doesn't exist
        if (!this._header) {
            // Create the header
            this._header = this.context.placeholderProvider.tryCreateContent(sp_application_base_1.PlaceholderName.Top);
            // Render the top navbar
            gd_sprest_bs_1.Components.Navbar({
                brand: "Impactory Test",
                el: this._header.domElement,
                type: 1,
                className: 'activeOnes',
                searchBox: {
                    onChange: function (value) {
                        // Log the value
                        console.log("The search value is: " + value);
                    },
                    onSearch: function (value) {
                        // Log the value
                        console.log("The search value is: " + value);
                    }
                },
                items: [
                    {
                        text: "Home"
                    },
                    {
                        text: "Active One",
                        isActive: true,
                    },
                    {
                        text: "Disabled Link",
                        isDisabled: true
                    },
                    {
                        text: "Dropdown Link",
                        items: [
                            { text: "Link 1", isSelected: true },
                            { text: "Link 2" },
                            { text: "Link 3" },
                            { text: "Link 4" },
                            { text: "Link 5" }
                        ]
                    }
                ]
            });
        }
        // See if the footer doesn't exist
        if (!this._footer) {
            // Create the footer
            this._footer = this.context.placeholderProvider.tryCreateContent(sp_application_base_1.PlaceholderName.Bottom);
            // Render the bottom navbar
            gd_sprest_bs_1.Components.Navbar({
                brand: "Impactory Test",
                el: this._footer.domElement
            });
        }
    };
    __decorate([
        decorators_1.override
    ], NavBarApplicationCustomizer.prototype, "onInit", null);
    return NavBarApplicationCustomizer;
}(sp_application_base_1.BaseApplicationCustomizer));
exports.default = NavBarApplicationCustomizer;

//# sourceMappingURL=NavBarApplicationCustomizer.js.map
