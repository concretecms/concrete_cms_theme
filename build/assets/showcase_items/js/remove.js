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

    if (confirm(ccmi18n_community.confirm)) {
        $.ajax({
            url: CCM_DISPATCHER_FILENAME + "/api/v1/showcase_items/delete",
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
                    alert({
                        text: data.message,
                        stack: stackBottomModal,
                        type: 'success'
                    });

                    setTimeout(() => {
                        window.location.reload()
                    }, 5000);
                }
            }
        });
    }
}