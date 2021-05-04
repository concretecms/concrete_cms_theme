<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\Search\Pagination\View;

use Concrete\Core\Search\Pagination\View\ConcreteBootstrap4Template;

class SimplePaginationPagerTemplate extends ConcreteBootstrap4Template
{

    public function container()
    {
        $container = parent::container();
        $container = '<div class="ccm-search-results-pagination">' . $container . '</div>';
        return $container;
    }

    public function page($page)
    {
        return null;
    }

    public function pageWithText($page, $text)
    {
        return null;
    }

    public function previousDisabled()
    {
        return '<li class="page-item disabled"><a href="#" class="page-link" disabled="disabled" onclick="return false">' . t('Previous') . '</a></li>';
    }

    public function previousEnabled($page)
    {
        $href = $this->generateRoute($page);
        return '<li class="page-item"><a class="page-link" href="' . $href . '">' . t('Previous') . '</a></li>';
    }

    public function nextDisabled()
    {
        return '<li class="disabled page-item"><a class="page-link" href="#" disabled="disabled" onclick="return false">' . t('Next') . '</a></li> ';
    }

    public function nextEnabled($page)
    {
        $href = $this->generateRoute($page);
        return '<li class="page-item"><a class="page-link" href="' . $href . '">' . t('Next'). '</a></li> ';
    }

    public function last($page)
    {
        return null;
    }

    public function separator()
    {
        return null;
    }

    public function current($page)
    {
        return null;
    }

    public function first()
    {
        return null;
    }

}
