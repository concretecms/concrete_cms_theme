<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Navigation;

class MarketplaceHeaderNavigation extends Navigation
{

    /**
     * @param string $activeSection
     */
    public function __construct(string $activeSection = null)
    {
        $this->add(new Item('{{extensions}}/themes', t('Themes'), $activeSection === 'themes'));
        $this->add(new Item('{{extensions}}/addons', t('Add-Ons'), $activeSection === 'addons'));
        $this->add(new Item('{{extensions}}/integrations', t('Integrations'), $activeSection === 'integrations'));
        $this->add(new Item('{{extensions}}/platforms', t('Platforms'), $activeSection === 'platforms'));
        $this->add(new Item('{{extensions}}/hosting', t('Hosting'), $activeSection === 'hosting'));
        $this->add(new Item('{{extensions}}/services', t('Services'), $activeSection === 'services'));
    }
}
