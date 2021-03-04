/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

// Import the frontend foundation for themes.
import '@concretecms/bedrock/assets/bedrock/js/frontend';

// Feature support
import '@concretecms/bedrock/assets/account/js/frontend';
import '@concretecms/bedrock/assets/calendar/js/frontend';
import '@concretecms/bedrock/assets/navigation/js/frontend';
import '@concretecms/bedrock/assets/conversations/js/frontend';
import '@concretecms/bedrock/assets/imagery/js/frontend';

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

// Custom assets
import composeMessage from '../../../messages/js/compose';

// Theme stuff
$("#ccm-toggle-mobile-nav").click(function (e) {
    e.preventDefault();

    const activeClass = "is-active";

    if ($(this).hasClass(activeClass)) {
        $(this).removeClass(activeClass);
    } else {
        $(this).addClass(activeClass);
    }
});

// Karma

// Custom assets
import fetchResults from '../../../karma/js/result_list';

if ($(".karma-page").length > 0) {
    $("#load-more a").click(function () {
        fetchResults();
    });

    $(window).scroll(function () {
        if ($(document).height() - $(this).height() == $(this).scrollTop()) {
            fetchResults();
        }
    });
}


/*
 * Send message actions
 */

$(".send-message").click(function (e) {
    e.preventDefault();

    composeMessage($(this).data());
});

window.sendPrivatePrivate = composeMessage;

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

    let messageIds = [];

    $(".ccm-message-item:checked").each(function () {
        messageIds.push($(this).val());
    });

    $.ajax({
        url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/" + $(this).data("action"),
        method: "POST",
        data: {
            messageIds: messageIds,
            box: $("input[name='box']").val()
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
                window.location = window.location.href.split("?")[0];
            }
        }
    });
});

/*
 * Public Profile stuff
 */

let mediumBreakpoint = 991;

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
    let grantedAwardId = $(this).parent().data("awardGrantId");

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
 * Add search functionality for teams
 */

(function ($) {
    $(function () {
        $('.ccm-teams-search')
            .selectpicker({
                liveSearch: true
            })
            .ajaxSelectPicker({
                ajax: {
                    url: CCM_DISPATCHER_FILENAME + '/api/v1/teams/search',
                    data: function () {
                        return {
                            keywords: '{{{q}}}'
                        };
                    }
                },
                preprocessData: function (data) {
                    var teams = [];

                    if (data.hasOwnProperty('teams')) {
                        var len = data.teams.length;
                        for (var i = 0; i < len; i++) {
                            var team = data.teams[i];
                            teams.push(
                                {
                                    'value': team.gID,
                                    'text': team.gName,
                                    'disabled': false
                                }
                            );
                        }
                    }
                    return teams;
                },
                preserveSelected: false
            });
    });
})(jQuery);

/*
 * Display popups for login + register page when clicking on a link item
 */

$("a").click(function (e) {
    if ($(this).attr("href").substr($(this).attr("href").length - 6) === "/login" ||
        $(this).attr("href").substr($(this).attr("href").length - 9) === "/register") {

        e.preventDefault();

        $.ajax({
            url: $(this).attr("href"),
            method: 'GET',
            data: {
                ajax: true
            },
            success: function (html) {
                var $modal =$("<div/>").addClass("modal h-100 d-flex flex-column justify-content-center my-0").attr("role", "dialog").attr("tabindex", "-1").attr("id", "login-register-modal");
                $modal.append(
                    $("<div/>").attr("role", "document").addClass("modal-dialog").append(
                        $("<div/>").addClass("modal-content").append(
                            $("<div/>").addClass("modal-body").html(
                                html
                            )
                        )
                    )
                );
                $(".ccm-page").append($modal);
                $modal.modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        });

        return false;
    }
});