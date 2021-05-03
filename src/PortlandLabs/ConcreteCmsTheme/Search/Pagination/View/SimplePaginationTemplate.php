<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\Search\Pagination\View;

use Pagerfanta\View\Template\Template;

class SimplePaginationTemplate extends Template
{
    static protected $defaultOptions = [
        'next_message' => 'Next >>',
        'dots_message' => '&hellip;',
        'active_suffix' => '',
        'css_container_class' => 'simple-pagination',
        'css_prev_class' => 'prev',
        'css_next_class' => 'next',
        'css_disabled_class' => 'disabled',
        'css_dots_class' => 'disabled',
        'css_active_class' => 'active',
        'rel_previous' => 'prev',
        'rel_next' => 'next'
    ];

    public function __construct()
    {
        parent::__construct();

        $this->setOptions(['active_suffix' => '(current)']);
    }


    public function page($page)
    {
        $text = $page;

        return $this->pageWithText($page, $text);
    }

    public function pageWithText($page, $text)
    {
        $class = null;

        return $this->pageWithTextAndClass($page, $text, $class);
    }

    private function pageWithTextAndClass($page, $text, $class, $rel = null)
    {
        $href = $this->generateRoute($page);

        return $this->linkLi($class, $href, $text, $rel);
    }

    public function previousDisabled()
    {
        return '';
    }

    public function previousEnabled($page)
    {
        return '';
    }

    public function nextDisabled()
    {
        $class = $this->nextDisabledClass();
        $text = t("Next &gt;&gt;");
        return $this->spanLi($class, $text);
    }

    private function nextDisabledClass()
    {
        return $this->option('css_next_class') . ' ' . $this->option('css_disabled_class');
    }

    public function nextEnabled($page)
    {
        $text = t("Next &gt;&gt;");
        $class = $this->option('css_next_class');
        $rel = $this->option('rel_next');

        return $this->pageWithTextAndClass($page, $text, $class, $rel);
    }

    public function first()
    {
        return $this->page(1);
    }

    public function last($page)
    {
        return $this->page($page);
    }

    public function current($page)
    {
        $text = trim($page . ' ' . $this->option('active_suffix'));
        $class = $this->option('css_active_class');

        return $this->spanLi($class, $text);
    }

    public function separator()
    {
        $class = $this->option('css_dots_class');
        $text = $this->option('dots_message');

        return $this->spanLi($class, $text);
    }

    protected function linkLi($class, $href, $text, $rel = null)
    {
        $liClass = $class ? sprintf(' class="%s"', $class) : '';
        $rel = $rel ? sprintf(' rel="%s"', $rel) : '';

        return sprintf('<li%s><a href="%s"%s>%s</a></li>', $liClass, $href, $rel, $text);
    }

    protected function spanLi($class, $text)
    {
        $liClass = $class ? sprintf(' class="%s"', $class) : '';

        return sprintf('<li%s><span>%s</span></li>', $liClass, $text);
    }

    public function container()
    {
        return sprintf('<ul class="%s">%%pages%%</ul>',
            $this->option('css_container_class')
        );
    }

}
