/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

let currentPage = 2;

export default (options) => {
    let tpl = require('../html/result_list.html');

    if ($("#load-more").hasClass("d-none")) {
        return;
    }

    $.ajax({
        url: CCM_DISPATCHER_FILENAME + "/account/karma/fetch_results",
        method: "GET",
        data: {
            ccm_paging_p: currentPage,
        },
        success: (response) => {
            let html = tpl(response);

            $("#karma-container").append(html);

            if (!response.hasNextPage) {
                $("#load-more").addClass("d-none")
            } else {
                currentPage++;
            }
        }
    });
}