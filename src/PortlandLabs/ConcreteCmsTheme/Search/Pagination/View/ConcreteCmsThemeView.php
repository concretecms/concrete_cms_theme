<?php

namespace PortlandLabs\ConcreteCmsTheme\Search\Pagination\View;

use Pagerfanta\View\DefaultView;

class ConcreteCmsThemeView extends DefaultView
{

    protected function createDefaultTemplate()
    {
        return new ConcreteCmsThemeTemplate();
    }


}
