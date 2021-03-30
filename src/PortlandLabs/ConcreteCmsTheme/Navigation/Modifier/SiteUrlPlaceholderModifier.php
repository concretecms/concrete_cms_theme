<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation\Modifier;

use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Item\ItemInterface;
use Concrete\Core\Navigation\NavigationInterface;
use Concrete\Core\Navigation\Modifier\ModifierInterface;
use PortlandLabs\ConcreteCmsTheme\Navigation\UrlManager;

class SiteUrlPlaceholderModifier implements ModifierInterface
{

    /**
     * @var UrlManager
     */
    protected $urlManager;

    public function __construct(UrlManager $urlManager)
    {
        $this->urlManager = $urlManager;
    }

    protected function replaceItems(Item $item)
    {
        $item->setUrl($this->urlManager->replacePlaceholderIfExists($item->getUrl()));
        foreach($item->getChildren() as $child) {
            $this->replaceItems($child);
        }
    }

    public function modify(NavigationInterface $navigation)
    {
        foreach ($navigation->getItems() as $item) {
            $this->replaceItems($item);
        }
    }

}
