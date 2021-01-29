<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Support\Facade\Url;

?>
<div class="row">
    <div class="col-md">
        <div class="footer-navigation">
            <div class="d-none d-md-block">
                <ul class="list-unstyled">
                    <h4 class="page-title">
                        <?php echo t("About"); ?>
                    </h4>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/about"); ?>"
                           target="_self">
                            <?php echo t("About"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/features"); ?>"
                           target="_self">
                            <?php echo t("Features"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/case-studies"); ?>"
                           target="_self">
                            <?php echo t("Case Studies"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/showcase"); ?>"
                           target="_self">
                            <?php echo t("Showcase"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/testimonials"); ?>"
                           target="_self">
                            <?php echo t("Testimonials"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/blog"); ?>" target="_self">
                            <?php echo t("Blog"); ?>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="block d-md-none">
                <h4 data-toggle="collapse" href="#ccm-accordion-d7293af89446145a"
                    role="button" aria-expanded="false"
                    aria-controls="ccm-accordion-d7293af89446145a" class="page-title">
                    <?php echo t("About"); ?>
                </h4>

                <ul id="ccm-accordion-d7293af89446145a" class="list-unstyled collapse multi-collapsecollapse show"
                    data-parent="footer">

                    <li>
                        <a href="<?php echo (string)Url::to("/about/about"); ?>"
                           target="_self">
                            <?php echo t("About"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/features"); ?>"
                           target="_self">
                            <?php echo t("Features"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/case-studies"); ?>"
                           target="_self">
                            <?php echo t("Case Studies"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/showcase"); ?>"
                           target="_self">
                            <?php echo t("Showcase"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/testimonials"); ?>"
                           target="_self">
                            <?php echo t("Testimonials"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/about/blog"); ?>" target="_self">
                            <?php echo t("Blog"); ?>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="col-md">
        <div class="footer-navigation">
            <div class="d-none d-md-block">
                <ul class="list-unstyled">
                    <h4 class="page-title">
                        <?php echo t("Hosting"); ?>
                    </h4>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/themes"); ?>"
                           target="_self">
                            <?php echo t("Themes"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/install-add-ons"); ?>"
                           target="_self">
                            <?php echo t("Install Add-ons"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/hosting"); ?>"
                           target="_self">
                            <?php echo t("Hosting"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/enterprise"); ?>"
                           target="_self">
                            <?php echo t("Enterprise"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/download"); ?>"
                           target="_self">
                            <?php echo t("Download"); ?>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="block d-md-none">
                <h4 data-toggle="collapse" href="#ccm-accordion-d89976d0ab0935ff"
                    role="button" aria-expanded="false"
                    aria-controls="ccm-accordion-d89976d0ab0935ff" class="page-title">
                    <?php echo t("Hosting"); ?>
                </h4>

                <ul id="ccm-accordion-d89976d0ab0935ff" class="list-unstyled collapse multi-collapse"
                    data-parent="footer">
                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/themes"); ?>"
                           target="_self">
                            <?php echo t("Themes"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/install-add-ons"); ?>"
                           target="_self">
                            <?php echo t("Install Add-ons"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/hosting"); ?>"
                           target="_self">
                            <?php echo t("Hosting"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/enterprise"); ?>"
                           target="_self">
                            <?php echo t("Enterprise"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/hosting/download"); ?>"
                           target="_self">
                            <?php echo t("Download"); ?>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="col-md">
        <div class="footer-navigation">
            <div class="d-none d-md-block">
                <ul class="list-unstyled">
                    <h4 class="page-title">
                        <?php echo t("Extensions"); ?>
                    </h4>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/slack"); ?>"
                           target="_self">
                            <?php echo t("Slack"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/forums"); ?>"
                           target="_self">
                            <?php echo t("Forums"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/get-involved"); ?>"
                           target="_self">
                            <?php echo t("Get Involved"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/job-board"); ?>"
                           target="_self">
                            <?php echo t("Job Board"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/international"); ?>"
                           target="_self">
                            <?php echo t("International"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/marketplace-news"); ?>"
                           target="_self">
                            <?php echo t("Marketplace News"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/security-disclosure"); ?>"
                           target="_self">
                            <?php echo t("Security Disclosure"); ?>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="block d-md-none">
                <h4 data-toggle="collapse" href="#ccm-accordion-fd538a002173c8b6"
                    role="button" aria-expanded="false"
                    aria-controls="ccm-accordion-fd538a002173c8b6" class="page-title">
                    <?php echo t("Extensions"); ?>
                </h4>

                <ul id="ccm-accordion-fd538a002173c8b6" class="list-unstyled collapse multi-collapse"
                    data-parent="footer">
                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/slack"); ?>"
                           target="_self">
                            <?php echo t("Slack"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/forums"); ?>"
                           target="_self">
                            <?php echo t("Forums"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/get-involved"); ?>"
                           target="_self">
                            <?php echo t("Get Involved"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/job-board"); ?>"
                           target="_self">
                            <?php echo t("Job Board"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/international"); ?>"
                           target="_self">
                            <?php echo t("International"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/marketplace-news"); ?>"
                           target="_self">
                            <?php echo t("Marketplace News"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/extensions/security-disclosure"); ?>"
                           target="_self">
                            <?php echo t("Security Disclosure"); ?>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="col-md">
        <div class="footer-navigation">
            <div class="d-none d-md-block">
                <ul class="list-unstyled">
                    <h4 class="page-title">
                        <?php echo t("Training"); ?>
                    </h4>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/try-now"); ?>" target="_self">
                            <?php echo t("Try Now"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/documentation"); ?>"
                           target="_self">
                            <?php echo t("Documentation"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/installation"); ?>" target="_self">
                            <?php echo t("Installation"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/tutorials"); ?>" target="_self">
                            <?php echo t("Tutorials"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/training-certification"); ?>"
                           target="_self">
                            <?php echo t("Training &amp; Certification"); ?>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="block d-md-none">
                <h4 data-toggle="collapse" href="#ccm-accordion-30ea7625b5004f8c"
                    role="button" aria-expanded="false"
                    aria-controls="ccm-accordion-30ea7625b5004f8c" class="page-title">
                    <?php echo t("Training"); ?>
                </h4>

                <ul id="ccm-accordion-30ea7625b5004f8c" class="list-unstyled collapse multi-collapse"
                    data-parent="footer">
                    <li>
                        <a href="<?php echo (string)Url::to("/training/try-now"); ?>" target="_self">
                            <?php echo t("Try Now"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/documentation"); ?>" target="_self">
                            <?php echo t("Documentation"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/installation"); ?>" target="_self">
                            <?php echo t("Installation"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/tutorials"); ?>" target="_self">
                            <?php echo t("Tutorials"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/training/training-certification"); ?>"
                           target="_self">
                            <?php echo t("Training &amp; Certification"); ?>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="col-md">
        <div class="footer-navigation">
            <div class="d-none d-md-block">
                <ul class="list-unstyled">
                    <h4 class="page-title">
                        <?php echo t("Support"); ?>
                    </h4>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/privacy-policy"); ?>"
                           target="_self">
                            <?php echo t("Privacy Policy"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/terms-use"); ?>"
                           target="_self">
                            <?php echo t("Terms of Use"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/dmca-take-down"); ?>"
                           target="_self">
                            <?php echo t("DMCA Take Down"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/refund-policy"); ?>"
                           target="_self">
                            <?php echo t("Refund Policy"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/enewsletter"); ?>"
                           target="_self">
                            <?php echo t("eNewsletter"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/swag"); ?>"
                           target="_self">
                            <?php echo t("Swag"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/contact-us"); ?>"
                           target="_self">
                            <?php echo t("Contact Us"); ?>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="block d-md-none">
                <h4 data-toggle="collapse" href="#ccm-accordion-90ee382c55070385"
                    role="button" aria-expanded="false"
                    aria-controls="ccm-accordion-90ee382c55070385" class="page-title">
                    <?php echo t("Support"); ?>
                </h4>

                <ul id="ccm-accordion-90ee382c55070385" class="list-unstyled collapse multi-collapse"
                    data-parent="footer">
                    <li>
                        <a href="<?php echo (string)Url::to("/support/privacy-policy"); ?>"
                           target="_self">
                            <?php echo t("Privacy Policy"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/terms-use"); ?>"
                           target="_self">
                            <?php echo t("Terms of Use"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/dmca-take-down"); ?>"
                           target="_self">
                            <?php echo t("DMCA Take Down"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/refund-policy"); ?>"
                           target="_self">
                            <?php echo t("Refund Policy"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/enewsletter"); ?>"
                           target="_self">
                            <?php echo t("eNewsletter"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/swag"); ?>"
                           target="_self">
                            <?php echo t("Swag"); ?>
                        </a>
                    </li>

                    <li>
                        <a href="<?php echo (string)Url::to("/support/contact-us"); ?>"
                           target="_self">
                            <?php echo t("Contact Us"); ?>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>