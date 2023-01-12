/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

export default (options) => {
    // ccmi18n_community

    let defaults = {
        i18n: {
            title: ccmi18n_community.confirm,
            message: ccmi18n_community.confirm,
            cancelButton: ccmi18n_community.cancelButton,
            confirmButton: ccmi18n_community.okayButton
        }
    };

    options = $.extend(defaults, options);

    let tpl = require('../html/confirm.html');
    let id = Math.random().toString(36).substr(2, 9);
    let $container = $(".ccm-page");

    let html = tpl({
        id: id,
        i18n: options.i18n
    });

    let $html = $(html);

    $container.append($html);

    let $modalDialog = $container.find("#ccm-confirm-dialog-" + id);

    $modalDialog.find(".btn-secondary, .close").click((e) => {
        e.preventDefault();
        $modalDialog.modal('hide');
        $modalDialog.remove();
        return false;
    });

    const modal = new bootstrap.Modal('#' + $modalDialog.attr('id'))
    modal.show()

    $html.find(".btn-primary").click(() => {
        $modalDialog.modal("hide");
        $modalDialog.remove();

        if (typeof options.onConfirm === "function") {
            options.onConfirm();
        }
    });

    $modalDialog.modal();
}