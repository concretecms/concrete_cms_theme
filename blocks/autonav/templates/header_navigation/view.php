<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Block\Autonav\Controller;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Page\Page;
use Concrete\Core\Permission\Checker;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\User;
use Concrete\Core\Validation\CSRF\Token;

/** @var Controller $controller */

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = $app->make(Repository::class);
/** @var Token $token */
$token = $app->make(Token::class);

$navItems = $controller->getNavItems();

$topLevelIndexCounter = 0;

foreach ($navItems as $ni) {
    $classes = [];

    $classes[] = 'nav-item';

    if ($ni->isCurrent || $ni->inPath) {
        $classes[] = 'active';
    }

    if ($ni->hasSubmenu) {
        //class for items that have dropdown sub-menus
        $classes[] = 'dropdown';
    }

    if ($ni->level == 1) {
        $topLevelIndexCounter++;
        $classes[] = 'index-' . $topLevelIndexCounter;
    }

    //Put all classes together into one space-separated string
    $ni->classes = implode(" ", $classes);
}


//*** Step 2 of 2: Output menu HTML ***/

echo '<ul class="nav navbar-nav navbar-right' . '' . '">'; //opens the top-level menu

foreach ($navItems as $ni) {
    $dataToggle = '';
    $dropdownClass = '';
    $dropdownCarrot = '';
    if ($ni->hasSubmenu) {
        $dataToggle = ' data-toggle="dropdown"';
        $dropdownClass = ' dropdown-toggle';
        $dropdownCarrot = ' <span class="caret"></span>';
    }

    echo '<li class="' . $ni->classes . '">'; //opens a nav item

    echo '<a href="' . $ni->url . '" target="' . $ni->target . '" class="nav-link ' . $dropdownClass . '"' . $dataToggle . '>' . $ni->name . $dropdownCarrot . '</a>';

    if ($ni->hasSubmenu) {
        echo '<ul class="dropdown-menu">'; //opens a dropdown sub-menu
    } else {
        echo '</li>'; //closes a nav item
        echo str_repeat('</ul></li>', $ni->subDepth); //closes dropdown sub-menu(s) and their top-level nav item(s)
    }
}

$curPage = Page::getCurrentPage();
$selectedPathCIDs = [$curPage->getCollectionID()];

while (true) {
    $selectedPathCIDs[] = $curPage->getCollectionParentID();

    if ($curPage->getCollectionParentID() == $curPage->getCollectionID()) {
        break;
    } else {
        $curPage = Page::getByID($curPage->getCollectionParentID());

        if ($curPage->isError()) {
            break;
        }
    }
}

// add search icon
$searchPageId = (int)$config->get("concrete_cms_theme.search_page_id");
$searchPage = Page::getByID($searchPageId);

if ($searchPage instanceof Page && !$searchPage->isError()) {
    echo '<li class="d-none d-lg-block nav-item' . (in_array($searchPage->getCollectionID(), $selectedPathCIDs) ? " active" : "") . '">';
    echo '<a href="' . (string)Url::to($searchPage) . '" title="' . h(t("Search")) . '" class="nav-link"><i class="fas fa-search"></i></a>';
    echo '</li>';
}

// add user icon
$user = new User();
$accountPage = Page::getByPath('/account');

if ($user->isRegistered()) {
    echo '<li class="d-none d-lg-block nav-item' . (in_array($accountPage->getCollectionID(), $selectedPathCIDs) ? " active" : "") . '">';
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


    echo '<li class="d-block d-lg-none nav-item' . (in_array($accountPage->getCollectionID(), $selectedPathCIDs) ? " active" : "") . '">';
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
    echo '<li class="d-none d-lg-block nav-item' . (in_array($accountPage->getCollectionID(), $selectedPathCIDs) ? " active" : "") . '">';
    echo '<a href="' . (string)Url::to('/login') . '" title="' . h(t("Sign In")) . '" class="nav-link"><i class="fas fa-user"></i></a>';
    echo '</li>';
    echo '<li class="d-block d-lg-none nav-item' . (in_array($accountPage->getCollectionID(), $selectedPathCIDs) ? " active" : "") . '">';
    echo '<a href="' . (string)Url::to('/login') . '" title="' . h(t("Sign In")) . '" class="nav-link">' . t("Login") . '</a>';
    echo '</li>';
}

echo '</ul>'; //closes the top-level menu