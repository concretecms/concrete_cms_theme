<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

use Concrete\Core\Page\Page;
use Concrete\Core\Permission\Checker;
use Concrete\Core\Support\Facade\Url;
use HtmlObject\Element;

defined('C5_EXECUTE') or die("Access Denied.");

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