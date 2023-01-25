<?php

defined('C5_EXECUTE') or die("Access Denied.");
use PortlandLabs\ConcreteCmsTheme\SEO\OpenGraph as OG;
/**
 * @var $c \Concrete\Core\Page\Page
 */
$c = $c ?? null;

if (isset($c) && $c instanceof \Concrete\Core\Page\Page) {
    if ((!isset($ogImage) || !$ogImage) && $thumb = $c->getAttribute('thumbnail')) {
        if ($version = $thumb->getVersion()) {
            $ogImage = $version->getURL();
        }
    }

    $og = app(OG::class)
        ->setDefault(OG::TAG_OG_TITLE, $c->getCollectionName())
        ->setDefault(OG::TAG_OG_URL, $c->getCollectionLink())
        ->setDefault(OG::TAG_OG_DESCRIPTION, $c->getCollectionDescription())
        ->setDefault(OG::TAG_OG_TYPE, 'website')
        ->setDefault(OG::TAG_OG_IMAGE, $ogImage ?? null);

    foreach ($og->getMarkup() as $tag) {
        echo PHP_EOL . $tag;
    }
}
