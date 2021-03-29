<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\Element;

use Concrete\Core\Controller\ElementController;
use Concrete\Core\Navigation\Navigation;

class HeaderNavigation extends ElementController
{

    public function getElement()
    {
        return 'header_navigation';
    }

    public function view()
    {
        $navigation = $this->app->make(Navigation::class);

        /**
         * @var $navigation Navigation
         */

        $this->set('navigation', $navigation);
    }
}