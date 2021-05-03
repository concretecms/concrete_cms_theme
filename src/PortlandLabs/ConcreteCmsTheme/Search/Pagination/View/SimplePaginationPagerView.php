<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\Search\Pagination\View;

use Concrete\Core\Search\Pagination\View\ConcreteBootstrap4View;

class SimplePaginationPagerView extends ConcreteBootstrap4View
{
    protected function createDefaultTemplate()
    {
        return new SimplePaginationPagerTemplate();
    }
}
