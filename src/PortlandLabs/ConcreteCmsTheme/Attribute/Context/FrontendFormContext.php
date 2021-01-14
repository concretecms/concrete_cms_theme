<?php
namespace PortlandLabs\ConcreteCmsTheme\Attribute\Context;

use Concrete\Core\Attribute\Context\BasicFormContext;
use Concrete\Core\Filesystem\TemplateLocator;

class FrontendFormContext extends BasicFormContext
{
    public function __construct()
    {
        parent::__construct();
        $this->preferTemplateIfAvailable('site', 'concrete_cms_theme');
    }

    public function setLocation(TemplateLocator $locator)
    {
        $locator->setTemplate(['site', 'concrete_cms_theme']);
        return $locator;
    }

}
