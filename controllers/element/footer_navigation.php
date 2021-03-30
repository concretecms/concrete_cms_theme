<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\Element;

use Concrete\Core\Controller\ElementController;
use PortlandLabs\ConcreteCmsTheme\Navigation\FooterNavigationFactory;

class FooterNavigation extends ElementController
{

    public function getElement()
    {
        return 'footer_navigation';
    }

    public function view()
    {
        $navigationFactory = $this->app->make(FooterNavigationFactory::class);

        $this->set('navigation', $navigationFactory->createNavigation());
    }
}