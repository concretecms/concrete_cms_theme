<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Support\Facade\Url;

use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Page\Page;
use Concrete\Core\Permission\Checker;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\User\User;
use Concrete\Core\Validation\CSRF\Token;

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = $app->make(Repository::class);
/** @var Token $token */
$token = $app->make(Token::class);

?>


<ul class="nav navbar-nav navbar-right">
    <li class="nav-item index-1">
        <a href="<?php echo (string)Url::to("/"); ?>" target="_self" class="nav-link ">
            <?php echo t("Home"); ?>
        </a>
    </li>

    <li class="nav-item dropdown index-2">
        <a href="<?php echo (string)Url::to("/about"); ?>" target="_self" class="nav-link  dropdown-toggle"
           data-toggle="dropdown">
            <?php echo t("About"); ?> <span class="caret"></span>
        </a>

        <ul class="dropdown-menu">
            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/about/about"); ?>" target="_self" class="nav-link ">
                    <?php echo t("About"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/about/features"); ?>" target="_self"
                   class="nav-link ">
                    <?php echo t("Features"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/about/case-studies"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Case Studies"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/about/showcase"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Showcase"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/about/testimonials"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Testimonials"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/about/blog"); ?>" target="_self" class="nav-link ">
                    <?php echo t("Blog"); ?>
                </a>
            </li>
        </ul>
    </li>

    <li class="nav-item dropdown index-3">
        <a href="<?php echo (string)Url::to("/hosting"); ?>" target="_self"
           class="nav-link  dropdown-toggle" data-toggle="dropdown">
            <?php echo t("Hosting"); ?> <span class="caret"></span>
        </a>

        <ul class="dropdown-menu">
            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/hosting/themes"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Themes"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/hosting/install-add-ons"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Install Add-ons"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/hosting/hosting"); ?>" target="_self"
                   class="nav-link ">
                    <?php echo t("Hosting"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/hosting/enterprise"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Enterprise"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/hosting/download"); ?>" target="_self"
                   class="nav-link ">
                    <?php echo t("Download"); ?>
                </a>
            </li>
        </ul>
    </li>

    <li class="nav-item dropdown index-4">
        <a href="<?php echo (string)Url::to("/extensions"); ?>" target="_self"
           class="nav-link  dropdown-toggle" data-toggle="dropdown">
            <?php echo t("Extensions"); ?> <span class="caret"></span>
        </a>

        <ul class="dropdown-menu">
            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/extensions/slack"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Slack"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/extensions/forums"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Forums"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/extensions/get-involved"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Get Involved"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/extensions/job-board"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Job Board"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/extensions/international"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("International"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/extensions/marketplace-news"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Marketplace News"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/extensions/security-disclosure"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Security Disclosure"); ?>
                </a>
            </li>
        </ul>
    </li>

    <li class="nav-item active dropdown index-5">
        <a href="<?php echo (string)Url::to("/training"); ?>" target="_self"
           class="nav-link  dropdown-toggle" data-toggle="dropdown">
            <?php echo t("Training"); ?> <span class="caret"></span>
        </a>

        <ul class="dropdown-menu">
            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/training/try-now"); ?>" target="_self"
                   class="nav-link ">
                    <?php echo t("Try Now"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/training/documentation"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Documentation"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/training/installation"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Installation"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/training/tutorials"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Tutorials"); ?>
                </a>
            </li>

            <li class="nav-item active">
                <a href="<?php echo (string)Url::to("/training/training-certification"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Training &amp; Certification"); ?>
                </a>
            </li>
        </ul>
    </li>

    <li class="nav-item dropdown index-6">
        <a href="<?php echo (string)Url::to("/support"); ?>" target="_self"
           class="nav-link  dropdown-toggle" data-toggle="dropdown">
            <?php echo t("Support"); ?> <span class="caret"></span>
        </a>

        <ul class="dropdown-menu">
            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/support/privacy-policy"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Privacy Policy"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/support/terms-use"); ?>" target="_self"
                   class="nav-link ">
                    <?php echo t("Terms of Use"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/support/dmca-take-down"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("DMCA Take Down"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/support/refund-policy"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Refund Policy"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/support/enewsletter"); ?>" target="_self"
                   class="nav-link ">
                    <?php echo t("eNewsletter"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/support/swag"); ?>"
                   target="_self" class="nav-link ">
                    <?php echo t("Swag"); ?>
                </a>
            </li>

            <li class="nav-item">
                <a href="<?php echo (string)Url::to("/support/contact-us"); ?>" target="_self"
                   class="nav-link ">
                    <?php echo t("Contact Us"); ?>
                </a>
            </li>
        </ul>
    </li>

    <?php

    // add search icon
    $searchPageId = (int)$config->get("concrete_cms_theme.search_page_id");
    $searchPage = Page::getByID($searchPageId);

    if ($searchPage instanceof Page && !$searchPage->isError()) {
        echo '<li class="d-none d-lg-block nav-item">';
        echo '<a href="' . (string)Url::to($searchPage) . '" title="' . h(t("Search")) . '" class="nav-link"><i class="fas fa-search"></i></a>';
        echo '</li>';
    }

    // add user icon
    $user = new User();
    $accountPage = Page::getByPath('/account');

    if ($user->isRegistered()) {
        echo '<li class="d-none d-lg-block nav-item">';
        echo '<a href="javascript:void(0);" title="' . h(t("Profile")) . '" class="nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="ccm-account-dropdown"><i class="fas fa-user"></i></a>';

        echo '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="ccm-account-dropdown">';
        echo '<h6 class="dropdown-header">' . t("Profile") . '</h6>';

        $children = $accountPage->getCollectionChildrenArray(true);

        foreach ($children as $cID) {
            $nc = Page::getByID($cID, 'ACTIVE');
            $ncp = new Checker($nc);

            if ($ncp->canRead() && (!$nc->getAttribute('exclude_nav'))) {
                echo '<a class="dropdown-item" href="' . (string)Url::to($nc) . '">' . $nc->getCollectionName() . '</a>';
            }
        }

        echo '<a class="dropdown-item" href="' . (string)Url::to('/members/profile', $user->getUserID()) . '">' . t("View Public Profile") . '</a>';

        echo '<div class="dropdown-divider"></div>';
        echo '<a class="dropdown-item" href="' . (string)Url::to('/login', 'do_logout', $token->generate('do_logout')) . '">' . t("Sign Out") . '</a>';
        echo '</div>';
        echo '</li>';


        echo '<li class="d-block d-lg-none nav-item">';
        echo '<a href="javascript:void(0);" title="' . h(t("Profile")) . '" class="nav-link dropdown-toggle" data-toggle="dropdown" >' . t("Account") . '<span class="caret"></span></a>';

        echo '<ul class="dropdown-menu">';

        $children = $accountPage->getCollectionChildrenArray(true);

        foreach ($children as $cID) {
            $nc = Page::getByID($cID, 'ACTIVE');
            $ncp = new Checker($nc);

            if ($ncp->canRead() && (!$nc->getAttribute('exclude_nav'))) {
                echo '<li class="nav-item"><a class="nav-link" href="' . (string)Url::to($nc) . '">' . $nc->getCollectionName() . '</a></li>';
            }
        }

        echo '<li class="nav-item"><a class="nav-link" href="' . (string)Url::to('/members/profile', $user->getUserID()) . '">' . t("View Public Profile") . '</a></li>';
        echo '<li class="nav-item"><a class="nav-link" href="' . (string)Url::to('/login', 'do_logout', $token->generate('do_logout')) . '">' . t("Sign Out") . '</a></li>';
        echo '</ul>';
    } else {
        echo '<li class="d-none d-lg-block nav-item">';
        echo '<a href="' . (string)Url::to('/login') . '" title="' . h(t("Sign In")) . '" class="nav-link"><i class="fas fa-user"></i></a>';
        echo '</li>';
        echo '<li class="d-block d-lg-none nav-item">';
        echo '<a href="' . (string)Url::to('/login') . '" title="' . h(t("Sign In")) . '" class="nav-link">' . t("Login") . '</a>';
        echo '</li>';
    }
    ?>
</ul>