<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Page\Page;
use Concrete\Core\Permission\Checker;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\View\View;
use HtmlObject\Element;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = Site::getSite()->getConfigRepository();

$overrideSubNav = (bool)$config->get("concrete_cms_theme.override_sub_nav", false);
$elementsPackageHandle = $config->get("concrete_cms_theme.elements_package_handle", "concrete_cms_theme");

if ($overrideSubNav && $elementsPackageHandle != "") {
    /** @noinspection PhpUnhandledExceptionInspection */
    echo View::element("sub_nav", [], $elementsPackageHandle);
} else {
    $curPage = Page::getCurrentPage();

    $ul = new Element("ul");

    if ($curPage instanceof Page && !$curPage->isError()) {
        $parentPage = Page::getByID($curPage->getCollectionParentID());

        if ($parentPage instanceof Page && !$parentPage->isError()) {
            foreach ($parentPage->getCollectionChildren() as $childPage) {
                $childPagePermissions = new Checker($childPage);

                /** @noinspection PhpUndefinedMethodInspection */
                if ($childPagePermissions->canRead() && (!$childPage->getAttribute('exclude_nav'))) {
                    $li = new Element("li");

                    if ($curPage->getCollectionID() === $childPage->getCollectionID()) {
                        $li->addClass("active");
                    }

                    $li->appendChild(new Element("a", $childPage->getCollectionName(), [
                        "href" => (string)Url::to($childPage)
                    ]));

                    $ul->appendChild($li);
                }
            }

            ?>
            <div id="ccm-sub-nav">
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <h3>
                                <?php echo $parentPage->getCollectionName(); ?>
                            </h3>

                            <nav>
                                <?php echo (string)$ul; ?>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <?php
        }
    }
}