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

    public function container(): string
    {
        $container = parent::container();
        $container = '<div class="ccm-search-results-pagination">' . $container . '</div>';
        return $container;
    }

    public function page($page): string
    {
        return '';
    }

    public function pageWithText($page, $text, ?string $rel = null): string
    {
        return '';
    }

    public function previousDisabled(): string
    {
        return '<li class="page-item disabled"><a href="#" class="page-link" disabled="disabled" onclick="return false">' . t('Previous') . '</a></li>';
    }

    public function previousEnabled($page): string
    {
        $href = $this->generateRoute($page);
        return '<li class="page-item"><a class="page-link" href="' . $href . '">' . t('Previous') . '</a></li>';
    }

    public function nextDisabled(): string
    {
        return '<li class="disabled page-item"><a class="page-link" href="#" disabled="disabled" onclick="return false">' . t('Next') . '</a></li> ';
    }

    public function nextEnabled($page): string
    {
        $href = $this->generateRoute($page);
        return '<li class="page-item"><a class="page-link" href="' . $href . '">' . t('Next'). '</a></li> ';
    }

    public function last($page): string
    {
        return '';
    }

    public function separator(): string
    {
        return '';
    }

    public function current($page): string
    {
        return '';
    }

    public function first(): string
    {
        return '';
    }

}
