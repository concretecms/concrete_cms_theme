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

export default () => {
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
        $uploadDetails.addClass("d-none");
        return false;
    });

    $modalDialog.find(".btn-primary").click((e) => {
        e.preventDefault();

        let $form = $modalDialog.find("form");
        let messageData = new FormData($form.get(0));

        $.ajax({
            url: CCM_DISPATCHER_FILENAME + "/api/v1/showcase_items/create",
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