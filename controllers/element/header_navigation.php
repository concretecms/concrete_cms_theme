<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\Element;

use Concrete\Core\Controller\ElementController;
use Concrete\Core\Validation\CSRF\Token;
use PortlandLabs\ConcreteCmsTheme\Navigation\HeaderNavigationFactory;

class HeaderNavigation extends ElementController
{

    public function getElement()
    {
        return 'header_navigation';
    }

    public function view()
    {
        $navigationFactory = $this->app->make(HeaderNavigationFactory::class);

        $this->set('token', new Token());
        $this->set('navigation', $navigationFactory->createNavigation());
    }
}