"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var React = require("react");
var ReactDom = require("react-dom");
var decorators_1 = require("@microsoft/decorators");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_application_base_1 = require("@microsoft/sp-application-base");
var strings = require("siteBreadcrumbStrings");
var SiteBreadcrumb_1 = require("./components/SiteBreadcrumb");
var LOG_SOURCE = 'SiteBreadcrumbApplicationCustomizer';
/** A Custom Action which can be run during execution of a Client Side Application */
var SiteBreadcrumbApplicationCustomizer = /** @class */ (function (_super) {
    __extends(SiteBreadcrumbApplicationCustomizer, _super);
    function SiteBreadcrumbApplicationCustomizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SiteBreadcrumbApplicationCustomizer.prototype.onInit = function () {
        sp_core_library_1.Log.info(LOG_SOURCE, "Initialized " + strings.Title);
        // Added to handle possible changes on the existence of placeholders
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
        // Call render method for generating the needed html elements
        this._renderPlaceHolders();
        return Promise.resolve();
    };
    SiteBreadcrumbApplicationCustomizer.prototype._renderPlaceHolders = function () {
        // Check if the header placeholder is already set and if the header placeholder is available
        if (!this._headerPlaceholder && this.context.placeholderProvider.placeholderNames.indexOf(sp_application_base_1.PlaceholderName.Top) !== -1) {
            this._headerPlaceholder = this.context.placeholderProvider.tryCreateContent(sp_application_base_1.PlaceholderName.Top, {
                onDispose: this._onDispose
            });
            // The extension should not assume that the expected placeholder is available.
            if (!this._headerPlaceholder) {
                console.error('The expected placeholder (PageHeader) was not found.');
                return;
            }
            if (this._headerPlaceholder.domElement) {
                var element = React.createElement(SiteBreadcrumb_1.default, {
                    context: this.context
                });
                ReactDom.render(element, this._headerPlaceholder.domElement);
            }
        }
    };
    SiteBreadcrumbApplicationCustomizer.prototype._onDispose = function () {
        console.log('[Breadcrumb._onDispose] Disposed breadcrumb.');
    };
    __decorate([
        decorators_1.override
    ], SiteBreadcrumbApplicationCustomizer.prototype, "onInit", null);
    return SiteBreadcrumbApplicationCustomizer;
}(sp_application_base_1.BaseApplicationCustomizer));
exports.default = SiteBreadcrumbApplicationCustomizer;
//# sourceMappingURL=SiteBreadcrumbApplicationCustomizer.js.map