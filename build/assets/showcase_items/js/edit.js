/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

import {alert, Stack, defaultModules} from '@pnotify/core';
import * as PNotifyBootstrap4 from '@pnotify/bootstrap4';

defaultModules.set(PNotifyBootstrap4, {});

const stackBottomModal = new Stack({
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

export default (options) => {
    let defaults = {
        showcaseItemId: ''
    };

    options = $.extend(defaults, options);

    $.ajax({
        url: CCM_DISPATCHER_FILENAME + "/api/v1/showcase_items/read",
        method: "GET",
        data: {
            showcaseItemId: options.showcaseItemId
        },
        success: (data) => {
            if (data.error) {
                for (let i = 0; i < data.errors.length; i++) {
                    let errorMessage = data.errors[i];

                    alert({
                        text: errorMessage,
                        stack: stackBottomModal,
                        type: 'error'
                    });
                }
            } else {
                let id = Math.random().toString(36).substr(2, 9);
                let tpl = require('../html/add.html');
                let $container = $(".ccm-page");

                let html = tpl({
                    id: id,
                    i18n: ccmi18n_community
                });

                let $html = $(html);

                $container.append($html);

                let $modalDialog = $container.find("#ccm-add-showcase-item-" + id);

                $modalDialog.find(".token").val(CCM_SECURITY_TOKEN);

                // Show the dialog
                $modalDialog.modal();

                // Add the required values to the fields
                $modalDialog.find(".showcase-item-id").val(options.showcaseItemId);
                $modalDialog.find(".site-url").val(data.showcaseItem.siteUrl);
                $modalDialog.find(".title").val(data.showcaseItem.title);
                $modalDialog.find(".short-description").val(data.showcaseItem.shortDescription);

                if (data.showcaseItem.requiredImage !== null) {
                    $modalDialog.find(".upload-item.required-image .upload-btn-wrapper").addClass("d-none");
                    $modalDialog.find(".upload-item.required-image .file-details").removeClass("d-none");
                    $modalDialog.find(".upload-item.required-image .selected-file").html(data.showcaseItem.requiredImage.fName);
                    $modalDialog.find(".upload-item.required-image .selected-file-id").val(data.showcaseItem.requiredImage.fID);
                }

                if (data.showcaseItem.additionalImage1 !== null) {
                    $modalDialog.find(".upload-item.additional-image-1 .upload-btn-wrapper").addClass("d-none");
                    $modalDialog.find(".upload-item.additional-image-1 .file-details").removeClass("d-none");
                    $modalDialog.find(".upload-item.additional-image-1 .selected-file").html(data.showcaseItem.additionalImage1.fName);
                    $modalDialog.find(".upload-item.additional-image-1 .selected-file-id").val(data.showcaseItem.additionalImage1.fID);
                }

                if (data.showcaseItem.additionalImage2 !== null) {
                    $modalDialog.find(".upload-item.additional-image-2 .upload-btn-wrapper").addClass("d-none");
                    $modalDialog.find(".upload-item.additional-image-2 .file-details").removeClass("d-none");
                    $modalDialog.find(".upload-item.additional-image-2 .selected-file").html(data.showcaseItem.additionalImage2.fName);
                    $modalDialog.find(".upload-item.additional-image-2 .selected-file-id").val(data.showcaseItem.additionalImage2.fID);
                }

                if (data.showcaseItem.additionalImage3 !== null) {
                    $modalDialog.find(".upload-item.additional-image-3 .upload-btn-wrapper").addClass("d-none");
                    $modalDialog.find(".upload-item.additional-image-3 .file-details").removeClass("d-none");
                    $modalDialog.find(".upload-item.additional-image-3 .selected-file").html(data.showcaseItem.additionalImage3.fName);
                    $modalDialog.find(".upload-item.additional-image-3 .selected-file-id").val(data.showcaseItem.additionalImage3.fID);
                }

                $modalDialog.find(".upload-item input").change(function () {
                    let $uploadButton = $(this).parent();
                    let $uploadDetails = $uploadButton.next();

                    if ($(this).val() == "") {
                        $uploadButton.removeClass("d-none");
                        $uploadDetails.addClass("d-none");
                    } else {
                        $uploadButton.addClass("d-none");
                        $uploadDetails.removeClass("d-none");
                        $uploadDetails.find(".selected-file").html($(this).get(0).files.item(0).name);
                    }
                });

                $modalDialog.find(".remove-selected-file").click(function (e) {
                    e.preventDefault();
                    let $uploadDetails = $(this).parent();
                    let $uploadButton = $uploadDetails.prev();
                    $uploadButton.find("input").val("");
                    $uploadDetails.find(".selected-file").html("");
                    $uploadButton.removeClass("d-none");
                    $uploadDetails.find(".selected-file-id").val("");
                    $uploadDetails.addClass("d-none");
                    return false;
                });

                $modalDialog.find(".btn-primary").click((e) => {
                    e.preventDefault();

                    let $form = $modalDialog.find("form");
                    let messageData = new FormData($form.get(0));

                    $.ajax({
                        url: CCM_DISPATCHER_FILENAME + "/api/v1/showcase_items/update",
                        method: "POST",
                        data: messageData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: (data) => {
                            if (data.error) {
                                for (let i = 0; i < data.errors.length; i++) {
                                    let errorMessage = data.errors[i];

                                    alert({
                                        text: errorMessage,
                                        stack: stackBottomModal,
                                        type: 'error'
                                    });
                                }
                            } else {
                                alert({
                                    text: data.message,
                                    stack: stackBottomModal,
                                    type: 'success'
                                });

                                $modalDialog.modal('hide');
                                $html.remove();

                                setTimeout(() => {
                                    window.location.reload()
                                }, 5000);
                            }
                        }
                    });
                })
            }
        }
    });
}