<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Block\Autonav\Controller;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Identifier;

/** @var Controller $controller */

$navItems = $controller->getNavItems();
$c = Page::getCurrentPage();

$app = Application::getFacadeApplication();
/** @var Identifier $idHelper */
$idHelper = $app->make(Identifier::class);

$childrenSelected = false;

foreach ($navItems as $ni) {
    $classes = array();

    if ($ni->isCurrent) {
        $classes[] = 'nav-selected';
        $childrenSelected = true;
    }

    if ($ni->inPath) {
        $classes[] = 'nav-path-selected';
        $childrenSelected = true;
    }

    $ni->classes = implode(" ", $classes);
}

if (count($navItems) > 0) {


    $parentPage = Page::getByID(array_pop(array_reverse($navItems))->cObj->getCollectionParentID());

    echo '<div class="d-none d-md-block">';
    echo '<ul class="list-unstyled">'; //opens the top-level menu

    echo '<h4 class="page-title">' . $parentPage->getCollectionName() . '</h4>';

    foreach ($navItems as $ni) {
        echo '<li class="' . $ni->classes . '">'; //opens a nav item
        echo '<a href="' . $ni->url . '" target="' . $ni->target . '" class="' . $ni->classes . '">' . h($ni->name) . '</a>';

        if ($ni->hasSubmenu) {
            echo '<ul>'; //opens a dropdown sub-menu
        } else {
            echo '</li>'; //closes a nav item

            echo str_repeat('</ul></li>', $ni->subDepth); //closes dropdown sub-menu(s) and their top-level nav item(s)
        }
    }

    echo '</ul>'; //closes the top-level menu
    echo "</div>";

    /*
     * Mobile View
     */

    echo '<div class="block d-md-none">';

    $accordionId = "ccm-accordion-" . $idHelper->getString(16);

    echo '<h4 data-toggle="collapse" href="#' . $accordionId . '" role="button" aria-expanded="false" aria-controls="' . $accordionId . '" class="page-title">' . $parentPage->getCollectionName() . '</h4>';

    echo '<ul id="' . $accordionId . '" class="list-unstyled collapse multi-collapse' . ($childrenSelected ? "collapse show" : "") . '" data-parent="footer">'; //opens the top-level menu

    foreach ($navItems as $ni) {
        echo '<li class="' . $ni->classes . '">'; //opens a nav item
        echo '<a href="' . $ni->url . '" target="' . $ni->target . '" class="' . $ni->classes . '">' . h($ni->name) . '</a>';

        if ($ni->hasSubmenu) {
            echo '<ul>'; //opens a dropdown sub-menu
        } else {
            echo '</li>'; //closes a nav item

            echo str_repeat('</ul></li>', $ni->subDepth); //closes dropdown sub-menu(s) and their top-level nav item(s)
        }
    }

    echo '</ul>'; //closes the top-level menu
    echo "</div>";

} elseif (is_object($c) && $c->isEditMode()) {
    ?>
    <div class="ccm-edit-mode-disabled-item">
        <?php echo t('Empty Auto-Nav Block.') ?>
    </div>
<?php }
