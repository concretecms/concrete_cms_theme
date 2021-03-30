<?php

namespace PortlandLabs\ConcreteCmsTheme\Search\Pagination\View;

use Concrete\Core\Search\Pagination\View\ViewInterface;
use Pagerfanta\View\DefaultView;

/**
 * This is a simplified pagination used in Gary's comps for the hosting control panel.
 * It's got some weird inconsistencies when used elsewhere it's not in the right DIV so
 * for now let's just use the bootstrap 4 pagination we're using elsewhere.
 *
 * Class ConcreteCmsThemeView
 * @package PortlandLabs\ConcreteCmsTheme\Search\Pagination\View
 */
class ConcreteCmsThemeView extends DefaultView implements ViewInterface
{

    protected function createDefaultTemplate()
    {
        return new ConcreteCmsThemeTemplate();
    }

    public function getArguments()
    {
        return [];
    }



}
