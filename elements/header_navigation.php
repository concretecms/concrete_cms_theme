<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Permission\Checker;

/**
 * @var $navigation \Concrete\Core\Navigation\Navigation
 */
$items = $navigation->getItems();

?>

<ul class="nav navbar-nav navbar-right">

    <?php foreach($items as $item) {

        $listClasses = ['nav-item'];
        if ($item->isActive() || $item->isActiveParent()) {
            $listClasses[] = 'active';
        }
        if (count($item->getChildren()) > 0) {
            $listClasses[] = 'dropdown';
        }

        ?>
        <li class="<?=implode($listClasses, ' ')?>">
            <a href="<?=$item->getURL()?>" class="nav-link">
                <?=h($item->getName())?>
            </a>

            <?php if (count($item->getChildren()) > 0) { ?>
                <ul class="dropdown-menu">
                    <?php foreach($item->getChildren() as $child) { ?>
                        <li class="nav-item">
                            <a href="<?=$child->getUrl()?>" target="_self" class="nav-link">
                                <?=h($child->getName())?>
                            </a>
                        </li>
                    <?php } ?>
                </ul>
            <?php } ?>

        </li>
    <?php } ?>

    <?php

    // add search icon
    $searchPageId = (int) Config::get("concrete_cms_theme.search_page_id");
    $searchPage = Page::getByID($searchPageId);

    if ($searchPage instanceof Page && !$searchPage->isError()) {
        echo '<li class="d-none d-lg-block nav-item">';
        echo '<a href="' . (string) \URL::to($searchPage) . '" title="' . h(t("Search")) . '" class="nav-link"><i class="fas fa-search"></i></a>';
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
                echo '<a class="dropdown-item" href="' . (string) \URL::to($nc) . '">' . $nc->getCollectionName() . '</a>';
            }
        }

        echo '<a class="dropdown-item" href="' . (string) \URL::to('/members/profile', $user->getUserID()) . '">' . t("View Public Profile") . '</a>';

        echo '<div class="dropdown-divider"></div>';
        echo '<a class="dropdown-item" href="' . (string) \URL::to('/login', 'do_logout', $token->generate('do_logout')) . '">' . t("Sign Out") . '</a>';
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
                echo '<li class="nav-item"><a class="nav-link" href="' . (string) \URL::to($nc) . '">' . $nc->getCollectionName() . '</a></li>';
            }
        }

        echo '<li class="nav-item"><a class="nav-link" href="' . (string) \URL::to('/members/profile', $user->getUserID()) . '">' . t("View Public Profile") . '</a></li>';
        echo '<li class="nav-item"><a class="nav-link" href="' . (string) \URL::to('/login', 'do_logout', $token->generate('do_logout')) . '">' . t("Sign Out") . '</a></li>';
        echo '</ul>';
    } else {
        echo '<li class="d-none d-lg-block nav-item">';
        echo '<a href="' . (string) \URL::to('/login') . '" title="' . h(t("Sign In")) . '" class="nav-link"><i class="fas fa-user"></i></a>';
        echo '</li>';
        echo '<li class="d-block d-lg-none nav-item">';
        echo '<a href="' . (string) \URL::to('/login') . '" title="' . h(t("Sign In")) . '" class="nav-link">' . t("Login") . '</a>';
        echo '</li>';
    }
    ?>
</ul>


</ul>