<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Permission\Checker;

/**
 * @var $headerNavigation \Concrete\Core\Navigation\Navigation
 */
$items = $headerNavigation->getItems();

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
    ?>

    <?php
    /** @var \Concrete\Core\Navigation\NavigationInterface $accountNavigation */
    foreach($accountNavigation->getItems() as $item) {

        $listClasses = ['nav-item'];
        if ($item->isActive() || $item->isActiveParent()) {
            $listClasses[] = 'active';
        }
        if (count($item->getChildren()) > 0) {
            $listClasses[] = 'dropdown';
        }

        $name = h($item->getName());
        if (in_array($item->getUrl(), ['/account/welcome', '/login'])) {
            $name = '<i class="fa fa-user" title="' . $name . '"></i>';
        }
        ?>
        <li class="<?=implode($listClasses, ' ')?>">
            <a href="<?=$item->getURL()?>" class="nav-link">
                <?= $name ?>
            </a>

            <?php
            $children = $item->getChildren();
            $count = count($children);
            if ($count > 0) { ?>
                <ul class="dropdown-menu">
                    <?php foreach($item->getChildren() as $key => $child) {
                        // Last child gets a divider
                        if ($key === $count - 1) {
                            echo '<li class="dropdown-divider"></li>';
                        }
                        ?>
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
</ul>
