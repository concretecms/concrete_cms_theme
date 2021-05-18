<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Modifier\FlatChildrenModifier;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationInterface;
use Concrete\Core\Navigation\NavigationModifier;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class HeaderNavigationFactory implements ApplicationAwareInterface, NavigationFactoryInterface
{

    use ApplicationAwareTrait;
    use NavigationFactoryTrait;

    const SECTION_SUPPORT = 'support';
    const SECTION_COMMUNITY = 'community';

    public function createNavigation(): NavigationInterface
    {
        $activeSection = $this->activeSection;

        $navigation = new Navigation();
        $navigation->add(new Item('{{marketing}}/about', t('About'), false, false, [
            new Item('{{marketing}}/about/features', t('Features')),
            new Item('{{marketing}}/about/blog', t('Blog')),
            new Item('{{marketing}}/about/case-studies', t('Case Studies')),
            new Item('{{marketing}}/about/governance', t('Governance')),
            new Item('{{marketing_org}}', t('Open Source')),
        ]));
        $navigation->add(new Item('{{marketing}}/get-started', t('Get Started'), false, false, [
            new Item('{{marketing}}/get-started/try', t('Try it Now!')),
            new Item('{{marketing_org}}/download', t('Download')),
            new Item('{{marketing}}/installation', t('Installation')),
        ]));
        $navigation->add(new Item('{{marketplace}}', t('Extensions'), false, false));
        $navigation->add(new Item('{{marketing}}/support', t('Support'), false, $activeSection === 'support', [
            new Item('{{documentation}}', t('Documentation')),
            new Item('{{training}}', t('Training & Certification')),
            new Item('{{gigs}}', t('Hire Help')),
        ]));
        $navigation->add(new Item('{{community}}', t('Community'), false, $activeSection === 'community', [
            new Item('{{forums}}', t('Forums')),
            new Item('{{community}}/members', t('Members')),
            new Item('{{translate}}', t('Translate Concrete')),
        ]));

        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }
}
