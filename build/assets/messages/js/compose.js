/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

import {alert, Stack, defaultModules} from '@pnotify/core';
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
        receiver: '',
        messageId: ''
    };

    options = $.extend(defaults, options);

    $.ajax({
        url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/compose",
        method: "GET",
        data: {
            msgID: options.messageId,
            uID: options.receiver
        },
        success: (data) => {
            if (data.error) {
                if (data.messageData.requireLogin) {
                    window.displayLoginPopup(CCM_DISPATCHER_FILENAME + "/login?ajax")
                } else {
                    for (let i = 0; i < data.errors.length; i++) {
                        let errorMessage = data.errors[i];

                        /*
                        alert({
                            text: errorMessage,
                            stack: stackBottomModal,
                            type: 'error'
                        });

                         */
                    }
                }
            } else {
                let id = Math.random().toString(36).substr(2, 9);
                let tpl = require('../html/compose.html');
                let $container = $(".ccm-page");

                let html = tpl({
                    id: id,
                    i18n: ccmi18n_community,
                    isReply: data.messageData.uID > 0
                });

                let $html = $(html);

                // Add the required values to the fields
                $html.find(".message-id").val(options.msgID);
                $html.find(".user-id").val(data.messageData.uID);
                $html.find(".user-name").val(data.messageData.uName);
                $html.find(".receiver").val(data.messageData.userName);
                $html.find(".subject").val(data.messageData.msgSubject);
                $html.find(".body").val(data.messageData.msgBody);
                $html.find(".token").val(data.messageData.sendMessageToken);


                $container.append($html);

                let $modalDialog = $container.find("#ccm-composer-message-" + id);

                $modalDialog.find(".upload-item input").change(function () {
                    let $uploadButton = $(this).parent();
                    let $uploadDetails = $modalDialog.find(".files-container");

                    if ($(this).val() == "") {
                        $uploadButton.removeClass("d-none");
                        $uploadDetails.addClass("d-none");
                    } else {
                        $uploadButton.addClass("d-none");
                        $uploadDetails.removeClass("d-none");

                        for (let file of $(this).get(0).files) {
                            let $fileEntry = $("<div></div>").addClass("file-details").append(
                                $("<a></a>").attr("href", "javascript:void(0);").addClass("selected-file").html(file.name)
                            ).append(
                                $("<a></a>").attr("href", "javascript:void(0);").addClass("remove-selected-file").append($("<i></i>").addClass("fas").addClass("fa-trash"))
                            );

                            $fileEntry.find(".remove-selected-file").click(function (e) {
                                e.preventDefault();
                                $uploadButton.removeClass("d-none");
                                $uploadDetails.addClass("d-none");
                                $modalDialog.find(".files-container").html("");
                                $modalDialog.find(".upload-item input").val("");
                                return false;
                            });

                            $modalDialog.find(".files-container").append($fileEntry);
                        }
                    }
                });

                if (typeof data.messageData.uID === "undefined" ||
                    parseInt(data.messageData.uID) === 0 ||
                    data.messageData.uID === "") {

                    $modalDialog.on('shown.bs.modal', () => {
                        // Initalize the user live search
                        $modalDialog.find(".user-name")
                            .selectpicker({liveSearch: true})
                            .ajaxSelectPicker({
                                ajax: {
                                    url: CCM_DISPATCHER_FILENAME + "/ccm/system/user/autocomplete",
                                    data: {
                                        term: '{{{q}}}',
                                        key: 'receiver',
                                        token: data.messageData.searchUserToken
                                    }
                                },
                                locale: ccmi18n_community.userSearch,
                                preserveSelected: false,
                                minLength: 2
                            });
                    });
                }

                // Show the dialog
                $modalDialog.modal();

                if (typeof data.messageData.msgID !== "undefined" && parseInt(data.messageData.msgID) > 0) {
                    // Mark message as read also on client side
                    $("[data-message-id=" + data.messageData.msgID + "]").removeClass("unread");
                }

                $modalDialog.find(".btn-secondary, .close").click((e) => {
                    e.preventDefault();
                    $modalDialog.modal('hide');
                    $modalDialog.remove();
                    return false;
                });

                $modalDialog.find(".btn-primary").click((e) => {
                    e.preventDefault();

                    let $form = $modalDialog.find("form");
                    let messageData = new FormData($form.get(0));

                    $.ajax({
                        url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/send",
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

                                setTimeout(function () {
                                    window.location.href = CCM_DISPATCHER_FILENAME + "/account/messages";
                                }, 3000);

                                $modalDialog.modal('hide');
                                $html.remove();
                            }
                        }
                    });
                })
            }
        }
    });
}