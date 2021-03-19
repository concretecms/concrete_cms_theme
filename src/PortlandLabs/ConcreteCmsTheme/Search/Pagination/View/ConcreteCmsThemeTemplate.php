<?php

namespace PortlandLabs\ConcreteCmsTheme\Search\Pagination\View;

use Pagerfanta\View\Template\DefaultTemplate;

class ConcreteCmsThemeTemplate extends DefaultTemplate
{

    static protected $defaultOptions = array(
        'previous_message'   => '&lt;&lt; Previous',
        'next_message'       => 'Next &gt;&gt;',
        'css_disabled_class' => 'disabled',
        'css_dots_class'     => 'dots',
        'css_current_class'  => 'current',
        'dots_text'          => '...',
        'container_template' => '<nav>%pages%</nav>',
        'page_template'      => '<a href="%href%"%rel%>%text%</a>',
        'span_template'      => '<span class="%class%">%text%</span>',
        'rel_previous'        => 'prev',
        'rel_next'            => 'next'
    );




}
