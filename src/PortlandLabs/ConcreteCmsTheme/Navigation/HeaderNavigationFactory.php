<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\Application;
use Concrete\Core\Navigation\NavigationInterface;
use Concrete\Core\Navigation\NavigationModifier;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class HeaderNavigationFactory implements NavigationFactoryInterface
{

    const SECTION_DOCUMENTATION = 'documentation';
    const SECTION_COMMUNITY = 'community';

    use NavigationFactoryTrait;

    /**
     * @var UrlManager
     */
    protected $urlManager;

    /**
     * @var Application
     */
    protected $app;

    public function __construct(Application $app, UrlManager $urlManager)
    {
        $this->app = $app;
        $this->urlManager = $urlManager;
    }

    public function createNavigation(): NavigationInterface
    {
        if ($this->urlManager->isSite('marketing_org')
            || $this->urlManager->isSite('translate')
            || $this->urlManager->isSite('documentation')) {
            $navigation = new OpenSourceHeaderNavigation($this->activeSection);
        } else {
            $navigation = new CommercialNavigation($this->activeSection);
        }

        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }
}
